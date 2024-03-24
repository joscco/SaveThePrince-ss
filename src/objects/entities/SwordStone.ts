import {GridEntity} from "../GridEntity";
import {EntityName} from "../EntityData";
import {SwordStoneContainer} from "../entityContainers/SwordStoneContainer";
import Container = Phaser.GameObjects.Container;

export class SwordStone extends GridEntity {

    private swordStoneContainer
    private _hasSword: boolean = true

    createEntityContainer(): Container {
        this.swordStoneContainer = new SwordStoneContainer(this.mainScene, 0, 0)
        this.swordStoneContainer.setSword(true);
        return this.swordStoneContainer
    }

    getName(): EntityName {
        return "swordStone";
    }

    hasSword() {
        return this._hasSword;
    }

    setSword(val: boolean) {
        this._hasSword = val
        this.swordStoneContainer.setSword(val)
    }
}