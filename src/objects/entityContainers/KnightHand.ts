import Image = Phaser.GameObjects.Image;
import Container = Phaser.GameObjects.Container;
import {MainGameScene} from "../../scenes/MainGameScene";
import Tween = Phaser.Tweens.Tween;

export type ItemType = 'sword' | 'meat'

export class KnightHand extends Container {

    private handItem: Image
    private handImage: Image
    private innerContainer: Container
    private _isFree: boolean = true
    private moveTween: Tween;

    constructor(scene: MainGameScene, x: number, y: number, handInFront: boolean, startItem = null) {
        super(scene, x, y);

        this.handItem = this.scene.add.image(10, 10, '')
        this.handItem.setOrigin(0.5, 1)
        this.handItem.scale = startItem ? 1 : 0

        this.handImage = this.scene.add.image(0, 0, 'entities.hand')
        this.handImage.setOrigin(0.1, 0.5)

        this.innerContainer = this.scene.add.container(0, 0)

        if (handInFront) {
            this.innerContainer.add([this.handItem, this.handImage])
        } else {
            this.innerContainer.add([this.handImage, this.handItem])
        }

        this.add([this.innerContainer])
        this.scene.add.existing(this)

        this.setItem(startItem);
        this.animateHands(0, 20)
    }

    async setItem(item: ItemType) {
        if (!item) {
            this._isFree = true
            this.handItem.scale = 0
            return
        }

        switch (item) {
            case "sword":
                await this.tweenTexture('entities.items.sword')
        }

        this._isFree = false
    }

    isFree(): boolean {
        return this._isFree
    }

    async tweenMovePosition(x: number, y: number, angle: number) {
        return new Promise<void>(resolve => {
            this.scene.tweens.add({
                targets: this.innerContainer,
                x: x,
                y: y,
                angle: angle,
                ease: Phaser.Math.Easing.Quadratic.InOut,
                duration: 300,
                onComplete: () => {
                    this.animateHands(y, angle)
                    resolve()
                }
            })
        })
    }

    private animateHands(y: number, angle: number) {
        this.innerContainer.angle = angle
        this.innerContainer.y = y
        this.moveTween?.stop()
        this.moveTween = this.scene.tweens.add({
            targets: this.innerContainer,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            y: y + 3,
            angle: angle + 5,
            yoyo: true,
            duration: 800,
            loop: -1
        })
    }

    private async tweenTexture(textureKey: string) {
        await this.tweenItemScale(0, 200)
        this.handItem.setTexture(textureKey)
        await this.tweenItemScale(1, 200)
    }

    private async tweenItemScale(scale: number, duration: number) {
        return new Promise<void>(resolve => {
            this.scene.tweens.add({
                targets: this.handItem,
                scale: scale,
                duration: duration,
                ease: Phaser.Math.Easing.Quadratic.InOut,
                onComplete: () => {
                    resolve()
                }
            })
        })
    }
}