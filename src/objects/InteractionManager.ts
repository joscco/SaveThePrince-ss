import {GridEntity} from "./GridEntity";
import {MainGameScene} from "../Game";
import {Action, ACTIONS} from "./Actions";
import {EntityName} from "./EntityData";

export class InteractionManager {
    async letInteract(firstEntity: GridEntity, secondEntity: GridEntity, mainScene: MainGameScene) {
        let action = this.getMethodForEntities(firstEntity.getName(), secondEntity.getName())
        await action.interact(firstEntity, secondEntity, mainScene)
    }

    private getMethodForEntities(firstEntity: EntityName, secondEntity: EntityName): Action {
        return ACTIONS.get([firstEntity, secondEntity])
    }

    canInteract(firstEntity: GridEntity, secondEntity: GridEntity): boolean {
        let action = ACTIONS.get([firstEntity.getName(), secondEntity.getName()])
        if (!action) {
           return false
        }
        return action.canInteract(firstEntity, secondEntity)
    }
}