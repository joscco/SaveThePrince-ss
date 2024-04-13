import Image = Phaser.GameObjects.Image;
import Tween = Phaser.Tweens.Tween;
import {Vector2D} from "../general/MathUtils";
import {MainGameScene} from "../scenes/MainGameScene";

export class Field extends Image {

    width: number
    height: number
    inner: Image
    innerShown: boolean
    index: Vector2D;
    private scaleTween: Tween

    constructor(scene: MainGameScene, index: Vector2D, position: Vector2D) {
        let {x, y} = position
        let indexIsEvent = (index.x + index.y) % 2 == 0
        super(scene, x, y + 15, indexIsEvent ? 'field_even' : 'field_odd');

        this.inner = scene.add.image(x, y, 'focus')
        this.inner.alpha = 0
        this.inner.depth = 1

        this.scale = 0
        this.index = index
        scene.add.existing(this)
    }


    async blendInInnerBlack(free: boolean, delay: number) {
        this.inner.setTexture(free ? 'focusFreeGray' : 'focusGray')
        if (!this.innerShown) {
            this.innerShown = true
            await this.tweenAlphaInner(1, delay, delay, Phaser.Math.Easing.Sine.Out)
        }
    }

    async blendInInner(free: boolean, delay: number = 0) {
        this.inner.setTexture(free ? 'focusFree' : 'focus')
        if (!this.innerShown) {
            this.innerShown = true
            await this.tweenAlphaInner(1, 200, delay, Phaser.Math.Easing.Sine.Out)
        }
    }

    async blendOutInner(delay: number = 0) {
        if (this.innerShown) {
            this.innerShown = false
            await this.tweenAlphaInner(0, 150, delay, Phaser.Math.Easing.Sine.In)
        }
        return
    }

    async tweenAlphaInner(alpha: number, duration: number, delay: number, ease: (x: number) => number) {
        this.scaleTween?.remove()
        return new Promise<void>(resolve => {
            this.scaleTween = this.scene.tweens.add({
                targets: this.inner,
                alpha: alpha,
                duration: duration,
                delay: delay,
                ease: ease,
                onComplete: () => resolve()
            })
        })
    }

    blendIn(delay: number, duration: number) {
        this.scene.tweens.add({
            targets: this,
            scale: 1,
            delay: delay,
            duration: duration,
            ease: Phaser.Math.Easing.Cubic.Out
        })
    }

}