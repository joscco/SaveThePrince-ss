import {GridEntityDescription, GridEntity} from "../GridEntity";
import {EntityId} from "../EntityId";
import {WolfContainer} from "./WolfContainer";
import Container = Phaser.GameObjects.Container;
import {Vector2D} from "../../../general/MathUtils";

export class Wolf extends GridEntity {

    private wolfContainer: WolfContainer

    getName(): EntityId {
        return "wolf";
    }

    getDescriptionName(): GridEntityDescription{
        return {
            name: "the wolf",
            isPlural: false
        };
    }

    fillEntityContainer() {
        this.wolfContainer = new WolfContainer(this.mainScene, 0, 0)
        this.container.add(this.wolfContainer)
    }

    async turnAggressive() {
        await this.wolfContainer.tweenAggressive()
    }

    async turnDead() {
        await this.wolfContainer.tweenDead()
    }

    async turnNeutral() {
        await this.wolfContainer.tweenNeutral()
    }


}