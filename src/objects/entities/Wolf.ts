import {GridEntity} from "../GridEntity";
import {EntityName} from "../EntityData";
import {WolfContainer} from "../entityContainers/WolfContainer";
import Container = Phaser.GameObjects.Container;

export class Wolf extends GridEntity {

    private wolfContainer: WolfContainer

    createEntityContainer(): Container {
        this.wolfContainer = new WolfContainer(this.mainScene, 0, 0)
        this.wolfContainer.setAggressive();
        return this.wolfContainer
    }

    getName(): EntityName {
        return "wolf";
    }
}