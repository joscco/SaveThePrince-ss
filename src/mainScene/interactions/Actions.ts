import {EntityNamePairDict} from "../../general/datatypes/Dict";
import {GridEntity} from "../entities/GridEntity";
import {EntityId} from "../entities/EntityId";
import {Knight} from "../entities/knight/Knight";
import {Princess} from "../entities/princess/Princess";
import {Castle} from "../entities/castle/Castle";
import {Wolf} from "../entities/wolf/Wolf";
import {SwordStone} from "../entities/swordStone/SwordStone";
import {WolfAndKnightActionAutomatic, WolfAndKnightActionOnDemand} from "./WolfAndKnight";
import {LevelManager} from "../LevelManager";

export type Action = {
    getDescription: (a: GridEntity, b: GridEntity, mainScene?: LevelManager) => string,
    interact: (a: GridEntity, b: GridEntity, mainScene?: LevelManager) => Promise<void>
    canInteract: (a: GridEntity, b: GridEntity, mainScene?: LevelManager) => boolean
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
                await knight.showPrincess(princess)
                princess.destroy()
                knight.setHasPrincess(true)
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
            interact: async (a, b, levelManager) => {
                let [knight, castle] = sortByNames(a, b, 'knight') as [Knight, Castle]
                if (knight.hasPrincess()) {
                    await knight.attack({x: castle.x, y: castle.y})
                    await levelManager.resolveLevel()
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
                await Promise.all([knight.attack({x: swordStone.x, y: swordStone.y}), swordStone.setSword(false)])
                await knight.setSword(true)
            }
        }
    ],
])

export const AutomaticActions = new EntityNamePairDict<Action>([
    [
        ['knight', 'wolf'], WolfAndKnightActionAutomatic
    ]
])

export function sortByNames(a: GridEntity, b: GridEntity, first: EntityId) {
    if (a.getName() == first) {
        return [a, b]
    }
    return [b, a]
}