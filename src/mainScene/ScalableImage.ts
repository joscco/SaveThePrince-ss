import {Scene} from "phaser";
import {Vector2D} from "../general/MathUtils";
import Tween = Phaser.Tweens.Tween;

export class ScalableImage extends Phaser.GameObjects.Image {
    flipped: boolean = false
    private scaleTween?: Tween

    constructor(scene: Scene, pos: Vector2D, textureKey: string) {
        super(scene, pos.x, pos.y, textureKey);
        scene.add.existing(this)
    }

    async tweenChangeTexture(newKey: string) {
        await this.tweenScale(0.5)
        this.setTexture(newKey)
        await this.tweenScale(1)
    }

    async flip(flippedAfterwards: boolean = !this.flipped) {
        this.flipped = flippedAfterwards
        let absScale = Math.abs(this.scaleX)
        await this.tweenScale(absScale)
    }

    async blendOut() {
        await this.tweenScale(0, 200, Phaser.Math.Easing.Expo.In)
    }

    async blendIn() {
        await this.tweenScale(1, 200, Phaser.Math.Easing.Expo.Out)
    }

    private async tweenScale(scale: number,
                             duration: number = 200,
                             ease: (i: number) => number = Phaser.Math.Easing.Cubic.InOut
    ){
        if (scale < 0) {
            throw Error("Scale is only allowed to be a non-negative float")
        }

        let adaptedScale = (this.flipped ? -1 : 1) * scale
        this.scaleTween?.destroy()
        return new Promise<void>(resolve => {
            this.scaleTween = this.scene.tweens.add({
                targets: this,
                duration: duration,
                scaleX: adaptedScale,
                scaleY: scale,
                ease: ease,
                onComplete: () => resolve()
            })
        })
    }
}