import Image = Phaser.GameObjects.Image;
import {EntityContainer} from "./EntityContainer";
import {MainGameScene} from "../../scenes/MainGameScene";

export class SwordStoneContainer extends EntityContainer {

    private stone: Image

    constructor(scene: MainGameScene, x: number, y: number) {
        super(scene, x, y);

        this.stone = this.scene.add.image(0, 0, 'entities.swordStone.withSword')
        this.stone.setOrigin(0.5, 1)

        this.add([this.stone])
        this.setSword(true);
    }



    async setSword(value: boolean) {
        this.stone.setTexture(value ? 'entities.swordStone.withSword' : 'entities.swordStone.withoutSword')
        this.stone.setPosition(0, 50)
    }
}