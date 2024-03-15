import Container = Phaser.GameObjects.Container;
import NineSlice = Phaser.GameObjects.NineSlice;
import Text = Phaser.GameObjects.Text;
import {MainGameScene} from "../Game";

export class WinScreen extends Container {
    private background: NineSlice
    private text: Text
    private initialYPosition: number;
    private static OFFSET_Y = 1000;

    constructor(scene: MainGameScene, x: number, y: number) {
        super(scene, x, y);
        this.background = this.scene.add.nineslice(0, 0, 'field', 0, 800, 400, 10, 10, 10, 10)
        this.text = this.scene.add.text(0, 0, 'Won!', {
            fontSize: 100,
            color: "0x000000",
            fontFamily: "Londrina"
        })
        this.text.setOrigin(0.5, 0.5)

        this.initialYPosition = y
        this.y = y + WinScreen.OFFSET_Y

        this.add([this.background, this.text])
        this.depth = 1000
        this.scene.add.existing(this)
    }

    async blendIn() {
        return new Promise<void>(resolve => this.scene.tweens.add({
            targets: this,
            y: this.initialYPosition,
            duration: 300,
            ease: Phaser.Math.Easing.Back.Out,
            onComplete: () => resolve()
        }))
    }
}