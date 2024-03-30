import {EntityContainer} from "../EntityContainer";
import {MainGameScene} from "../../../scenes/MainGameScene";
import {EntitySprite} from "../../EntitySprite";
import {ItemType, KnightHand} from "./KnightHand";
import GameObject = Phaser.GameObjects.GameObject;

export class KnightContainer extends EntityContainer {

    private knightHead: EntitySprite
    private knightLeftHand: KnightHand
    private knightRightHand: KnightHand

    constructor(scene: MainGameScene, x: number, y: number) {
        super(scene, x, y);
        this.knightHead = new EntitySprite(scene, {x: 0, y: 0}, 'entities.knight.neutral')
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
        this.knightHead.setTexture('entities.knight.neutral')
    }

    async tweenDead() {
        await this.knightHead.tweenChangeTexture("entities.knight.dead")
    }

    async tweenFearful() {
        await this.knightHead.tweenChangeTexture("entities.knight.fearful")
    }

    async flipHeadAndHands(lookingRight: boolean) {
        await this.knightHead.flip(lookingRight, () => {
            if (lookingRight) {
                this.moveBelow<GameObject>(this.knightRightHand, this.knightHead)
                this.moveAbove<GameObject>(this.knightLeftHand, this.knightHead)
            } else {
                this.moveBelow<GameObject>(this.knightLeftHand, this.knightHead)
                this.moveAbove<GameObject>(this.knightRightHand, this.knightHead)
            }
        })
    }

    async addItem(item: ItemType) {
        if (this.knightRightHand.isFree()) {
            await this.knightRightHand.setItem(item)
        } else if (this.knightLeftHand.isFree()) {
            await this.knightLeftHand.setItem(item)
        }
    }
}