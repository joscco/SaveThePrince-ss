import {Scene} from 'phaser';
import {WOOD} from "../../Resource";
import {CollectibleEntity} from "./CollectibleEntity";

export class Stick extends CollectibleEntity {

    constructor(scene: Scene, x: number, y: number ) {
        super(scene, x, y, 'resource/stick', WOOD);
    }

}