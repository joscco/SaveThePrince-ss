import {Grid} from "./Grid";
import {WinScreen} from "./WinScreen";
import {GridEntity} from "./entities/GridEntity";
import {Vector2D, vector2Equals} from "../general/MathUtils";
import {GAME_HEIGHT, GAME_WIDTH} from "../Game";
import {MainGameScene} from "../scenes/MainGameScene";
import Pointer = Phaser.Input.Pointer;
import {EntityId} from "./entities/EntityId";

export type LevelConfig = {
    level: number,
    rows: number,
    columns: number,
    entities: LevelConfigEntityData[]
}

export type LevelConfigEntityData = {
    id: EntityId,
    x: number,
    y: number,
    movable: boolean,
    blendInAt: number
}

export class LevelManager {
    scene: MainGameScene
    grid: Grid
    winScreen: WinScreen
    levelResolved: boolean = false
    moving: boolean = false
    waitingForNextPosition: boolean = false
    entityWaitingForInput: GridEntity = undefined
    private levelConfig: LevelConfig;

    constructor(scene: MainGameScene, levelConfig: LevelConfig) {
        this.scene = scene
        this.levelConfig = levelConfig
    }

    async resolveLevel() {
        this.levelResolved = true
        await this.winScreen.blendIn()
    }

    removeEntityAt(index: Vector2D) {
        this.grid.removeEntityAt(index)
    }

    private async setupLevel(levelConfig: LevelConfig) {
        this.grid.init(levelConfig.columns, levelConfig.rows, {x: 125, y: -75}, {x: 125, y: 75})
        await this.grid.blendInGridInRandomOrder()

        for (let entityData of levelConfig.entities) {
            this.grid.initEntityAt({x: entityData.x, y: entityData.y}, entityData.id, entityData.movable)
                .blendIn(entityData.blendInAt).then()
        }
        await this.grid.checkNeighbors()
    }

    init() {
        this.grid = new Grid(this.scene, GAME_WIDTH / 2, GAME_HEIGHT / 2)
        this.winScreen = new WinScreen(this.scene, GAME_WIDTH / 2, GAME_HEIGHT / 2)
        this.setupLevel(this.levelConfig)

        this.scene.input.on('pointerup', async (pointer: Pointer) => {
            await this.handleClick(pointer);
        })

        this.scene.input.on('pointerupoutside', async (pointer: Pointer) => {
            await this.handleClick(pointer);
        })
    }

    private async handleClick(pointer: Phaser.Input.Pointer) {
        let pointerIndex = this.grid.getClosestFieldIndexTo(pointer)
        if (!this.moving && !this.levelResolved) {
            if (this.waitingForNextPosition) {
                await this.handleClickOnIndexAfterSelectingEntity(pointerIndex);
            } else {
                await this.trySelectingEntityOnIndex(pointerIndex);
            }
        }
    }

    private async trySelectingEntityOnIndex(pointerIndex: Vector2D) {
        if (pointerIndex && !this.grid.isFreeField(pointerIndex)) {
            // Fetch entity on index
            let entity = this.grid.getEntityAt(pointerIndex)

            if (!entity.movable) {
                // Entity cannot move, so give feedback and do nothing
                await entity.shake()
                return
            }

            // Entity is movable, so select it and show possible next fields
            this.entityWaitingForInput = entity
            await Promise.all([
                this.entityWaitingForInput.pickUp(),
                this.entityWaitingForInput.scaleUp()
            ])
            await this.grid.blendInFieldHints(entity.index)
            this.waitingForNextPosition = true
        }
    }

    private async handleClickOnIndexAfterSelectingEntity(pointerIndex: Vector2D) {
        this.waitingForNextPosition = false
        await this.grid.blendOutFieldAllHints()
        this.entityWaitingForInput.scaleDown()
        await this.entityWaitingForInput.letDown()

        if (!pointerIndex || vector2Equals(pointerIndex, this.entityWaitingForInput.index)) {
            // Clicked on selected entity, do nothing
            return
        }

        // If field is free, just move there
        if (this.grid.isFreeField(pointerIndex)) {
            let path = this.grid.findPath(this.entityWaitingForInput.index, pointerIndex, true)
            if (path) {
                this.moving = true
                await this.grid.blendInPathHints(path)

                await Promise.all([
                    this.grid.moveEntityAlongPath(this.entityWaitingForInput, path)
                ])
                this.moving = false
            }

        } else {
            // If field is taken, interact
            let path = this.grid.findPath(this.entityWaitingForInput.index, pointerIndex, false)
            let controlledEntity = this.entityWaitingForInput
            let otherEntity = this.grid.getEntityAt(pointerIndex)
            let canInteract = this.grid.checkIfCanInteract(this.entityWaitingForInput, otherEntity)
            if (path && canInteract) {
                this.moving = true
                await this.grid.blendInPathHints(path)
                await this.grid.moveEntityAndInteractWithField(controlledEntity, otherEntity, path)
                this.moving = false
            } else {
                await Promise.all([controlledEntity.shake(), otherEntity.shake()])
            }
        }

        await this.grid.checkNeighbors()
    }
}