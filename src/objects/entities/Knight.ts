import {GridEntity} from "../GridEntity";
import {EntityName} from "../EntityData";
import Image = Phaser.GameObjects.Image;

export class Knight extends GridEntity {

    knightBody: Image
    knightHead: Image

    createImageContainer(): Phaser.GameObjects.Container {
        this.knightBody = this.scene.add.image(0, 50, 'entities.knight.body')
        this.knightBody.setOrigin(0.5, 1)

        this.knightHead = this.scene.add.image(0, -110, 'entities.knight.head')

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
        return this.scene.add.container(0, 0, [this.knightBody, this.knightHead]);
    }

    getName(): EntityName {
        return "knight";
    }

}