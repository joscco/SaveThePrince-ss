import {GridEntity} from "./GridEntity";
import {Action, AutomaticActions, DemandedActions} from "./Actions";
import {EntityName} from "./EntityData";
import {Vector2Dict} from "../general/Dict";
import {MainGameScene} from "../scenes/MainGameScene";

export class InteractionManager {
    async letInteract(firstEntity: GridEntity, secondEntity: GridEntity, mainScene: MainGameScene) {
        let action = this.getMethodForEntities(firstEntity.getName(), secondEntity.getName())
        await action.interact(firstEntity, secondEntity, mainScene)
    }

    private getMethodForEntities(firstEntity: EntityName, secondEntity: EntityName): Action {
        return DemandedActions.get([firstEntity, secondEntity])
    }

    canInteract(firstEntity: GridEntity, secondEntity: GridEntity): boolean {
        let action = DemandedActions.get([firstEntity.getName(), secondEntity.getName()])
        if (!action) {
            return false
        }
        return action.canInteract(firstEntity, secondEntity)
    }

    findReactiveNeighbors(entities: Vector2Dict<GridEntity>): [GridEntity, GridEntity, Action][] {
        let values = entities.getEntries().map(entry => entry[1])
        let result = [] as [GridEntity, GridEntity, Action][]

        for (let i = 0; i < values.length; i++) {
            let firstEntity = values[i]
            for (let j = i + 1; j < values.length; j++) {
                let secondEntity = values[j]
                let automaticAction = AutomaticActions.get([firstEntity.getName(), secondEntity.getName()])
                if (automaticAction && automaticAction.canInteract(firstEntity, secondEntity)) {
                    result.push([firstEntity, secondEntity, automaticAction])
                }
            }
        }
        return result
    }
}