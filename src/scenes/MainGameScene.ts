import {Grid} from "../mainScene/Grid";
import {WinScreen} from "../mainScene/WinScreen";
import {GridEntity} from "../mainScene/entities/GridEntity";
import {Vector2D, vector2Equals} from "../general/MathUtils";
import {GAME_HEIGHT, GAME_WIDTH} from "../Game";
import Pointer = Phaser.Input.Pointer;

export class MainGameScene extends Phaser.Scene {
    grid: Grid
    winScreen: WinScreen
    level: number

    levelResolved: boolean = false
    moving: boolean = false
    waitingForNextPosition: boolean = false
    entityWaitingForInput: GridEntity = undefined

    constructor() {
        super('main');
    }

    init(data: any) {
        this.level = data.level
    }

    preload() {
        // general
        this.load.image('field_even', 'assets/images/mainScene/available_field.png');
        this.load.image('field_odd', 'assets/images/mainScene/available_field_2.png');
        this.load.image('focus', 'assets/images/mainScene/focus.png');
        this.load.image('focusFree', 'assets/images/mainScene/focusFree.png');

        // entities
        this.load.image('entities.castle', 'assets/images/mainScene/entities/castle.png');

        this.load.image('entities.knight.neutral', 'assets/images/mainScene/entities/knight_neutral.png');
        this.load.image('entities.knight.fearful', 'assets/images/mainScene/entities/knight_fearful.png');
        this.load.image('entities.knight.dead', 'assets/images/mainScene/entities/knight_dead.png');

        this.load.image('entities.items.sword', 'assets/images/mainScene/entities/item_sword.png');
        this.load.image('entities.items.meat', 'assets/images/mainScene/entities/item_meat.png');
        this.load.image('entities.items.key', 'assets/images/mainScene/entities/item_key.png');
        this.load.image('entities.items.emptyBucket', 'assets/images/mainScene/entities/item_emptyBucket.png');
        this.load.image('entities.items.fullBucket', 'assets/images/mainScene/entities/item_fullBucket.png');

        this.load.image('entities.princess.neutral', 'assets/images/mainScene/entities/princess_neutral.png');
        this.load.image('entities.princess.fearful', 'assets/images/mainScene/entities/princess_fearful.png');
        this.load.image('entities.princess.happy', 'assets/images/mainScene/entities/princess_happy.png');
        this.load.image('entities.princess.dead', 'assets/images/mainScene/entities/princess_neutral.png');

        this.load.image('entities.wolf.neutral', 'assets/images/mainScene/entities/wolf_neutral.png');
        this.load.image('entities.wolf.angry', 'assets/images/mainScene/entities/wolf_angry.png');
        this.load.image('entities.wolf.happy', 'assets/images/mainScene/entities/wolf_happy.png');
        this.load.image('entities.wolf.dead', 'assets/images/mainScene/entities/wolf_dead.png');

        this.load.image('entities.fire', 'assets/images/mainScene/entities/fire.png');
        this.load.image('entities.well', 'assets/images/mainScene/entities/well.png');
        this.load.image('entities.fireplace.withMeat', 'assets/images/mainScene/entities/fireplace_with_meat.png');
        this.load.image('entities.fireplace.withoutMeat', 'assets/images/mainScene/entities/fireplace_without_meat.png');

        this.load.image('entities.swordStone.withSword', 'assets/images/mainScene/entities/sword_stone_filled.png');
        this.load.image('entities.swordStone.withoutSword', 'assets/images/mainScene/entities/sword_stone_empty.png');

        this.load.image('entities.tree', 'assets/images/mainScene/entities/forest.png');
    }

    create() {
        this.grid = new Grid(this, GAME_WIDTH / 2, GAME_HEIGHT / 2)
        this.winScreen = new WinScreen(this, GAME_WIDTH / 2, GAME_HEIGHT / 2)
        this.setupLevel(this.level)

        this.input.on('pointerup', async (pointer: Pointer) => {
            if (!this.moving && !this.levelResolved) {
                if (this.waitingForNextPosition) {
                    let pointerIndex = this.grid.getClosestFieldIndexTo(pointer)
                    this.waitingForNextPosition = false
                    await this.grid.blendOutFieldAllHints()
                    await this.entityWaitingForInput.scaleDown()

                    if (pointerIndex) {
                        if (vector2Equals(pointerIndex, this.entityWaitingForInput.index)) {
                            // Clicked on selected entity, do nothing
                            await this.grid.changeText("")
                            return
                        }

                        // If field is free, just move
                        if (this.grid.isFreeField(pointerIndex)) {
                            let path = this.grid.findPath(this.entityWaitingForInput.index, pointerIndex, true)
                            if (path) {
                                this.moving = true
                                await this.grid.blendInPathHints(path)

                                let entityDescription = this.entityWaitingForInput.getDescriptionName()
                                await this.grid.changeText(
                                    entityDescription.name + (entityDescription.isPlural
                                        ? "move." : " moves."))
                                await Promise.all([
                                    this.grid.moveEntityAlongPath(this.entityWaitingForInput, path)
                                ])
                                this.moving = false
                            } else {
                                await this.grid.changeText("This is not possible")
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
                                if (path) {
                                    let firstName = controlledEntity.getDescriptionName().name
                                    let secondName = otherEntity.getDescriptionName().name
                                    this.grid.changeText(`${firstName} cannot interact with ${secondName}.`)
                                } else {
                                    this.grid.changeText("There is no path.")
                                }

                                await Promise.all([controlledEntity.shake(), otherEntity.shake()])
                            }
                        }

                        await this.grid.checkNeighbors()
                    }
                } else {
                    let pointerIndex = this.grid.getClosestFieldIndexTo(pointer)
                    if (pointerIndex && !this.grid.isFreeField(pointerIndex)) {
                        // Mark entity and show possible next fields
                        let entity = this.grid.getEntityAt(pointerIndex)
                        if (!entity.movable) {
                            // Entity cannot move
                            let descriptionName = entity.getDescriptionName()
                            this.grid.changeText(`${descriptionName.name} - not movable`)
                            await entity.shake()
                            return
                        }

                        this.grid.changeText(entity.getDescriptionName().name)
                        this.entityWaitingForInput = entity
                        await this.entityWaitingForInput.scaleUp()
                        await this.grid.blendInFieldHints(entity.index)
                        this.waitingForNextPosition = true
                    }
                }
            }
        })
    }

    private async setupLevel(level: number) {
        switch (level) {
            case 1:
                // Princess in the woods
                this.grid.init(7, 7)
                await this.grid.blendInGridInRandomOrder()
                await Promise.all([
                    this.grid.initEntityAt({x: 2, y: 0}, "castle", false).blendIn(),
                    this.grid.initEntityAt({x: 2, y: 1}, "knight", true).blendIn(100),

                    this.grid.initEntityAt({x: 1, y: 3}, "tree", false).blendIn(150),
                    this.grid.initEntityAt({x: 2, y: 3}, "tree", false).blendIn(200),
                    this.grid.initEntityAt({x: 3, y: 3}, "tree", false).blendIn(250),

                    this.grid.initEntityAt({x: 1, y: 4}, "tree", false).blendIn(300),
                    this.grid.initEntityAt({x: 3, y: 4}, "tree", false).blendIn(350),
                    this.grid.initEntityAt({x: 2, y: 4}, "princess", false).blendIn(400),

                    this.grid.initEntityAt({x: 1, y: 5}, "tree", false).blendIn(450),
                    this.grid.initEntityAt({x: 3, y: 5}, "tree", false).blendIn(500)
                ])
                await this.grid.checkNeighbors()
                return
            case 2:
                // Princess and one wolf
                this.grid.init(7, 7)
                await this.grid.blendInGridInRandomOrder()
                await Promise.all([
                    this.grid.initEntityAt({x: 3, y: 1}, "castle", false).blendIn(),
                    this.grid.initEntityAt({x: 3, y: 5}, "swordStone", false).blendIn(100),
                    this.grid.initEntityAt({x: 1, y: 3}, "knight", true).blendIn(200),
                    this.grid.initEntityAt({x: 5, y: 3}, "princess", false, false).blendIn(300),
                    this.grid.initEntityAt({x: 4, y: 3}, "wolf", false, true).blendIn(400)
                ])
                await this.grid.checkNeighbors()
                return
            case 3:
                // Princess in a fire
                this.grid.init(7, 7)
                await this.grid.blendInGridInRandomOrder()
                await Promise.all([
                    this.grid.initEntityAt({x: 2, y: 0}, "castle", false).blendIn(),
                    this.grid.initEntityAt({x: 2, y: 1}, "knight", true).blendIn(300),

                    this.grid.initEntityAt({x: 2, y: 4}, "princess", false).blendIn(50),
                ])
                await this.grid.checkNeighbors()
                return
        }

    }

    async resolveLevel() {
        this.levelResolved = true
        await this.winScreen.blendIn()
    }

    removeEntityAt(index: Vector2D) {
        this.grid.removeEntityAt(index)
    }
}