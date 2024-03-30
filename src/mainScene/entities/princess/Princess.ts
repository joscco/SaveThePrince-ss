import {GridEntityDescription, GridEntity} from "../GridEntity";
import {EntityName} from "../EntityName";
import {PrincessContainer} from "./PrincessContainer";
import {EntityContainer} from "../EntityContainer";

export class Princess extends GridEntity {

    private princessBodyContainer: PrincessContainer

    fillEntityContainer() {
        this.princessBodyContainer = new PrincessContainer(this.mainScene, 0, 0)
        this.container.add([this.princessBodyContainer])
    }

    getName(): EntityName {
        return "princess";
    }

    getDescriptionName(): GridEntityDescription {
        return {
            name: "the princess",
            isPlural: false
        };
    }
}