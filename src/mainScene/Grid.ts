import {GridEntity} from "./entities/GridEntity";
import {Vector2Dict} from "../general/datatypes/Dict";
import {Vector2D, vector2Equals} from "../general/MathUtils";
import {GridCalculator} from "./GridCalculator";
import {EntityId} from "./entities/EntityId";
import {EntityFactory} from "./entities/EntityFactory";
import {InteractionManager} from "./interactions/InteractionManager";
import {MainGameScene} from "../scenes/MainGameScene";
import {Field} from "./Field";
import {GridPathFinder} from "../general/GridPathFinder";
import {LevelManager} from "./LevelManager";

export const DIRECTIONS = [
    {x: -1, y: 0},
    {x: 1, y: 0},
    {x: 0, y: -1},
    {x: 0, y: 1}
]

export class Grid {

    mainScene: MainGameScene
    levelManager: LevelManager

    private readonly entities: Vector2Dict<GridEntity>
    private fields: Vector2Dict<Field>
    private pathFinder: GridPathFinder
    private entityFactory: EntityFactory;
    private interactionManager: InteractionManager

    // This is the only thin really needed
    private gridCalculator?: GridCalculator
    private columns: number
    private rows: number
    private x: number
    private y: number
    private dirX: Vector2D;
    private dirY: Vector2D;


    constructor(mainScene: MainGameScene, x: number, y: number) {
        this.mainScene = mainScene
        this.levelManager = mainScene.levelManager
        this.x = x
        this.y = y

        this.pathFinder = new GridPathFinder(v => this.isFreeField(v) && this.hasIndex(v), DIRECTIONS)
        this.entityFactory = new EntityFactory()
        this.interactionManager = new InteractionManager()

        this.entities = new Vector2Dict()
        this.fields = new Vector2Dict<Field>()
    }

    init(columns: number, rows: number, dirX: Vector2D, dirY: Vector2D) {
        this.columns = columns
        this.rows = rows
        this.dirX = dirX
        this.dirY = dirY
        this.gridCalculator = new GridCalculator(this.x, this.y, columns, rows, {x: 125, y: 0}, {x: 0, y: 110})
        this.initFields()
    }

    initEntityAt(index: Vector2D, entityName: EntityId, movable: boolean): GridEntity {
        let newPosition = this.gridCalculator.getPositionForIndex(index)
        let entity = this.entityFactory.create(this.mainScene, newPosition.x, newPosition.y, entityName)
        entity.setIndex(index)
        entity.setMovable(movable)
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
            await firstAction.interact(firstEntity, secondEntity, this.levelManager)
            entityNeighbors = this.interactionManager.findReactiveNeighbors(this.entities)
        }
    }

    async moveEntityAndInteractWithField(mainEntity: GridEntity, otherEntity: GridEntity, path: Vector2D[]) {
        let otherIndex = otherEntity.index
        if (path.at(-1) == otherIndex) {
            path = path.slice(0, path.length - 1)
        }

        if (path.length > 0 && !vector2Equals(mainEntity.index, path.at(-1))) {
            await this.moveEntityAlongPath(mainEntity, path)
        }

        await this.interactionManager.letInteract(mainEntity, otherEntity, this.levelManager)
    }

    public async blendInGridInRandomOrder(): Promise<void> {
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
            .map((index, i) => this.fields.get(index).blendInInnerBlack(true, i * 20)))
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
        for (let indX = 0; indX < this.columns; indX++) {
            for (let indY = 0; indY < this.rows; indY++) {
                let index = {x: indX, y: indY}
                let field = new Field(
                    this.mainScene,
                    index,
                    this.gridCalculator.getPositionForIndex(index)
                )
                field.depth = -100 + indY - 0.1 * indX
                this.fields.set(index, field)
            }
        }
    }

    findPath(fromIndex: Vector2D, toIndex: Vector2D, includeLast: boolean) {
        return this.pathFinder.findPath(fromIndex, toIndex, includeLast)
    }

    checkIfCanInteract(first: GridEntity, other: GridEntity) {
        return this.interactionManager.canInteract(first, other)
    }
}