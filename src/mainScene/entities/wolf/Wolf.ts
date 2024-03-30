import {GridEntityDescription, GridEntity} from "../GridEntity";
import {EntityName} from "../EntityName";
import {WolfContainer} from "./WolfContainer";
import Container = Phaser.GameObjects.Container;
import {Vector2D} from "../../../general/MathUtils";

export class Wolf extends GridEntity {

    private wolfContainer: WolfContainer

    getName(): EntityName {
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

    override async adaptToMoveDirection(direction: Vector2D) {
        if (direction.x == 0) {
            // No adaption required
            return
        }

        let lookingRight = direction.x > 0
        await this.wolfContainer.flip(lookingRight)
    }
}