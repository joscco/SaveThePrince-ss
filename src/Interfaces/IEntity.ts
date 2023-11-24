import {Town} from "../Town";
import Transform = Phaser.GameObjects.Components.Transform;

export interface IEntity extends Transform {
    x: number,
    y: number,
    onClick: (town: Town) => void
}