import Image = Phaser.GameObjects.Image;
import Container = Phaser.GameObjects.Container;
import {Scene} from "phaser";
import {Resource} from "./Resource";
import Text = Phaser.GameObjects.Text;
import Graphics = Phaser.GameObjects.Graphics;

export class ResourceDictionarySlot extends Container {
    slot: Image
    icon: Image
    shown: boolean
    resource: Resource
    numberTextBack: Graphics
    numberText: Text

    constructor(scene: Scene, x: number, y: number, resource: Resource) {
        super(scene, x, y);
        this.scene.add.existing(this)

        this.resource = resource
        this.slot = scene.add.image(0, 0, 'inventory/slot')
        this.icon = scene.add.image(0, 0, resource.textureName)
        this.numberTextBack = scene.add.graphics()
        this.numberTextBack.fillStyle(0xffffff)
        this.numberTextBack.fillCircle(40, 40, 40)
        this.numberText = scene.add.text(40, 40, "0", {
            fontSize: 40,
            color: '000',
            align: "center"
        })
        this.add([this.slot, this.icon, this.numberTextBack, this.numberText])

        this.setScale(0, 0)
        this.shown = false
    }


    blendOut() {
        this.tweenScaleTo(0, 300, false);
    }

    blendIn() {
        this.tweenScaleTo(1, 300, true)
    }

    private tweenScaleTo(scale: number, duration: number, shownAfter: boolean) {
        this.scene.tweens.add({
            targets: this,
            scaleX: scale,
            scaleY: scale,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            duration: duration,
            onComplete: () => {
                this.shown = shownAfter
            }
        })
    }

    updateNumber(value: number) {
        this.numberText.text = value + ""
    }
}