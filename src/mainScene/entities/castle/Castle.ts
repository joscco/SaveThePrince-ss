import {GridEntityDescription, GridEntity} from "../GridEntity";
import {EntityName} from "../EntityName";
import Image = Phaser.GameObjects.Image;

export class Castle extends GridEntity {

    castleImage: Image

    fillEntityContainer() {
        this.castleImage = this.scene.add.image(0, -5, "entities.castle")
        this.container.add([this.castleImage]);
    }

    getName(): EntityName {
        return "castle";
    }

    getDescriptionName(): GridEntityDescription {
        return {
            name: "the castle",
            isPlural: false
        };
    }

}