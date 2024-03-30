import {Knight} from "../entities/knight/Knight";
import {Wolf} from "../entities/wolf/Wolf";
import {wait} from "../../general/AsyncUtils";
import {vector2Dist, vector2Sub} from "../../general/MathUtils";
import {Action, sortByNames} from "./Actions";

const WolfAndKnightBase = {
    getDescription: (a, b) => {
        let [knight, _] = sortByNames(a, b, 'knight') as [Knight, Wolf]
        if (knight.has('sword')) {
            return "The armored knight defeats the wolf."
        } else {
            return "The wolf kills the knight."
        }
    },
    interact: async (a, b, mainScene) => {
        let [knight, wolf] = sortByNames(a, b, 'knight') as [Knight, Wolf]
        await knight.turnTowards(wolf.index)
        await wolf.turnTowards(knight.index)
        if (knight.has('sword')) {
            await wolf.turnAggressive()
            await wait(400)
            await knight.attack({x: wolf.x, y: wolf.y})
            mainScene.removeEntityAt(wolf.index)
            await wolf.turnDead()
            await wait(400)
            await wolf.blendOutThenDestroy()
        } else {
            await wolf.turnAggressive()
            await knight.turnFearful()
            await wait(400)
            await wolf.attack({x: knight.x, y: knight.y})
            await knight.turnDead()
            await wolf.turnNeutral()
        }
    }
}

export const WolfAndKnightActionAutomatic: Action = {
    ...WolfAndKnightBase,
    canInteract: (a, b) => {
        let [knight, wolf] = sortByNames(a, b, 'knight') as [Knight, Wolf]
        let nearEnough = 1 >= vector2Dist(vector2Sub(knight.index, wolf.index))
        return nearEnough && !knight.isDead()
    },
}

export const WolfAndKnightActionOnDemand: Action = {
    ...WolfAndKnightBase,
    canInteract: (a, b) => {
        let [knight, _] = sortByNames(a, b, 'knight') as [Knight, Wolf]
        return !knight.isDead()
    },
}