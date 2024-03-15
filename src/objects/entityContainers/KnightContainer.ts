import Image = Phaser.GameObjects.Image;
import {MainGameScene} from "../../Game";
import {EntityContainer} from "./EntityContainer";

export class KnightContainer extends EntityContainer {

    private knightBody: Image
    private knightHead: Image

    constructor(scene: MainGameScene, x: number, y: number) {
        super(scene, x, y);

        this.knightBody = this.scene.add.image(0, 50, 'entities.knight.body')
        this.knightBody.setOrigin(0.5, 1)
        this.knightHead = this.scene.add.image(0, -110, 'entities.knight.head')

        this.add([ this.knightBody, this.knightHead])
        
        this.setHappy();
    }

    async setHappy() {
        this.knightBody.setTexture('entities.knight.body')
        this.knightBody.setPosition(0, 50)

        this.knightHead.setTexture('entities.knight.head')
        this.knightHead.setPosition(0, -100)

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
    }
}