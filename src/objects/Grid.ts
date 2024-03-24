import {GridEntity} from "./GridEntity";
import {Vector2Dict} from "../general/Dict";
import {Vector2, vector2Equals} from "../general/MathUtils";
import {GridCalculator} from "./GridCalculator";
import {EntityName} from "./EntityData";
import {EntityFactory} from "./EntityFactory";
import {InteractionManager} from "./InteractionManager";
import {MainGameScene} from "../scenes/MainGameScene";
import {Field} from "./Field";
import {GridPathFinder} from "../general/GridPathFinder";

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

    columns: number
    rows: number

    private readonly entities: Vector2Dict<GridEntity>
    private readonly fields: Vector2Dict<Field>
    private gridCalculator: GridCalculator
    private pathFinder: GridPathFinder
    private entityFactory: EntityFactory;
    private interactionManager: InteractionManager

    constructor(mainScene: MainGameScene, x: number, y: number, columns: number, rows: number) {
        this.columns = columns
        this.rows = rows

        this.mainScene = mainScene
        this.gridCalculator = new GridCalculator(x, y, columns, rows, FIELD_WIDTH, FIELD_HEIGHT)
        this.pathFinder = new GridPathFinder((v) => this.isFreeField(v) && this.hasIndex(v), DIRECTIONS)
        this.entityFactory = new EntityFactory()
        this.interactionManager = new InteractionManager()

        this.entities = new Vector2Dict()
        this.fields = this.initFields()
    }

    initEntityAt(index: Vector2, entityName: EntityName, movable: boolean): GridEntity {
        let newPosition = this.gridCalculator.getPositionForIndex(index)
        let entity = this.entityFactory.create(this.mainScene, newPosition.x, newPosition.y, entityName)
        entity.setIndex(index)
        entity.setMovable(movable)
        this.entities.set(index, entity)
        return entity
    }

    removeEntityAt(index: Vector2) {
        this.entities.delete(index)
    }

    async moveEntityAlongPath(entity: GridEntity, path: Vector2[]) {
        for (let index of path) {
            await this.moveEntityToField(entity, index)
        }
    }

    async moveEntityToField(entity: GridEntity, index: Vector2) {
        if (vector2Equals(entity.index, index)) {
            return
        }

        let isFieldFree = this.isFreeField(index)

        if (isFieldFree) {
            let newPosition = this.gridCalculator.getPositionForIndex(index)
            await entity.tweenMoveTo(newPosition)
            this.entities.delete(entity.index)
            entity.setIndex(index)
            this.entities.set(index, entity)
        }
    }

    public isFreeField(index: Vector2): boolean {
        return !this.entities.has(index)
    }

    public hasIndex(index: Vector2) {
        return index.x >= 0 && index.x < this.columns && index.y >= 0 && index.y < this.rows
    }

    getEntityAt(pointerIndex: Vector2) {
        return this.entities.get(pointerIndex);
    }

    getClosestFieldIndexTo(pointer: Vector2): Vector2 {
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

    async moveEntityAndInteractWithField(mainEntity: GridEntity, otherEntity: GridEntity, path: Vector2[]) {
        if (!this.interactionManager.canInteract(mainEntity, otherEntity)) {
            mainEntity.shake()
            await otherEntity.shake()
            return
        }

        let otherIndex = otherEntity.index
        if (path.at(-1) == otherIndex) {
            path = path.slice(0, path.length - 1)
        }
        await this.moveEntityAlongPath(mainEntity, path)
        await this.interactionManager.letInteract(mainEntity, otherEntity, this.mainScene)
    }

    public async blendInFields(): Promise<void> {
        let maxDuration = 0
        let middleRowIndex = (this.rows - 1) / 2
        let middleColumnIndex = (this.columns - 1) / 2
        for (let [index, field] of this.fields) {
            let delay = (Math.abs(index.x - middleColumnIndex) + Math.abs(index.y - middleRowIndex)) * 40
            let duration = delay + 300
            maxDuration = Math.max(duration, maxDuration)
            field.blendIn(delay, duration)
        }

        return new Promise<void>((resolve) => setTimeout(resolve, maxDuration))
    }

    async blendInFieldHints(except: Vector2) {
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

    async blendInPathHints(path: Vector2[]) {
        await Promise.all(path.filter((_, i) => i>0)
            .map((index, i) => this.fields.get(index).blendInInner(true, i * 20)))
    }

    async blendOutPathHints(path: Vector2[]) {
        await Promise.all(path.map((index, i) => this.fields.get(index).blendOutInner(Math.max(0, i * 150 - 60))))
    }

    canInteractWithField(entity: GridEntity, other: GridEntity,): boolean {
        return this.interactionManager.canInteract(entity, other)
    }

    private getAllFieldIndices(): Vector2[] {
        let it: Vector2[] = []

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

    findPath(fromIndex: Vector2, toIndex: Vector2, includeLast: boolean) {
        return this.pathFinder.findPath(fromIndex, toIndex, includeLast)
    }
}