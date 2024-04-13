import {GridEntityDescription, GridEntity} from "../GridEntity";
import {EntityId} from "../EntityId";
import Image = Phaser.GameObjects.Image;
import {ScalableImage} from "../../ScalableImage";

export class Tree extends GridEntity {

    treeImage: ScalableImage

    fillEntityContainer() {
        this.treeImage = new ScalableImage(this.scene, {x: 0, y: -20}, "entities.tree")
        this.container.add([this.treeImage]);
    }

    getName(): EntityId {
        return "tree";
    }

    getDescriptionName(): GridEntityDescription {
        return {
            name: "trees",
            isPlural: true
        };
    }

}