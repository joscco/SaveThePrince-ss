import {GridEntity} from "../GridEntity";
import {EntityName} from "../EntityData";
import Image = Phaser.GameObjects.Image;
import Container = Phaser.GameObjects.Container;

export class Princess extends GridEntity {

    princessBody: Image
    princessBodyContainer: Container
    princessHead: Image
    princessLeftArm: Image
    princessRightArm: Image

    createImageContainer(): Phaser.GameObjects.Container {

        this.princessBody = this.scene.add.image(0, 50, 'entities.princess.body')
        this.princessBody.setOrigin(0.5, 1)

        this.princessHead = this.scene.add.image(5, -100, 'entities.princess.fearfulHead')

        this.princessLeftArm = this.scene.add.image(-35, 0, 'entities.princess.arm')
        this.princessLeftArm.setOrigin(0.1, 0.5)
        this.princessLeftArm.angle = -65
        this.princessRightArm = this.scene.add.image(35, 0, 'entities.princess.arm')
        this.princessRightArm.setOrigin(0.1, 0.5)
        this.princessRightArm.angle = -115

        this.princessBodyContainer = this.scene.add.container(0, 0, [])

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

        this.scene.tweens.add({
            targets: this.princessLeftArm,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            angle: -70,
            yoyo: true,
            duration: 800,
            loop: -1
        })

        this.scene.tweens.add({
            targets: this.princessRightArm,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            angle: -110 ,
            yoyo: true,
            duration: 800,
            loop: -1
        })
        return this.scene.add.container(0, 0, [this.princessBody, this.princessHead, this.princessRightArm, this.princessLeftArm]);
    }

    getName(): EntityName {
        return "princess";
    }

}