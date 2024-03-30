import Container = Phaser.GameObjects.Container;
import {Vector2D} from "../../general/MathUtils";
import {MainGameScene} from "../../scenes/MainGameScene";
import Tween = Phaser.Tweens.Tween;

export abstract class EntityContainer extends Container {
    lookingRight: boolean = true
    private scaleTween?: Tween

    constructor(scene: MainGameScene, x: number, y: number) {
        super(scene, x, y);
    }

    async scaleFullSize() {
        await this.tweenScale(1)
    }

    async blendOut() {
        await this.tweenScale(0)
    }

    async scaleHalfSize() {
        await this.tweenScale(0.75)
    }

    async flip(lookingRight: boolean = !this.lookingRight) {
        if (lookingRight != this.lookingRight) {
            this.lookingRight = lookingRight
            let absScale = Math.abs(this.scaleX)
            await this.tweenScale(absScale)
        }
    }

    private async tweenScale(scale: number) {
        let adaptedScale = (this.lookingRight ? 1 : -1) * scale
        return new Promise<void>(resolve => {
            this.scaleTween?.destroy()
            this.scaleTween = this.scene.tweens.add({
                targets: this,
                duration: 150,
                scaleX: adaptedScale,
                scaleY: scale,
                ease: Phaser.Math.Easing.Back.Out,
                onComplete: () => resolve()
            })
        })
    }

    async tweenMove(pos: Vector2D) {
        return new Promise<void>(resolve => this.scene.tweens.add({
            targets: this,
            duration: 300,
            x: pos.x,
            y: pos.y,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            onComplete: () => resolve()
        }))
    }
}