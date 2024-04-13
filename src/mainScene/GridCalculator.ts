import {vector2Add, Vector2D, vector2Scalar, vector2Sub} from "../general/MathUtils";
import Matrix3 = Phaser.Math.Matrix3;
import Vector3 = Phaser.Math.Vector3;

export class GridCalculator {

    private centerX: number;
    private centerY: number;
    private readonly columns: number;
    private readonly rows: number;
    private readonly dirX: Vector2D;
    private readonly dirY: Vector2D;

    private readonly matrix: Matrix3
    private readonly inverse: Matrix3
    private readonly positionFirst: Vector2D


    constructor(x: number, y: number, columns: number, rows: number, dirX: Vector2D, dirY: Vector2D) {
        this.centerX = x
        this.centerY = y
        this.columns = columns
        this.rows = rows

        this.dirX = dirX
        this.dirY = dirY

        this.matrix = new Matrix3().fromArray([dirX.x, dirX.y, 0, dirY.x, dirY.y, 0, 0, 0, 1])
        this.inverse = this.matrix.clone()
        this.inverse.invert()

        let center = {x: this.centerX, y: this.centerY}

        let indexOffset = new Vector3((columns - 1) / 2, (rows - 1) / 2, 0)
        let offset = indexOffset.transformMat3(this.matrix)

        this.positionFirst = vector2Sub(center, offset)
    }

    public getPositionForIndex(index: Phaser.Types.Math.Vector2Like): Vector2D {
        let indexAsVec3 = new Vector3(index.x, index.y)
        return vector2Add(this.positionFirst, indexAsVec3.transformMat3(this.matrix))
    }

    public getClosestIndexForPosition(position: Vector2D): Vector2D | undefined {
        let positionAsVector3 = new Vector3(position.x - this.positionFirst.x, position.y - this.positionFirst.y, 0)
        let index = positionAsVector3.transformMat3(this.inverse)

        // don't use if (indexX) here since it could be 0
        if (this.isValueWithin(index.x, -0.5, this.columns - 1/2) && this.isValueWithin(index.y, -0.5, this.rows - 1/2)) {
            return {x: Math.round(index.x), y: Math.round(index.y)}
        }

        return undefined
    }

    private isValueWithin(value: number, minvalue: number, maxValue: number): boolean {
        return value > minvalue && value < maxValue;
    }
}