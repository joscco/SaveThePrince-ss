import Pointer = Phaser.Input.Pointer;
import {MainGameScene} from "../Game";
import {GridEntity} from "./GridEntity";
import {Vector2Dict} from "../general/Dict";
import {Vector2, vector2Add, vector2Equals, vector2Sub, vector2Unify} from "../general/MathUtils";
import {FieldManager} from "./FieldManager";
import {EntityData} from "./EntityData";

export const DIRECTIONS = [
    {x: -1, y: 0},
    {x: 1, y: 0},
    {x: 0, y: -1},
    {x: 0, y: 1}
]

// export const DIRECTIONS = [ {x: -1, y: -1},{x: -1, y: 0},{x: -1, y: 1}, {x: 0, y: -1},{x: 0, y: 1},  {x: 1, y: -1},{x: 1, y: 0},{x: 1, y: 1}]

export class Grid {

    mainScene: MainGameScene
    entities: Vector2Dict<GridEntity> = new Vector2Dict()
    fieldManager: FieldManager

    columns: number
    rows: number

    possibleNextIndices: [Vector2, boolean][];

    constructor(mainScene: MainGameScene, x: number, y: number, columns: number, rows: number) {
        this.columns = columns
        this.rows = rows

        this.mainScene = mainScene
        this.fieldManager = new FieldManager(mainScene, x, y, columns, rows)
    }

    initEntityAt(index: Vector2, entityData: EntityData) {
        let newPosition = this.fieldManager.getPositionForIndex(index)
        let entity = new GridEntity(this.mainScene, newPosition.x, newPosition.y, entityData)
        entity.setIndex(index)
        this.entities.set(index, entity)
        entity.blendIn()
    }

    async moveEntityTo(index: Vector2, entity: GridEntity) {
        let isFieldFree = this.isFreeField(index)

        if (isFieldFree) {
            let newPosition = this.fieldManager.getPositionForIndex(index)
            await entity.tweenMoveTo(newPosition)
            this.entities.delete(entity.index)
            entity.setIndex(index)
            this.entities.set(index, entity)
        }
    }

    private isFreeField(index: Vector2): boolean {
        return !this.entities.has(index)
    }

    async blendInFields() {
        await this.fieldManager.blendInFields()
    }

    private findNextPossibleIndices(nextIndex: Vector2): [Vector2, boolean][] {
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

    private async letInteract(firstEntity: GridEntity, secondEntity: GridEntity) {
        firstEntity.shake()
        await secondEntity.shake()
    }
}