import {EntityName} from "./EntityName";
import {Castle} from "./castle/Castle";
import {Knight} from "./knight/Knight";
import {GridEntity} from "./GridEntity";
import {Princess} from "./princess/Princess";
import {Tree} from "./tree/Tree";
import {Wolf} from "./wolf/Wolf";
import {SwordStone} from "./swordStone/SwordStone";
import {MainGameScene} from "../../scenes/MainGameScene";

export class EntityFactory {
    public create(scene: MainGameScene, x: number, y: number, entityName: EntityName): GridEntity {
        switch (entityName) {
            case "castle":
                return new Castle(scene, x, y);
            case "knight":
                return new Knight(scene, x, y);
            case "princess":
                return new Princess(scene, x, y);
            case "tree":
                return new Tree(scene, x, y);
            case "wolf":
                return new Wolf(scene, x, y);
            case "swordStone":
                return new SwordStone(scene, x, y);
        }
        throw new Error("Entity with name " + entityName + " is not known.")
    }
}