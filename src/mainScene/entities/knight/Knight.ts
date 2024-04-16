import {GridEntity, GridEntityDescription} from "../GridEntity";
import {EntityId} from "../EntityId";
import {PrincessContainer} from "../princess/PrincessContainer";
import {KnightContainer} from "./KnightContainer";
import {ItemType} from "./KnightHand";
import {Princess} from "../princess/Princess";
import {Vector} from "matter";
import {vector2Add, Vector2D, vector2Sub} from "../../../general/MathUtils";

export class Knight extends GridEntity {

    private knightContainer: KnightContainer
    private princessContainer: PrincessContainer
    private _savedPrincess: boolean = false
    private _heldItems: Set<ItemType> = new Set<ItemType>()
    private _dead: boolean = false

    fillEntityContainer() {
        this.knightContainer = new KnightContainer(this.mainScene, 0, 35)

        this.container.add([this.knightContainer])
    }

    getName(): EntityId {
        return "knight";
    }

    getDescriptionName(): GridEntityDescription {
        if (this.isDead()) {
            return {
                name: "the dead knight",
                isPlural: false
            }
        }

        if (this.hasPrincess()) {
            return {
                name: "the knight and the princess",
                isPlural: true
            }
        }

        return {
            name: "the knight",
            isPlural: false
        }
    }

    setHasPrincess(val: boolean) {
        this._savedPrincess = val;
    }

    hasPrincess() {
        return this._savedPrincess;
    }

    async setSword(val: boolean) {
        if (val) {

        }
        this._heldItems.add('sword')
        await this.addItem('sword')
    }

    has(item: ItemType) {
        return this._heldItems.has(item)
    }

    isDead() {
        return this._dead
    }

    async addItem(item: ItemType) {
        await this.knightContainer.addItem(item)
    }

    public async showPrincess(princess: Princess) {
        let basePosition: Vector2D = {x: 0, y: 35}
        let relativePrincessIndex = vector2Sub(princess.index, this.index)
        let princessPosition = vector2Add(basePosition, {
            x: (relativePrincessIndex.x > 0 ? 1 : -1) * 10,
            y: (relativePrincessIndex.y > 0 ? 1 : -1) * 15
        })
        let knightPosition = vector2Add(basePosition, {
            x: (relativePrincessIndex.x > 0 ? -1 : 1) * 10,
            y: (relativePrincessIndex.y > 0 ? -1 : 1) * 15
        })
        await this.tweenMoveContainer(this.knightContainer, knightPosition)
        await princess.tweenJumpMoveTo({x: this.x, y: this.y})
        this.princessContainer = princess.getContainer()
        if (princessPosition.y > knightPosition.y) {
            this.container.addAt(this.princessContainer, 1)
        } else {
            this.container.addAt(this.princessContainer, 0)
        }

        await princess.tweenMoveContainer(this.princessContainer, princessPosition)
    }


}