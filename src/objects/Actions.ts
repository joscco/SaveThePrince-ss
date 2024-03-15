import {EntityNamePairDict} from "../general/Dict";
import {GridEntity} from "./GridEntity";
import {MainGameScene} from "../Game";
import {EntityName} from "./EntityData";
import {Knight} from "./entities/Knight";
import {Princess} from "./entities/Princess";
import {Castle} from "./entities/Castle";

export type Action = {
    interact: (a: GridEntity, b: GridEntity, mainScene?: MainGameScene) => Promise<void>
    canInteract: (a: GridEntity, b: GridEntity, mainScene?: MainGameScene) => boolean
}

export const ACTIONS = new EntityNamePairDict<Action>([
    [
        // Knight and Princess
        ['knight', 'princess'],
        {
            canInteract: (a, b, mainScene) => true,
            interact: async (a, b, mainScene) => {
                let [knight, princess] = sortByNames(a, b, 'knight') as [Knight, Princess]
                mainScene.removeEntityAt(princess.index)
                await princess.blendOutThenDestroy()
                knight.setHasPrincess(true)
                await knight.showPrincess()
            }
        }
    ],
    [
        // Knight and Princess
        ['knight', 'castle'],
        {
            canInteract: (a, b, mainScene) => {
                let [knight, castle] = sortByNames(a, b, 'knight') as [Knight, Castle]
                return knight.hasPrincess()
            },
            interact: async (a, b, mainScene) => {
                let [knight, castle] = sortByNames(a, b, 'knight') as [Knight, Castle]
                if (knight.hasPrincess()) {
                    mainScene.resolveLevel()
                }
            }
        }
    ],
])

export function sortByNames(a: GridEntity, b: GridEntity, first: EntityName) {
    if (a.getName() == first) {
        return [a, b]
    }
    return [b, a]
}