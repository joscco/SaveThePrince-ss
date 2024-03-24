import {GridEntity} from "../GridEntity";
import {EntityName} from "../EntityData";
import {PrincessContainer} from "../entityContainers/PrincessContainer";
import {KnightContainer} from "../entityContainers/KnightContainer";
import Container = Phaser.GameObjects.Container;
import {Vector2} from "../../general/MathUtils";
import {ItemType, KnightHand} from "../entityContainers/KnightHand";

export class Knight extends GridEntity {

    private knightContainer: KnightContainer
    private princessContainer: PrincessContainer

    private knightLeftHand: KnightHand
    private knightRightHand: KnightHand
    private _savedPrincess: boolean = false
    private _heldItems: Set<ItemType> = new Set<ItemType>()
    private _dead: boolean = false

    createEntityContainer(): Container {
        this.princessContainer = new PrincessContainer(this.mainScene, 0, 0)
        this.princessContainer.setHappy();
        this.princessContainer.scale = 0
        this.knightContainer = new KnightContainer(this.mainScene, 0, 50)

        this.knightLeftHand = new KnightHand(this.mainScene, 0, 0, true)
        this.knightRightHand = new KnightHand(this.mainScene, 0, 0, false)

        this.knightLeftHand.setItem(null)
        this.knightLeftHand.setPosition(-50, 10)

        this.knightRightHand.setItem(null)
        this.knightRightHand.setPosition(30, 10)

        return this.scene.add.container(0, 0, [this.princessContainer, this.knightContainer, this.knightRightHand, this.knightLeftHand])
    }

    getName(): EntityName {
        return "knight";
    }

    setHasPrincess(val: boolean) {
        this._savedPrincess = val;
    }

    hasPrincess() {
        return this._savedPrincess;
    }

    setSword(val: boolean) {
        if (val) {

        }
        this._heldItems.add('sword')
        this.addItem('sword')
    }

    has(item: ItemType) {
        return this._heldItems.has(item)
    }

    attackWith(item: ItemType) {

    }

    isDead() {
        return this._dead
    }



    swingHandWith(item: ItemType) {

    }

    addItem(item: ItemType) {
        if (this.knightRightHand.isFree()) {
            this.knightRightHand.setItem(item)
        } else if (this.knightLeftHand.isFree()) {
            this.knightLeftHand.setItem(item)
        }
    }
    async tweenMoveHandsUp() {
        this.knightLeftHand.tweenMovePosition(-5, -35, -80)
        await this.knightRightHand.tweenMovePosition(20, -35, -100)
    }

    public async showPrincess() {
        this.princessContainer.setPosition(0, -45)
        await this.tweenMoveHandsUp()
        await this.princessContainer.blendIn()
    }

    public async die() {
        this._dead = true
        this.movable = false
        this.knightContainer.setDead()
        this.princessContainer.setFearful()
        this.knightContainer.tweenMove({x: 80, y: 50})
        await this.knightContainer.rotate(-90)
    }

    override adaptToMoveDirection(direction: Vector2) {
        if (direction.x == 0) {
            // No adaption required
            return
        }

        let goingLeft = direction.x < 0
        this.knightContainer.setScale(goingLeft ? -1 : 1, 1)
        if (this.hasPrincess()) {
            this.princessContainer.setScale(goingLeft ? -1 : 1, 1)
        }
    }
}