import {MainGameScene} from "../Game";
import {GridEntity} from "./GridEntity";
import {Vector2Dict} from "../general/Dict";
import {Vector2, vector2Add, vector2Equals, vector2Sub, vector2Unify} from "../general/MathUtils";
import {FieldManager} from "./FieldManager";
import {EntityName} from "./EntityData";
import {EntityFactory} from "./EntityFactory";
import {InteractionManager} from "./InteractionManager";

// export const DIRECTIONS = [
//     {x: -1, y: 0},
//     {x: 1, y: 0},
//     {x: 0, y: -1},
//     {x: 0, y: 1}
// ]

export const DIRECTIONS = [
    {x: -1, y: -1},
    {x: -1, y: 0},
    {x: -1, y: 1},
    {x: 0, y: -1},
    {x: 0, y: 1},
    {x: 1, y: -1},
    {x: 1, y: 0},
    {x: 1, y: 1}
]

export class Grid {

    mainScene: MainGameScene
    entities: Vector2Dict<GridEntity> = new Vector2Dict()
    columns: number
    rows: number
    private fieldManager: FieldManager
    private entityFactory: EntityFactory;

    interactionManager: InteractionManager

    constructor(mainScene: MainGameScene, x: number, y: number, columns: number, rows: number) {
        this.columns = columns
        this.rows = rows

        this.mainScene = mainScene
        this.fieldManager = new FieldManager(mainScene, x, y, columns, rows)
        this.entityFactory = new EntityFactory()
        this.interactionManager = new InteractionManager()
    }

    initEntityAt(index: Vector2, entityName: EntityName, movable: boolean): GridEntity {
        let newPosition = this.fieldManager.getPositionForIndex(index)
        let entity = this.entityFactory.create(this.mainScene, newPosition.x, newPosition.y, entityName)
        entity.setIndex(index)
        entity.setMovable(movable)
        this.entities.set(index, entity)
        return entity
    }

    removeEntityAt(index: Vector2) {
        this.entities.delete(index)
    }

    async moveEntityTo(entity: GridEntity, index: Vector2) {
        if (vector2Equals(entity.index, index)) {
            console.log("Same index!")
            return
        }

        let isFieldFree = this.isFreeField(index)

        if (isFieldFree) {
            let newPosition = this.fieldManager.getPositionForIndex(index)
            await entity.tweenMoveTo(newPosition)
            this.entities.delete(entity.index)
            entity.setIndex(index)
            this.entities.set(index, entity)
        }
    }

    public isFreeField(index: Vector2): boolean {
        return !this.entities.has(index)
    }

    async blendInFields() {
        await this.fieldManager.blendInFields()
    }

    public findNextPossibleIndices(nextIndex: Vector2): [Vector2, boolean][] {
        let result = []
        for (let direction of DIRECTIONS) {
            let currentIndex: Vector2 = vector2Add(direction, nextIndex)
            while (this.fieldManager.hasIndex(currentIndex)) {
                if (!this.isFreeField(currentIndex)) {
                    result.push([currentIndex, false])
                    break
                }
                result.push([currentIndex, true])
                currentIndex = vector2Add(direction, currentIndex)
            }
        }
        return result
    }

    async moveEntityAndInteractWithField(mainEntity: GridEntity, otherEntity: GridEntity) {
        if (!this.interactionManager.canInteract(mainEntity, otherEntity)) {
            mainEntity.shake()
            await otherEntity.shake()
            return
        }

        let otherIndex = otherEntity.index
        let direction = vector2Unify(vector2Sub(otherIndex, mainEntity.index))
        let lastIndexBeforePointer = vector2Sub(otherIndex, direction)
        await this.moveEntityTo(mainEntity, lastIndexBeforePointer)
        await this.interactionManager.letInteract(mainEntity, otherEntity, this.mainScene)
    }

    getEntityAt(pointerIndex: Vector2) {
        return this.entities.get(pointerIndex);
    }

    getClosestFieldIndexTo(pointer: Vector2): Vector2 {
        return this.fieldManager.getClosestFieldIndexTo(pointer)
    }

    async blendInPossibleFieldHints(possibleNextPositions: [Vector2, boolean][]) {
        await this.fieldManager.blendInPossibleFieldHints(possibleNextPositions)
    }

    async blendOutPossibleFieldHints(nextIndices: Vector2[]) {
        await this.fieldManager.blendOutPossibleFieldHints(nextIndices)
    }
}