import {GridEntity, GridEntityDescription} from "../GridEntity";
import {EntityName} from "../EntityName";
import {PrincessContainer} from "./PrincessContainer";
import {Vector2D} from "../../../general/MathUtils";

export class Princess extends GridEntity {

    private _frightened: boolean = false
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

    isFrightened(): boolean {
        return this._frightened;
    }

    async turnFearful() {
        this._frightened = true
        await this.princessBodyContainer.turnFearful()
    }

    override async adaptToMoveDirection(direction: Vector2D) {
        if (direction.x == 0) {
            // No adaption required
            return
        }

        let lookingRight = direction.x > 0
        await this.princessBodyContainer.flip(lookingRight)
    }
}