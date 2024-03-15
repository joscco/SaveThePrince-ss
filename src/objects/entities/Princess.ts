import {GridEntity} from "../GridEntity";
import {EntityName} from "../EntityData";
import Image = Phaser.GameObjects.Image;
import Container = Phaser.GameObjects.Container;
import {PrincessContainer} from "../entityContainers/PrincessContainer";
import {EntityContainer} from "../entityContainers/EntityContainer";

export class Princess extends GridEntity {

    private princessBodyContainer: PrincessContainer

    createEntityContainer(): EntityContainer {
        this.princessBodyContainer = new PrincessContainer(this.mainScene, 0, 0)
        return this.princessBodyContainer
    }

    getName(): EntityName {
        return "princess";
    }
}