import {Scene} from 'phaser';
import {CollectibleEntity} from "./CollectibleEntity";
import {STONE} from "../../Resource";

export class Stone extends CollectibleEntity {

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, "resource/stone", STONE);
    }

}