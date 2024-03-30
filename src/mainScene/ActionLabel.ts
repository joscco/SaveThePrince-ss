import Container = Phaser.GameObjects.Container;
import Text = Phaser.GameObjects.Text;
import NineSlice = Phaser.GameObjects.NineSlice;
import {Vector2D} from "../general/MathUtils";
import {Scene} from "phaser";

export class ActionLabel extends Container {

    private background: NineSlice
    private textLabel: Text

    constructor(scene: Scene, pos: Vector2D, width: number, height: number) {
        super(scene, pos.x, pos.y);
        scene.add.existing(this)

        this.background = this.scene.add.nineslice(0, 0, 'field_even', 0, width, height, 10, 10, 10, 10)
        this.textLabel = this.scene.add.text(0, 0, '', {
            fontSize: 40,
            color: "0x000000",
            fontFamily: "Londrina"
        })
        this.textLabel.setOrigin(0.5, 0.5)

        this.add([this.background, this.textLabel])
        this.alpha = 0
        this.scale = 0.8
    }

    async blendIn() {
        await this.tweenScaleAndAlpha(1, 1)
    }

    async changeText(newText: string) {
        if (this.textLabel.alpha > 0) {
            await this.tweenTextAlpha(0)
        }
        this.textLabel.text = newText?.toUpperCase()
        await this.tweenTextAlpha(1)
    }

    private async tweenTextAlpha(alpha: number) {
        return new Promise<void>(resolve => {
            this.scene.tweens.add({
                targets: this.textLabel,
                alpha: alpha,
                duration: 200,
                ease: Phaser.Math.Easing.Quadratic.InOut,
                onComplete: () => resolve()
            })
        })
    }

    private async tweenScaleAndAlpha(scale: number, alpha: number) {
        return new Promise<void>(resolve => {
            this.scene.tweens.add({
                targets: this,
                scaleX: scale,
                scaleY: scale,
                alpha: alpha,
                duration: 200,
                ease: Phaser.Math.Easing.Quadratic.InOut,
                onComplete: () => resolve()
            })
        })
    }
}