import {EntityNamePairDict} from "../general/Dict";
import {GridEntity} from "./GridEntity";
import {MainGameScene} from "../Game";
import {EntityName} from "./EntityData";
import {Knight} from "./entities/Knight";
import {Princess} from "./entities/Princess";
import {Castle} from "./entities/Castle";
import {Wolf} from "./entities/Wolf";
import {SwordStone} from "./entities/SwordStone";

export type Action = {
    interact: (a: GridEntity, b: GridEntity, mainScene?: MainGameScene) => Promise<void>
    canInteract: (a: GridEntity, b: GridEntity, mainScene?: MainGameScene) => boolean
}

export const ACTIONS = new EntityNamePairDict<Action>([
    [
        // Knight and Princess
        ['knight', 'princess'],
        {
            canInteract: () => true,
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
        ['knight', 'castle'],
        {
            canInteract: (a, b) => {
                let [knight, _] = sortByNames(a, b, 'knight') as [Knight, Castle]
                return knight.hasPrincess()
            },
            interact: async (a, b, mainScene) => {
                let [knight, _] = sortByNames(a, b, 'knight') as [Knight, Castle]
                if (knight.hasPrincess()) {
                    await mainScene.resolveLevel()
                }
            }
        }
    ],
    [
        ['knight', 'wolf'],
        {
            canInteract: (a, b) => true,
            interact: async (a, b, mainScene) => {
                let [knight, wolf] = sortByNames(a, b, 'knight') as [Knight, Wolf]
                if (knight.hasSword()) {
                    await knight.shake()
                    mainScene.removeEntityAt(wolf.index)
                    await wolf.blendOutThenDestroy()
                    return
                }

                await wolf.shake()
                await knight.die()
            }
        }
    ],
    [
        ['knight', 'swordStone'],
        {
            canInteract: (a, b) => {
                let [knight, swordStone] = sortByNames(a, b, 'knight') as [Knight, SwordStone]
                return !knight.hasSword() && swordStone.hasSword()
            },
            interact: async (a, b, mainScene) => {
                let [knight, swordStone] = sortByNames(a, b, 'knight') as [Knight, SwordStone]
                knight.setSword(true)
                swordStone.setSword(false)
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