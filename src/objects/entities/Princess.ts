import {GridEntity} from "../GridEntity";
import {EntityName} from "../EntityData";
import Image = Phaser.GameObjects.Image;

export class Princess extends GridEntity {

    princessBody: Image
    princessHead: Image

    createImageContainer(): Phaser.GameObjects.Container {
        this.princessBody = this.scene.add.image(0, 50, 'entities.princess.body')
        this.princessBody.setOrigin(0.5, 1)

        this.princessHead = this.scene.add.image(5, -100, 'entities.princess.fearfulHead')

        this.scene.tweens.add({
            targets: this.princessHead,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            y: -95,
            yoyo: true,
            duration: 800,
            loop: -1
        })

        this.scene.tweens.add({
            targets: this.princessBody,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            scaleX: 1.07,
            scaleY: 0.95,
            yoyo: true,
            duration: 800,
            loop: -1
        })
        return this.scene.add.container(0, 0, [this.princessBody, this.princessHead]);
    }

    getName(): EntityName {
        return "princess";
    }

}