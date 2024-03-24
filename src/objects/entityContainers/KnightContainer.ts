import Image = Phaser.GameObjects.Image;
import {EntityContainer} from "./EntityContainer";
import {MainGameScene} from "../../scenes/MainGameScene";
import {ItemType, KnightHand} from "./KnightHand";

export class KnightContainer extends EntityContainer {

    private knightBody: Image
    private knightHead: Image
    private bothHandItem: Image

    constructor(scene: MainGameScene, x: number, y: number) {
        super(scene, x, y);

        this.knightBody = this.scene.add.image(0, 0, 'entities.knight.body')
        this.knightBody.setOrigin(0.5, 1)
        this.knightHead = this.scene.add.image(0, 0, 'entities.knight.head')

        this.bothHandItem = this.scene.add.image(20, -40, '')
        this.bothHandItem.scale = 0

        this.add([this.knightBody, this.bothHandItem, this.knightHead])

        this.setHappy();
    }

    async setHappy() {
        this.knightBody.setTexture('entities.knight.body')
        this.knightBody.setOrigin(0.5, 1)
        this.knightBody.setPosition(0, 0)

        this.knightHead.setTexture('entities.knight.head')
        this.knightHead.setPosition(0, -120)


        this.animateHappyKnight();
    }


    private animateHappyKnight() {
        this.scene.tweens.add({
            targets: this.knightHead,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            y: -117,
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
    }

    setDead() {
        this.knightHead.setTexture("entities.knight.deadHead")
    }
}