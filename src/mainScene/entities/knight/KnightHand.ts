import Image = Phaser.GameObjects.Image;
import Container = Phaser.GameObjects.Container;
import {MainGameScene} from "../../../scenes/MainGameScene";
import Tween = Phaser.Tweens.Tween;

export type ItemType = 'sword' | 'meat'

export class KnightHand extends Container {

    private handItem: Image
    private _isFree: boolean = true

    constructor(scene: MainGameScene, x: number, y: number, startItem = null) {
        super(scene, x, y);

        this.handItem = this.scene.add.image(0, 0, '')
        this.handItem.setOrigin(0.5, 1)
        this.handItem.scale = startItem ? 1 : 0

        this.add([this.handItem])
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

    private animateHands(y: number, angle: number) {
        this.handItem.angle = angle
        this.handItem.y = y
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