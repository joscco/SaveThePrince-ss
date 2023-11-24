import {IEntity} from "../../Interfaces/IEntity";
import {Town} from "../../Town";
import {Resource} from "../../Resource";
import {Scene} from "phaser";

export class CollectibleEntity extends Phaser.GameObjects.Image implements IEntity {

    resource: Resource

    constructor(scene: Scene, x: number, y: number, textureName: string, resource: Resource) {
        super(scene, x, y, textureName);
        this.scene.add.existing(this)
        this.depth = y
        this.resource = resource
        this.setInteractive()
    }

    onClick(town: Town) {
        town.addResource(this.resource)
        this.remove()
    }

    remove() {
        this.removeInteractive()
        this.scene.tweens.add({
            targets: this,
            scaleX: 0,
            scaleY: 0,
            ease: Phaser.Math.Easing.Back.In,
            duration: 300,
            onComplete: () => this.destroy()
        })
    }
}