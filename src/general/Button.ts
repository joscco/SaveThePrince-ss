import {Vector2D} from "./MathUtils";
import {Scene} from "phaser";
import Image = Phaser.GameObjects.Image;
import Container = Phaser.GameObjects.Container;
import Tween = Phaser.Tweens.Tween;

type numberToNumberFunc = (i: number) => number

export class Button {

    private scene: Scene
    protected container: Container
    protected image: Image
    private scaleTween: Tween
    private alphaTween: Tween

    constructor(scene: Scene, pos: Vector2D, textureKey: string) {
        this.scene = scene
        this.container = scene.add.container(pos.x, pos.y)
        this.image = scene.add.image(0, 0, textureKey)
        this.container.add([this.image])
    }

    setScale(scale: number) {
        this.container.scale = scale
    }

    setAlpha(alpha: number) {
        this.image.alpha = alpha
    }

    async blendIn(delay: number = 0) {
        await Promise.all([
            this.tweenScale(1, 200, Phaser.Math.Easing.Quadratic.Out, delay),
            this.tweenAlpha(1, 200, Phaser.Math.Easing.Quadratic.Out, delay)
        ])
    }

    async blendOut(delay: number = 0) {
        await Promise.all([
            this.tweenScale(0.75, 200, Phaser.Math.Easing.Quadratic.In, delay),
            this.tweenAlpha(0, 200, Phaser.Math.Easing.Quadratic.In, delay)
        ])
    }

    async scaleUp() {
        await this.tweenScale(1.2, 200, Phaser.Math.Easing.Expo.Out)
    }

    public setInteractive() {
        return this.image.setInteractive()
    }

    private async tweenScale(scale: number, duration: number, ease: numberToNumberFunc, delay: number = 0) {
        return new Promise<void>(resolve => {
            this.scaleTween?.destroy()
            this.scaleTween = this.scene.tweens.add({
                targets: this.container,
                scaleX: scale,
                scaleY: scale,
                duration: duration,
                delay: delay,
                ease: ease,
                onComplete: () => resolve()
            })
        })
    }

    private async tweenAlpha(alpha: number, duration: number, ease: numberToNumberFunc, delay: number = 0) {
        return new Promise<void>(resolve => {
            this.alphaTween?.destroy()
            this.alphaTween = this.scene.tweens.add({
                targets: this.image,
                alpha: alpha,
                duration: duration,
                delay: delay,
                ease: ease,
                onComplete: () => resolve()
            })
        })
    }

    once(event: string, callback: () => Promise<void>) {
        this.image.once(event, callback)
    }
}