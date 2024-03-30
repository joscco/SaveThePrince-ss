import {Vector2D} from "../general/MathUtils";
import {Scene} from "phaser";

export class Button extends Phaser.GameObjects.Image {

    constructor(scene: Scene, pos: Vector2D, textureKey: string) {
        super(scene, pos.x, pos.y, textureKey);
        scene.add.existing(this)
    }

    async wiggle() {
        await this.tweenScale(1.2)
        await this.tweenScale(1)
    }

    private async tweenScale(scale: number) {
        return new Promise<void>(resolve => {
            this.scene.tweens.add({
                targets: this,
                scaleX: scale,
                scaleY: scale,
                duration: 200,
                ease: Phaser.Math.Easing.Back.Out,
                onComplete: () => resolve()
            })
        })
    }
}