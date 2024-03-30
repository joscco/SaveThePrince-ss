import {GridEntityDescription, GridEntity} from "../GridEntity";
import {EntityName} from "../EntityName";
import {SwordStoneContainer} from "./SwordStoneContainer";
import Container = Phaser.GameObjects.Container;

export class SwordStone extends GridEntity {

    private swordStoneContainer: SwordStoneContainer
    private _hasSword: boolean = true

    fillEntityContainer() {
        this.swordStoneContainer = new SwordStoneContainer(this.mainScene, 0, -5)
        this.swordStoneContainer.setSword(true);
        this.container.add([this.swordStoneContainer])
    }

    getName(): EntityName {
        return "swordStone";
    }

    getDescriptionName(): GridEntityDescription {
        if (this.hasSword()) {
            return {
                name: "the sword stone",
                isPlural: false
            }
        }
        return {
            name: "a stone",
            isPlural: false
        }
    }

    hasSword() {
        return this._hasSword;
    }

    async setSword(val: boolean) {
        this._hasSword = val
        await this.swordStoneContainer.setSword(val)
    }
}