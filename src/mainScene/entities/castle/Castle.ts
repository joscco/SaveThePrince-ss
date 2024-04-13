import {GridEntityDescription, GridEntity} from "../GridEntity";
import {EntityId} from "../EntityId";
import Image = Phaser.GameObjects.Image;
import {ScalableImage} from "../../ScalableImage";

export class Castle extends GridEntity {

    castleImage: ScalableImage

    fillEntityContainer() {
        this.castleImage = new ScalableImage(this.scene, {x: 0, y: -40}, "entities.castle")
        this.container.add([this.castleImage]);
    }

    getName(): EntityId {
        return "castle";
    }

    getDescriptionName(): GridEntityDescription {
        return {
            name: "the castle",
            isPlural: false
        };
    }

}