import Image = Phaser.GameObjects.Image;
import {EntityContainer} from "../EntityContainer";
import {MainGameScene} from "../../../scenes/MainGameScene";
import {EntitySprite} from "../../EntitySprite";

export class SwordStoneContainer extends EntityContainer {

    private stone: EntitySprite

    constructor(scene: MainGameScene, x: number, y: number) {
        super(scene, x, y);

        this.stone = new EntitySprite(scene, {x: 0, y: 0}, 'entities.swordStone.withSword')

        this.add([this.stone])
        this.setSword(true);
    }

    async setSword(value: boolean) {
        await this.stone.tweenChangeTexture(value ? 'entities.swordStone.withSword' : 'entities.swordStone.withoutSword')
    }
}