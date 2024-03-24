import {Vector2, vector2Add, vector2Manhattan} from "./MathUtils";
import {PriorityQueue} from "./PriorityQueue";
import {Vector2Dict} from "./Dict";

export class GridPathFinder {

    private readonly isFreeField: (v: Vector2) => boolean
    private readonly neighborDirections: Vector2[]

    constructor(isFreeField: (v: Vector2) => boolean, neighborDirections: Vector2[]) {
        this.isFreeField = isFreeField
        this.neighborDirections = neighborDirections
    }

    findPath(fromIndex: Vector2, toIndex: Vector2, includeToIndex: boolean): Vector2[] {
        let prioQueue = new PriorityQueue<Vector2>()
        prioQueue.insert(fromIndex, 0)
        let cameFromMap = new Vector2Dict<Vector2 | null>()
        let costMap = new Vector2Dict<number>()
        cameFromMap.set(fromIndex, null)
        costMap.set(fromIndex, 0)

        let lastIndex: Vector2 = toIndex

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

    private buildPath(cameFromMap: Vector2Dict<Vector2 | null>, fromIndex: Vector2, toIndex: Vector2): Vector2[] {
        let path = []
        let current = toIndex
        while (current != fromIndex) {
            path.push(current)
            current = cameFromMap.get(current)
        }
        path.push(current)
        return path.reverse()
    }

    private getFreeNeighborsOf(index: Vector2) {
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