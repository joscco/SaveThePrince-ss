import {Grid} from "../objects/Grid";
import Transform = Phaser.GameObjects.Components.Transform;

export interface IEntity extends Transform {
    x: number,
    y: number,
    onClick: (town: Grid) => void
}