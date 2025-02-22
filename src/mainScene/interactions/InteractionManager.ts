import {GridEntity} from "../entities/GridEntity";
import {Action, AutomaticActions, DemandedActions} from "./Actions";
import {EntityId} from "../entities/EntityId";
import {Vector2Dict} from "../../general/datatypes/Dict";
import {LevelManager} from "../LevelManager";

export class InteractionManager {
    async letInteract(firstEntity: GridEntity, secondEntity: GridEntity, mainScene: LevelManager) {
        let action = this.getMethodForEntities(firstEntity.getName(), secondEntity.getName())
        await action.interact(firstEntity, secondEntity, mainScene)
    }

    private getMethodForEntities(firstEntity: EntityId, secondEntity: EntityId): Action {
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

    getInteractionDescription(firstEntity: GridEntity, secondEntity: GridEntity): string {
        let action = DemandedActions.get([firstEntity.getName(), secondEntity.getName()])
        if (!action) {
            return "";
        }
        return action.getDescription(firstEntity, secondEntity)
    }
}