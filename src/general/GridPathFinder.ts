import {Vector2D, vector2Add, vector2Manhattan} from "./MathUtils";
import {PriorityQueue} from "./datatypes/PriorityQueue";
import {Vector2Dict} from "./datatypes/Dict";

export class GridPathFinder {

    private readonly isFreeField: (v: Vector2D) => boolean
    private readonly neighborDirections: Vector2D[]

    constructor(isFreeField: (v: Vector2D) => boolean, neighborDirections: Vector2D[]) {
        this.isFreeField = isFreeField
        this.neighborDirections = neighborDirections
    }

    findPath(fromIndex: Vector2D, toIndex: Vector2D, includeToIndex: boolean): Vector2D[] {
        let prioQueue = new PriorityQueue<Vector2D>()
        prioQueue.insert(fromIndex, 0)
        let cameFromMap = new Vector2Dict<Vector2D | null>()
        let costMap = new Vector2Dict<number>()
        cameFromMap.set(fromIndex, null)
        costMap.set(fromIndex, 0)

        let lastIndex: Vector2D = toIndex

        while (prioQueue.size() > 0) {
            let current = prioQueue.pop()

            if (includeToIndex) {
                if (current == toIndex) {
                    break
                }
            } else {
                if (vector2Manhattan(current, toIndex) <= 1) {
                    lastIndex = current
                    break
                }
            }

            for (let next of this.getFreeNeighborsOf(current)) {
                let new_cost = costMap.get(current) + 1
                if (!costMap.has(next) || new_cost < costMap[next]) {
                    costMap.set(next, new_cost)
                    let priority = new_cost + vector2Manhattan(toIndex, next)
                    prioQueue.insert(next, priority)
                    cameFromMap.set(next, current)
                }
            }
        }

        return this.buildPath(cameFromMap, fromIndex, lastIndex)
    }

    private buildPath(cameFromMap: Vector2Dict<Vector2D | null>, fromIndex: Vector2D, toIndex: Vector2D): Vector2D[] {
        let path = []
        let current = toIndex
        while (current != fromIndex) {
            path.push(current)
            current = cameFromMap.get(current)
        }
        path.push(current)
        return path.reverse()
    }

    private getFreeNeighborsOf(index: Vector2D) {
        let result = []
        for (let dir of this.neighborDirections) {
            let next = vector2Add(index, dir)
            if (this.isFreeField(next)) {
                result.push(next)
            }
        }
        return result
    }
}