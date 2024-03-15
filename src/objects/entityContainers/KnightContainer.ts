import Image = Phaser.GameObjects.Image;
import {MainGameScene} from "../../Game";
import {EntityContainer} from "./EntityContainer";

export class KnightContainer extends EntityContainer {

    private knightBody: Image
    private knightHead: Image
    private knightLeftArm: Image
    private knightRightArm: Image

    constructor(scene: MainGameScene, x: number, y: number) {
        super(scene, x, y);

        this.knightBody = this.scene.add.image(0, 50, 'entities.knight.body')
        this.knightBody.setOrigin(0.5, 1)
        this.knightHead = this.scene.add.image(0, -110, 'entities.knight.head')

        this.knightLeftArm = this.scene.add.image(-35, 0, 'entities.knight.arm')
        this.knightLeftArm.setOrigin(0.1, 0.5)
        this.knightRightArm = this.scene.add.image(35, 0, 'entities.knight.arm')
        this.knightRightArm.setOrigin(0.1, 0.5)

        this.add([this.knightRightArm, this.knightBody, this.knightHead, this.knightLeftArm])

        this.setHappy();
    }

    async setHappy() {
        this.knightBody.setTexture('entities.knight.body')
        this.knightBody.setPosition(0, 50)

        this.knightHead.setTexture('entities.knight.head')
        this.knightHead.setPosition(0, -100)

        this.knightLeftArm.setTexture('entities.knight.arm')
        this.knightLeftArm.setPosition(-20, -25)
        this.knightLeftArm.angle = 105

        this.knightRightArm.setTexture('entities.knight.arm')
        this.knightRightArm.setPosition(20, -25)
        this.knightRightArm.angle = 75

        this.animateHappyKnight();
    }


    private animateHappyKnight() {
        this.scene.tweens.add({
            targets: this.knightHead,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            y: -105,
            yoyo: true,
            duration: 800,
            loop: -1
        })

        this.scene.tweens.add({
            targets: this.knightBody,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            scaleX: 1.07,
            scaleY: 0.95,
            yoyo: true,
            duration: 800,
            loop: -1
        })

        this.scene.tweens.add({
            targets: this.knightLeftArm,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            angle: 100,
            yoyo: true,
            duration: 800,
            loop: -1
        })

        this.scene.tweens.add({
            targets: this.knightRightArm,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            angle: 80 ,
            yoyo: true,
            duration: 800,
            loop: -1
        })
    }

    setDead() {
        this.knightHead.setTexture("entities.knight.deadHead")
    }

    setSword(val: boolean) {
        this.knightRightArm.setTexture(val ? 'entities.knight.armWithSword' : 'entities.knight.arm')
    }
}