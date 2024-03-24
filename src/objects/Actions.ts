import {EntityNamePairDict} from "../general/Dict";
import {GridEntity} from "./GridEntity";
import {EntityName} from "./EntityData";
import {Knight} from "./entities/Knight";
import {Princess} from "./entities/Princess";
import {Castle} from "./entities/Castle";
import {Wolf} from "./entities/Wolf";
import {SwordStone} from "./entities/SwordStone";
import {vector2Dist, vector2Sub} from "../general/MathUtils";
import {MainGameScene} from "../scenes/MainGameScene";

export type Action = {
    interact: (a: GridEntity, b: GridEntity, mainScene?: MainGameScene) => Promise<void>
    canInteract: (a: GridEntity, b: GridEntity, mainScene?: MainGameScene) => boolean
}

export const DemandedActions = new EntityNamePairDict<Action>([
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
                if (knight.has('sword')) {
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
                return !knight.has('sword') && swordStone.hasSword()
            },
            interact: async (a, b, mainScene) => {
                let [knight, swordStone] = sortByNames(a, b, 'knight') as [Knight, SwordStone]
                knight.setSword(true)
                swordStone.setSword(false)
            }
        }
    ],
])

export const AutomaticActions = new EntityNamePairDict<Action>([
    [
        ['knight', 'wolf'],
        {
            canInteract: (a, b) => {
                let [knight, wolf] = sortByNames(a, b, 'knight') as [Knight, Wolf]
                let nearEnough = 2 > vector2Dist(vector2Sub(knight.index, wolf.index))
                return nearEnough && !knight.isDead()
            },
            interact: async (a, b, mainScene) => {
                let [knight, wolf] = sortByNames(a, b, 'knight') as [Knight, Wolf]
                if (knight.has('sword')) {
                    await knight.
                    mainScene.removeEntityAt(wolf.index)
                    await wolf.blendOutThenDestroy()
                    return
                }

                await wolf.shake()
                await knight.die()
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