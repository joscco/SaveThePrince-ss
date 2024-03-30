import {EntityNamePairDict} from "../../general/datatypes/Dict";
import {GridEntity} from "../entities/GridEntity";
import {EntityName} from "../entities/EntityName";
import {Knight} from "../entities/knight/Knight";
import {Princess} from "../entities/princess/Princess";
import {Castle} from "../entities/castle/Castle";
import {Wolf} from "../entities/wolf/Wolf";
import {SwordStone} from "../entities/swordStone/SwordStone";
import {MainGameScene} from "../../scenes/MainGameScene";
import {WolfAndKnightActionAutomatic, WolfAndKnightActionOnDemand} from "./WolfAndKnight";

export type Action = {
    getDescription: (a: GridEntity, b: GridEntity, mainScene?: MainGameScene) => string,
    interact: (a: GridEntity, b: GridEntity, mainScene?: MainGameScene) => Promise<void>
    canInteract: (a: GridEntity, b: GridEntity, mainScene?: MainGameScene) => boolean
}

export const DemandedActions = new EntityNamePairDict<Action>([
    [
        // Knight and Princess
        ['knight', 'princess'],
        {
            getDescription: () => "The knight saves the princess.",
            canInteract: () => true,
            interact: async (a, b, mainScene) => {
                let [knight, princess] = sortByNames(a, b, 'knight') as [Knight, Princess]
                mainScene.removeEntityAt(princess.index)
                await Promise.all([princess.blendOutThenDestroy(), knight.attack({x: princess.x, y: princess.y})])
                knight.setHasPrincess(true)
                await knight.showPrincess()
            }
        }
    ],
    [
        ['knight', 'castle'],
        {
            getDescription: () => "The knight returns the princess.",
            canInteract: (a, b) => {
                let [knight, _] = sortByNames(a, b, 'knight') as [Knight, Castle]
                return knight.hasPrincess()
            },
            interact: async (a, b, mainScene) => {
                let [knight, castle] = sortByNames(a, b, 'knight') as [Knight, Castle]
                if (knight.hasPrincess()) {
                    await knight.attack({x: castle.x, y: castle.y})
                    await mainScene.resolveLevel()
                }
            }
        }
    ],
    [
        ['knight', 'wolf'], WolfAndKnightActionOnDemand
    ],
    [
        ['knight', 'swordStone'],
        {
            getDescription: () => "The knight receives a sword.",
            canInteract: (a, b) => {
                let [knight, swordStone] = sortByNames(a, b, 'knight') as [Knight, SwordStone]
                return !knight.has('sword') && swordStone.hasSword()
            },
            interact: async (a, b) => {
                let [knight, swordStone] = sortByNames(a, b, 'knight') as [Knight, SwordStone]
                await knight.turnTowards(swordStone.index)
                await Promise.all([knight.attack({x: swordStone.x, y: swordStone.y}), swordStone.setSword(false)])
                await knight.setSword(true)
            }
        }
    ],
])

export const AutomaticActions = new EntityNamePairDict<Action>([
    [
        ['knight', 'wolf'], WolfAndKnightActionAutomatic
    ],
    [
        ['princess', 'wolf'],
        {
            getDescription: () => "The wolf frightens the princess.",
            canInteract: (a, b) => {
                let [_, princess] = sortByNames(a, b, 'wolf') as [Wolf, Princess]
                return !princess.isFrightened()
            },
            interact: async (a, b) => {
                let [wolf, princess] = sortByNames(a, b, 'wolf') as [Wolf, Princess]
                await Promise.all([wolf.turnAggressive(), princess.turnFearful()])
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