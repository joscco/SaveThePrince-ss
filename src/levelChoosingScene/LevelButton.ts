import Container = Phaser.GameObjects.Container;
import {LevelChoosingScene} from "../scenes/LevelChoosingScene";
import {Vector2D} from "../general/MathUtils";
import Image = Phaser.GameObjects.Image;
import Text = Phaser.GameObjects.Text;
import Circle = Phaser.Geom.Circle;

export class LevelButton extends Container {
    private readonly image: Image;
    private readonly text: Text;

    constructor(levelScene: LevelChoosingScene, pos: Vector2D, level: number) {
        super(levelScene, pos.x, pos.y);

        this.image = levelScene.add.sprite(0, 0, 'levelScene_button')
        this.text = levelScene.add.text(0, 0, '' + level, {
            fontSize: 80,
            color: "0x000000",
            fontFamily: "Londrina"
        })
        this.text.setOrigin(0.5, 0.5)
        this.scale = 0
        this.add([this.image, this.text])
        this.setInteractive(new Circle(0, 0, 50), Phaser.Geom.Circle.Contains)
        levelScene.add.existing(this)
    }

    async blendIn(delay: number = 0) {
        await this.tweenScale(1, delay)
    }

    async blendOut(delay: number = 0) {
        await this.tweenScale(0, delay)
    }

    async scaleUp() {
        await this.tweenScale(1.2)
    }

    private async tweenScale(scale: number, delay: number = 0) {
        return new Promise<void>(resolve => this.scene.tweens.add({
            targets: this,
            duration: 300,
            scaleX: scale,
            scaleY: scale,
            delay: delay,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            onComplete: () => resolve()
        }))
    }


}