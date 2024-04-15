import {GridEntityDescription, GridEntity} from "../GridEntity";
import {EntityId} from "../EntityId";
import Image = Phaser.GameObjects.Image;
import {ScalableImage} from "../../ScalableImage";

export class Castle extends GridEntity {

    castleImage: ScalableImage

    fillEntityContainer() {
        this.castleImage = new ScalableImage(this.scene, {x: 0, y: 35}, "entities.castle")
        this.castleImage.setOrigin(0.5, 1)
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