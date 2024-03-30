import {Vector2D} from "../general/MathUtils";

export class GridCalculator {

    private centerX: number;
    private centerY: number;
    private readonly columns: number;
    private readonly rows: number;
    private readonly fieldWidth: number;
    private readonly fieldHeight: number;

    private fieldAreaWidth: number;
    private fieldAreaHeight: number;
    private readonly offsetFirstX: number;
    private readonly offsetFirstY: number;


    constructor(x: number, y: number, columns: number, rows: number, fieldWidth: number, fieldHeight: number) {
        this.centerX = x
        this.centerY = y
        this.columns = columns
        this.rows = rows
        this.fieldWidth = fieldWidth
        this.fieldHeight = fieldHeight

        this.fieldAreaWidth = columns * fieldWidth
        this.fieldAreaHeight = rows * fieldHeight
        this.offsetFirstX = x - (columns - 1) / 2 * fieldWidth
        this.offsetFirstY = y - (rows - 1) / 2 * fieldHeight
    }

    public getPositionForIndex(index: Phaser.Types.Math.Vector2Like): Vector2D {
        return {
            x: this.offsetFirstX + index.x * this.fieldWidth,
            y: this.offsetFirstY + index.y * this.fieldHeight
        }
    }

    public getClosestIndexForPosition(position: Vector2D): Vector2D | undefined {
        let indexX = this.getClosestIndex1D(this.offsetFirstX, this.fieldWidth, this.columns, position.x)
        let indexY = this.getClosestIndex1D(this.offsetFirstY, this.fieldHeight, this.rows, position.y)

        // don't use if (indexX) here since it could be 0
        if (indexX != undefined && indexY != undefined) {
            return {x: indexX, y: indexY}
        }

        return undefined
    }

    private getClosestIndex1D(offset: number, fieldExpansion: number, maxValue: number, value: number): number | undefined {
        let closestIndex = Math.floor((value - offset + fieldExpansion / 2) / fieldExpansion)
        if (closestIndex < 0 || closestIndex >= maxValue) {
            return undefined
        }
        return closestIndex
    }
}