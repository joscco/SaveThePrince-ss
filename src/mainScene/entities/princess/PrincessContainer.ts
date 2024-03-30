import Image = Phaser.GameObjects.Image;
import {EntityContainer} from "../EntityContainer";
import {MainGameScene} from "../../../scenes/MainGameScene";
import {EntitySprite} from "../../EntitySprite";

export class PrincessContainer extends EntityContainer {

    private princessHead: EntitySprite

    constructor(scene: MainGameScene, x: number, y: number) {
        super(scene, x, y);
        this.princessHead = new EntitySprite(scene, {x: 0, y: 0}, 'entities.princess.neutral')

        this.add([this.princessHead])
    }

    setHappy() {
        this.princessHead.setTexture('entities.princess.happy')
    }

    async turnFearful() {
        await this.princessHead.tweenChangeTexture('entities.princess.fearful')
    }
}