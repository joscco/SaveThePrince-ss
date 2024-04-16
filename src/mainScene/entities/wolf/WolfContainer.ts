import {EntityContainer} from "../EntityContainer";
import {MainGameScene} from "../../../scenes/MainGameScene";
import {ScalableImage} from "../../ScalableImage";

export class WolfContainer extends EntityContainer {
    private wolfHead: ScalableImage

    constructor(scene: MainGameScene, x: number, y: number) {
        super(scene, x, y);
        this.wolfHead = new ScalableImage(scene, {x: 0, y: 0}, 'entities.wolf')
        this.wolfHead.setOrigin(0.5, 1)

        this.add([this.wolfHead])
    }

    async tweenAggressive() {
        await this.wolfHead.tweenChangeTexture('entities.wolf')
    }

    async tweenDead() {
        await this.wolfHead.tweenChangeTexture('entities.wolf')
    }

    async tweenNeutral() {
        await this.wolfHead.tweenChangeTexture('entities.wolf')
    }
}