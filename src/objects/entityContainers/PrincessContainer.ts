import Image = Phaser.GameObjects.Image;
import {MainGameScene} from "../../Game";
import {EntityContainer} from "./EntityContainer";

export class PrincessContainer extends EntityContainer {

    private princessBody: Image
    private princessHead: Image
    private princessLeftArm: Image
    private princessRightArm: Image

    constructor(scene: MainGameScene, x: number, y: number) {
        super(scene, x, y);

        this.princessBody = this.scene.add.image(0, 50, 'entities.princess.body')
        this.princessBody.setOrigin(0.5, 1)
        this.princessHead = this.scene.add.image(0, -100, 'entities.princess.fearfulHead')
        this.princessLeftArm = this.scene.add.image(-35, 0, 'entities.princess.arm')
        this.princessLeftArm.setOrigin(0.1, 0.5)
        this.princessRightArm = this.scene.add.image(35, 0, 'entities.princess.arm')
        this.princessRightArm.setOrigin(0.1, 0.5)

        this.add([ this.princessBody, this.princessHead, this.princessRightArm, this.princessLeftArm])

        this.setFearful()
    }

    setFearful() {
        this.princessBody.setTexture('entities.princess.body')
        this.princessBody.setPosition(0, 50)

        this.princessHead.setTexture('entities.princess.fearfulHead')
        this.princessHead.setPosition(-5, -100)

        this.princessLeftArm.setTexture( 'entities.princess.arm')
        this.princessLeftArm.setPosition(-35, 0)
        this.princessLeftArm.angle = -65

        this.princessRightArm.setTexture('entities.princess.arm')
        this.princessRightArm.setPosition(35, 0)
        this.princessRightArm.angle = -115

        this.animateFearfulPrincess()
    }

    async setHappy() {
        this.princessBody.setTexture('entities.princess.body')
        this.princessBody.setPosition(0, 50)

        this.princessHead.setTexture('entities.princess.happyHead')
        this.princessHead.setPosition(-5, -100)

        this.princessLeftArm.setTexture( 'entities.princess.arm')
        this.princessLeftArm.setPosition(-35, 0)
        this.princessLeftArm.angle = -65

        this.princessRightArm.setTexture('entities.princess.arm')
        this.princessRightArm.setPosition(35, 0)
        this.princessRightArm.angle = -115
    }

    private animateFearfulPrincess() {
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
    }
}