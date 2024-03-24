import Image = Phaser.GameObjects.Image;
import {EntityContainer} from "./EntityContainer";
import {MainGameScene} from "../../scenes/MainGameScene";

export class WolfContainer extends EntityContainer {

    private wolfBody: Image
    private wolfHead: Image

    constructor(scene: MainGameScene, x: number, y: number) {
        super(scene, x, y);

        this.wolfBody = this.scene.add.image(0, 0, 'entities.wolf.body')
        this.wolfBody.setOrigin(0.5, 1)
        this.wolfHead = this.scene.add.image(0, 0, 'entities.wolf.angryHead')

        this.add([ this.wolfBody, this.wolfHead])
        
        this.setAggressive();
    }

    async setAggressive() {
        this.wolfBody.setTexture('entities.wolf.body')
        this.wolfBody.setPosition(0, 50)

        this.wolfHead.setTexture('entities.wolf.angryHead')
        this.wolfHead.setPosition(0, -65)

        this.animateAggressiveWolf();
    }


    private animateAggressiveWolf() {
        this.scene.tweens.add({
            targets: this.wolfHead,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            y: -60,
            yoyo: true,
            duration: 800,
            loop: -1
        })

        this.scene.tweens.add({
            targets: this.wolfBody,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            scaleX: 1.04,
            scaleY: 0.97,
            yoyo: true,
            duration: 800,
            loop: -1
        })
    }
}