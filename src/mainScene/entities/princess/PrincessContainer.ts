import {EntityContainer} from "../EntityContainer";
import {MainGameScene} from "../../../scenes/MainGameScene";
import {ScalableImage} from "../../ScalableImage";

export class PrincessContainer extends EntityContainer {

    private princessHead: ScalableImage

    constructor(scene: MainGameScene, x: number, y: number) {
        super(scene, x, y);
        this.princessHead = new ScalableImage(scene, {x: 0, y: 0}, 'entities.queen')
        this.princessHead.setOrigin(0.5, 1)

        this.add([this.princessHead])
    }

    setHappy() {
        this.princessHead.setTexture('entities.queen')
    }

    async turnFearful() {
        await this.princessHead.tweenChangeTexture('entities.queen')
    }
}