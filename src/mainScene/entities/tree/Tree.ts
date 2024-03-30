import {GridEntityDescription, GridEntity} from "../GridEntity";
import {EntityName} from "../EntityName";
import Image = Phaser.GameObjects.Image;

export class Tree extends GridEntity {

    treeImage: Image

    fillEntityContainer() {
        this.treeImage = this.scene.add.image(0, -5, "entities.tree")
        this.container.add([this.treeImage]);
    }

    getName(): EntityName {
        return "tree";
    }

    getDescriptionName(): GridEntityDescription {
        return {
            name: "trees",
            isPlural: true
        };
    }

}