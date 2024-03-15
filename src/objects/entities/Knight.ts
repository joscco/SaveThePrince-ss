import {GridEntity} from "../GridEntity";
import {EntityName} from "../EntityData";
import {PrincessContainer} from "../entityContainers/PrincessContainer";
import {KnightContainer} from "../entityContainers/KnightContainer";
import Container = Phaser.GameObjects.Container;

export class Knight extends GridEntity {

    private knightContainer: KnightContainer
    private princessContainer: PrincessContainer
    private _savedPrincess: boolean = false
    private _hasSword: boolean = false
    private _dead: boolean = false

    createEntityContainer(): Container {
        this.princessContainer = new PrincessContainer(this.mainScene, 0, 0)
        this.princessContainer.setHappy();
        this.princessContainer.scale = 0
        this.knightContainer = new KnightContainer(this.mainScene, 0, 0)
        return this.scene.add.container(0, 0, [this.princessContainer, this.knightContainer])
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
        this._hasSword = val
        this.knightContainer.setSword(val)
    }

    hasSword() {
        return this._hasSword
    }

    isDead() {
        return this._dead
    }

    public async showPrincess() {
        await this.knightContainer.tweenMove({x: -30, y: 0})
        this.princessContainer.setPosition(30, 0)
        await this.princessContainer.blendIn()
    }

    public async die() {
        this._dead = true
        this.movable = false
        this.knightContainer.setDead()
        await this.knightContainer.rotate(-90)
    }

    flip(lookingLeft: boolean) {
        this.knightContainer.setScale(lookingLeft ? -1 : 1, 1)
        if (this.hasPrincess()) {
            this.princessContainer.setScale(lookingLeft ? -1 : 1, 1)
        }
    }
}