import {Vector2} from "../general/MathUtils";
import {Field} from "./Field";
import {MainGameScene} from "../Game";
import {Vector2Dict} from "../general/Dict";

export class FieldManager {

    private static FIELD_WIDTH: number = 142
    private static FIELD_HEIGHT: number = 137

    private readonly scene: MainGameScene
    private readonly fields: Vector2Dict<Field>
    private fieldAreaWidth: number;
    private fieldAreaHeight: number;
    private offsetFirstX: number;
    private offsetFirstY: number;
    private columns: number;
    private rows: number;

    constructor(scene: MainGameScene, x: number, y: number, columns: number, rows: number) {
        this.scene = scene
        this.columns = columns
        this.rows = rows
        this.fields = this.initFields(x, y, columns, rows)
    }

    private initFields(x: number, y: number, columns: number, rows: number): Vector2Dict<Field> {
        this.columns = columns
        this.rows = rows
        this.fieldAreaWidth = columns * FieldManager.FIELD_WIDTH
        this.fieldAreaHeight = rows * FieldManager.FIELD_HEIGHT
        this.offsetFirstX = x - (columns - 1) / 2 * FieldManager.FIELD_WIDTH
        this.offsetFirstY = y - (rows - 1) / 2 * FieldManager.FIELD_HEIGHT

        let fields = new Vector2Dict<Field>();
        for (let indX = 0; indX < columns; indX++) {
            for (let indY = 0; indY < rows; indY++) {
                let field = new Field(
                    this.scene,
                    {
                        x: indX,
                        y: indY
                    },
                    {
                        x: this.offsetFirstX + FieldManager.FIELD_WIDTH * indX,
                        y: this.offsetFirstY + FieldManager.FIELD_HEIGHT * indY
                    }
                )
                field.depth = -100
                fields.set({x: indX, y: indY}, field)
            }
        }
        return fields
    }

    public hasIndex(index: Vector2) {
        return index.x >= 0 && index.x < this.columns && index.y >= 0 && index.y < this.rows
    }

    public getPositionForIndex(index: Phaser.Types.Math.Vector2Like): Vector2 {
        return {
            x: this.offsetFirstX + index.x * FieldManager.FIELD_WIDTH,
            y: this.offsetFirstY + index.y * FieldManager.FIELD_HEIGHT
        }
    }

    public getClosestFieldIndexTo(mousePosition: Vector2): Vector2 | undefined {
        let indexX = this.getClosestIndex(this.offsetFirstX, FieldManager.FIELD_WIDTH, this.columns, mousePosition.x)
        let indexY = this.getClosestIndex(this.offsetFirstY, FieldManager.FIELD_HEIGHT, this.rows, mousePosition.y)

        // don't use if (indexX) here since it could be 0
        if (indexX != undefined && indexY != undefined) {
            return {x: indexX, y: indexY}
        }

        return undefined
    }

    public async blendInFields(): Promise<void> {
        let maxDuration = 0
        for (let [index, field] of this.fields) {
            let delay = (Math.abs(index.x) + Math.abs(index.y)) * 20
            let duration = delay + 300
            maxDuration = Math.max(duration, maxDuration)
            field.blendIn(delay, duration)
        }

        return new Promise<void>((resolve) => setTimeout(resolve, maxDuration))
    }

    private getClosestIndex(offset: number, fieldExpansion: number, maxValue: number, value: number): number | undefined {
        let closestIndex = Math.floor((value - offset + fieldExpansion / 2) / fieldExpansion)
        if (closestIndex < 0 || closestIndex >= maxValue) {
            return undefined
        }
        return closestIndex
    }

    async blendInPossibleFieldHints(possibleNextIndices: [Vector2, boolean][]) {
        for (let [index, free] of possibleNextIndices) {
            await this.fields.get(index).blendInInner(free)
        }
    }

    async blendOutPossibleFieldHints(possibleNextIndices: Vector2[]) {
        for (let index of possibleNextIndices) {
            await this.fields.get(index).blendOutInner()
        }
    }
}