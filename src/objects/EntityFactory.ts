import {EntityName} from "./EntityData";
import {Castle} from "./entities/Castle";
import {Knight} from "./entities/Knight";
import {GridEntity} from "./GridEntity";
import {Princess} from "./entities/Princess";
import {Tree} from "./entities/Tree";
import {Wolf} from "./entities/Wolf";
import {SwordStone} from "./entities/SwordStone";
import {MainGameScene} from "../scenes/MainGameScene";

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