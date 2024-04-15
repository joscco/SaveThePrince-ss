import {GridEntity, GridEntityDescription} from "../GridEntity";
import {EntityId} from "../EntityId";
import {PrincessContainer} from "../princess/PrincessContainer";
import {KnightContainer} from "./KnightContainer";
import {ItemType} from "./KnightHand";

export class Knight extends GridEntity {

    private knightContainer: KnightContainer
    private princessContainer: PrincessContainer
    private _savedPrincess: boolean = false
    private _heldItems: Set<ItemType> = new Set<ItemType>()
    private _dead: boolean = false

    fillEntityContainer() {
        this.princessContainer = new PrincessContainer(this.mainScene, 0, 35)
        this.princessContainer.scale = 0
        this.princessContainer.setHappy()

        this.knightContainer = new KnightContainer(this.mainScene, 0, 35)

        this.container.add([this.knightContainer, this.princessContainer])
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

    public async showPrincess() {
        await this.knightContainer.tweenMove({x: -20, y: 15})
        this.princessContainer.setPosition(20, 45)
        await Promise.all([
            this.knightContainer.scaleHalfSize(),
            this.princessContainer.scaleHalfSize()
        ])
    }

    async turnDead() {
        this._dead = true
        this.movable = false

        await this.knightContainer.tweenDead()
    }

    async turnFearful() {
        if (this.hasPrincess()) {
            this.princessContainer.turnFearful()
        }
        await this.knightContainer.tweenFearful()
    }
}