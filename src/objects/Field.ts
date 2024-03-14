import Image = Phaser.GameObjects.Image;
import Tween = Phaser.Tweens.Tween;
import {Vector2} from "../general/MathUtils";
import {MainGameScene} from "../Game";

export class Field extends Image {

    width: number
    height: number
    inner: Image
    innerShown: boolean
    index: Vector2;
    private scaleTween: Tween

    constructor(scene: MainGameScene, index: Vector2, position: Vector2) {
        let {x, y} = position
        super(scene, x, y, 'field');

        this.inner = scene.add.image(x, y, 'focus')
        this.inner.scale = 0.7
        this.inner.alpha = 0
        this.inner.depth = 100

        this.scale = 0
        this.index = index
        scene.add.existing(this)
    }

    blendInInner(free: boolean) {
        this.inner.setTexture(free ? 'focusFree' : 'focus')
        if (!this.innerShown) {
            this.innerShown = true
            this.tweenScaleInner(1, 1, 200, Phaser.Math.Easing.Quadratic.Out)
        }
    }

    blendOutInner() {
        if (this.innerShown) {
            this.innerShown = false
            this.tweenScaleInner(0.7, 0, 100, Phaser.Math.Easing.Quadratic.In)
        }
    }

    tweenScaleInner(scale: number, alpha: number, duration: number, ease: (x: number) => number) {
        this.scaleTween?.remove()
        this.scaleTween = this.scene.tweens.add({
            targets: this.inner,
            alpha: alpha,
            scale: scale,
            duration: duration,
            ease: ease
        })
    }

    blendIn(delay: number, duration: number) {
        this.scene.tweens.add({
            targets: this,
            scale: 1,
            delay: delay,
            duration: duration,
            ease: Phaser.Math.Easing.Quadratic.InOut
        })
    }
}