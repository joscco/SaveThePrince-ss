import {Vector2D} from "../MathUtils";

export type Tuple<T> = [T, number];

export class PriorityQueue<T extends Vector2D> {
    heap: Tuple<T>[] = [];

    constructor() {
    }

    insert(val: T, priority: number) {
        if (!this.heap.length || this.heap[this.heap.length - 1][1] > priority) {
            this.heap.push([val, priority]);
            return this.heap;
        }

        const tmp: Tuple<T>[] = [];
        let found = false;

        for (let i = 0; i < this.heap.length; i++) {
            const p = this.heap[i][1];

            if (priority >= p && !found) {
                tmp.push([val, priority]);
                found = true;
            }

            tmp.push(this.heap[i]);
        }

        return (this.heap = tmp);
    }

    has({x, y}: T) {
        const foundNode = this.heap.find(([val]) => val.x === x && val.y === y);

        return !!foundNode;
    }

    get({x, y}: T) {
        const foundNode = this.heap.find(([val]) => val.x === x && val.y === y);

        return foundNode && foundNode[0];
    }

    // Get first element, i.e. element with the highest priority
    shift(): T {
        const tuple = this.heap.shift();
        return tuple ? tuple[0] : undefined;
    }

    // Get last element, i.e. element with the lowest priority
    pop(): T {
        const tuple = this.heap.pop();
        return tuple ? tuple[0] : undefined;
    }

    priorities() {
        return this.heap.map(([_, p]) => p);
    }

    values() {
        return this.heap.map(([val]) => val);
    }

    size() {
        return this.heap.length;
    }

    toArray() {
        return this.heap.map(([val]) => val);
    }
}