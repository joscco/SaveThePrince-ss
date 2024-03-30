import Image = Phaser.GameObjects.Image;
import {EntityContainer} from "../EntityContainer";
import {MainGameScene} from "../../../scenes/MainGameScene";

export class PrincessContainer extends EntityContainer {

    private princessHead: Image

    constructor(scene: MainGameScene, x: number, y: number) {
        super(scene, x, y);
        this.princessHead = this.scene.add.image(0, 0, 'entities.princess.fearful')

        this.add([this.princessHead])

        this.setFearful()
    }

    setFearful() {
        this.princessHead.setTexture('entities.princess.fearful')
    }

    setHappy() {
        this.princessHead.setTexture('entities.princess.happy')
    }
}