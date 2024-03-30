import {GridEntity} from "./entities/GridEntity";
import {Vector2Dict} from "../general/datatypes/Dict";
import {Vector2D, vector2Equals} from "../general/MathUtils";
import {GridCalculator} from "./GridCalculator";
import {EntityName} from "./entities/EntityName";
import {EntityFactory} from "./entities/EntityFactory";
import {InteractionManager} from "./interactions/InteractionManager";
import {MainGameScene} from "../scenes/MainGameScene";
import {Field} from "./Field";
import {GridPathFinder} from "../general/GridPathFinder";
import {GAME_WIDTH} from "../Game";
import {ActionLabel} from "./ActionLabel";
import Vector2 = Phaser.Math.Vector2;

export const DIRECTIONS = [
    {x: -1, y: 0},
    {x: 1, y: 0},
    {x: 0, y: -1},
    {x: 0, y: 1}
]


export const FIELD_WIDTH: number = 123
export const FIELD_HEIGHT: number = 123

export class Grid {

    mainScene: MainGameScene

    private readonly actionLabel: ActionLabel
    private readonly entities: Vector2Dict<GridEntity>
    private readonly fields: Vector2Dict<Field>
    private pathFinder: GridPathFinder
    private entityFactory: EntityFactory;
    private interactionManager: InteractionManager

    // This is the only thin really needed
    columns: number
    rows: number
    private gridCalculator: GridCalculator

    constructor(mainScene: MainGameScene, x: number, y: number, columns: number, rows: number) {
        this.columns = columns
        this.rows = rows

        this.mainScene = mainScene
        this.gridCalculator = new GridCalculator(x, y - 50, columns, rows, FIELD_WIDTH, FIELD_HEIGHT)
        this.pathFinder = new GridPathFinder(v => this.isFreeField(v) && this.hasIndex(v), DIRECTIONS)
        this.entityFactory = new EntityFactory()
        this.interactionManager = new InteractionManager()

        this.actionLabel = new ActionLabel(mainScene, {x: x, y: y + 450}, GAME_WIDTH - 200, 100)
        this.entities = new Vector2Dict()
        this.fields = this.initFields()
    }

    initEntityAt(index: Vector2D, entityName: EntityName, movable: boolean, facingRight: boolean = true): GridEntity {
        let newPosition = this.gridCalculator.getPositionForIndex(index)
        let entity = this.entityFactory.create(this.mainScene, newPosition.x, newPosition.y, entityName)
        entity.setIndex(index)
        entity.setMovable(movable)
        entity.adaptToMoveDirection(facingRight ? Vector2.RIGHT : Vector2.LEFT)
        this.entities.set(index, entity)
        return entity
    }

    removeEntityAt(index: Vector2D) {
        this.entities.delete(index)
    }

    async moveEntityAlongPath(entity: GridEntity, path: Vector2D[]) {
        for (let index of path) {
            await this.moveEntityToField(entity, index)
        }
    }

    async moveEntityToField(entity: GridEntity, index: Vector2D) {
        if (vector2Equals(entity.index, index)) {
            return
        }

        let isFieldFree = this.isFreeField(index)

        if (isFieldFree) {
            let newPosition = this.gridCalculator.getPositionForIndex(index)
            await Promise.all([
                this.fields.get(index).blendOutInner(),
                entity.tweenJumpMoveTo(newPosition)
            ])
            this.entities.delete(entity.index)
            entity.setIndex(index)
            this.entities.set(index, entity)
        }
    }

    public isFreeField(index: Vector2D): boolean {
        return !this.entities.has(index)
    }

    public hasIndex(index: Vector2D) {
        return index.x >= 0 && index.x < this.columns && index.y >= 0 && index.y < this.rows
    }

    getEntityAt(pointerIndex: Vector2D) {
        return this.entities.get(pointerIndex);
    }

    getClosestFieldIndexTo(pointer: Vector2D): Vector2D {
        return this.gridCalculator.getClosestIndexForPosition(pointer)
    }

    async checkNeighbors() {
        let entityNeighbors = this.interactionManager.findReactiveNeighbors(this.entities)
        while (entityNeighbors.length > 0) {
            let [firstEntity, secondEntity, firstAction] = entityNeighbors[0]
            await firstAction.interact(firstEntity, secondEntity, this.mainScene)
            entityNeighbors = this.interactionManager.findReactiveNeighbors(this.entities)
        }
    }

    async moveEntityAndInteractWithField(mainEntity: GridEntity, otherEntity: GridEntity, path: Vector2D[]) {
        let otherIndex = otherEntity.index
        if (path.at(-1) == otherIndex) {
            path = path.slice(0, path.length - 1)
        }

        if (path.length > 0 && !vector2Equals(mainEntity.index, path.at(-1))) {
            let descriptionName = mainEntity.getDescriptionName()
            this.actionLabel.changeText(
                descriptionName.name + (descriptionName.isPlural
                    ? " move." : " moves."))

            await this.moveEntityAlongPath(mainEntity, path)
        }

        await this.actionLabel.changeText(this.interactionManager.getInteractionDescription(mainEntity, otherEntity))
        await this.interactionManager.letInteract(mainEntity, otherEntity, this.mainScene)
    }

    public async blendInGridInRandomOrder(): Promise<void> {
        this.actionLabel.blendIn()

        let maxDuration = 0
        for (let [_, field] of this.fields) {
            let delay = 300 * Math.random()
            let duration = delay + 300
            maxDuration = Math.max(duration, maxDuration)
            field.blendIn(delay, duration)
        }

        return new Promise<void>((resolve) => setTimeout(resolve, maxDuration))
    }

    async blendInFieldHints(except: Vector2D) {
        await Promise.all(this.getAllFieldIndices().map(index => {
            if (!vector2Equals(index, except)) {
                let free = !this.entities.has(index)
                return this.fields.get(index).blendInInner(free)
            }
        }))
    }

    async blendOutFieldAllHints() {
        await Promise.all(this.getAllFieldIndices().map(index => this.fields.get(index).blendOutInner()))
    }

    async blendInPathHints(path: Vector2D[]) {
        await Promise.all(path.filter((_, i) => i > 0)
            .map((index, i) => this.fields.get(index).blendInInner(true, i * 20)))
    }

    private getAllFieldIndices(): Vector2D[] {
        let it: Vector2D[] = []

        for (let indX = 0; indX < this.columns; indX++) {
            for (let indY = 0; indY < this.rows; indY++) {
                it.push({x: indX, y: indY})
            }

        }
        return it
    }

    private initFields() {
        let fields = new Vector2Dict<Field>();
        for (let indX = 0; indX < this.columns; indX++) {
            for (let indY = 0; indY < this.rows; indY++) {
                let index = {x: indX, y: indY}
                let field = new Field(
                    this.mainScene,
                    index,
                    this.gridCalculator.getPositionForIndex(index)
                )
                field.depth = -100
                fields.set(index, field)
            }
        }
        return fields
    }

    findPath(fromIndex: Vector2D, toIndex: Vector2D, includeLast: boolean) {
        return this.pathFinder.findPath(fromIndex, toIndex, includeLast)
    }

    async changeText(text: string) {
        await this.actionLabel.changeText(text)
    }

    checkIfCanInteract(first: GridEntity, other: GridEntity) {
        return this.interactionManager.canInteract(first, other)
    }
}