import {Scene} from "phaser";
import {Vector2D} from "../general/MathUtils";
import Tween = Phaser.Tweens.Tween;

export class EntitySprite extends Phaser.GameObjects.Image {
    lookingRight: boolean = true
    private scaleTween?: Tween

    constructor(scene: Scene, pos: Vector2D, textureKey: string) {
        super(scene, pos.x, pos.y, textureKey);
        scene.add.existing(this)
    }

    async tweenChangeTexture(newKey: string) {
        await this.tweenScale(0.7)
        this.setTexture(newKey)
        await this.tweenScale(1)
    }

    async flip(lookingRight: boolean = !this.lookingRight, inMid: () => void) {
        if (lookingRight != this.lookingRight) {
            this.lookingRight = lookingRight
            let absScale = Math.abs(this.scaleX)
            await this.tweenScale(absScale, inMid)
        }
    }

    private async tweenScale(scale: number, inMid?: () => void) {
        let adaptedScale = (this.lookingRight ? 1 : -1) * scale
        let inMidPerformed = false
        return new Promise<void>(resolve => this.scene.tweens.add({
            targets: this,
            duration: 200,
            scaleX: adaptedScale,
            scaleY: scale,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            onComplete: () => resolve(),
            onUpdate: (tween) => {
                if (!inMidPerformed && tween.progress > 0.5) {
                    inMidPerformed = true
                    if (inMid) {
                        inMid()
                    }

                }
            }
        }))
    }

    async scaleFullSize() {
        await this.tweenScale(1)
    }

    async scaleHalfSize() {
        await this.tweenScale(0.5)
    }
}