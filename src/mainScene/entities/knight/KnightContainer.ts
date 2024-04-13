import {EntityContainer} from "../EntityContainer";
import {MainGameScene} from "../../../scenes/MainGameScene";
import {ScalableImage} from "../../ScalableImage";
import {ItemType, KnightHand} from "./KnightHand";
import GameObject = Phaser.GameObjects.GameObject;

export class KnightContainer extends EntityContainer {

    private knightHead: ScalableImage
    private knightLeftHand: KnightHand
    private knightRightHand: KnightHand

    constructor(scene: MainGameScene, x: number, y: number) {
        super(scene, x, y);
        this.knightHead = new ScalableImage(scene, {x: 0, y: 0}, 'entities.knight')
        this.knightHead.setOrigin(0.5, 1)
        this.knightLeftHand = new KnightHand(scene, 0, 0)
        this.knightRightHand = new KnightHand(scene, 0, 0)

        this.knightLeftHand.setItem(null)
        this.knightLeftHand.setPosition(-50, 40)

        this.knightRightHand.setItem(null)
        this.knightRightHand.setPosition(30, 40)

        this.add([this.knightRightHand, this.knightHead, this.knightLeftHand])

        this.setHappy();
    }

    async setHappy() {
        this.knightHead.setTexture('entities.knight')
    }

    async tweenDead() {
        await this.knightHead.tweenChangeTexture("entities.knight")
    }

    async tweenFearful() {
        await this.knightHead.tweenChangeTexture("entities.knight")
    }

    async flipHeadAndHands(lookingRight: boolean) {
        await this.knightHead.flip(lookingRight)
    }

    async addItem(item: ItemType) {
        if (this.knightRightHand.isFree()) {
            await this.knightRightHand.setItem(item)
        } else if (this.knightLeftHand.isFree()) {
            await this.knightLeftHand.setItem(item)
        }
    }
}