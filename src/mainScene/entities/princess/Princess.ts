import {GridEntity, GridEntityDescription} from "../GridEntity";
import {EntityId} from "../EntityId";
import {PrincessContainer} from "./PrincessContainer";

export class Princess extends GridEntity {

    private _frightened: boolean = false
    private princessBodyContainer: PrincessContainer

    fillEntityContainer() {
        this.princessBodyContainer = new PrincessContainer(this.mainScene, 0, 35)
        this.container.add([this.princessBodyContainer])
    }

    getName(): EntityId {
        return "princess";
    }

    getDescriptionName(): GridEntityDescription {
        return {
            name: "the princess",
            isPlural: false
        };
    }

    isFrightened(): boolean {
        return this._frightened;
    }

    async turnFearful() {
        this._frightened = true
        await this.princessBodyContainer.turnFearful()
    }

}