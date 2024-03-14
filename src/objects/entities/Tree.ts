import {GridEntity} from "../GridEntity";
import {EntityName} from "../EntityData";
import Image = Phaser.GameObjects.Image;

export class Tree extends GridEntity {

    treeImage: Image

    createImageContainer(): Phaser.GameObjects.Container {
        this.treeImage = this.scene.add.image(0, -50, "entities.tree")
        return this.scene.add.container(0, 0, [this.treeImage]);
    }

    getName(): EntityName {
        return "tree";
    }

}