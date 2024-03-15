import {GridEntity} from "../GridEntity";
import {EntityName} from "../EntityData";
import {PrincessContainer} from "../entityContainers/PrincessContainer";
import {KnightContainer} from "../entityContainers/KnightContainer";
import Container = Phaser.GameObjects.Container;

export class Knight extends GridEntity {

    private knightContainer: KnightContainer
    private princessContainer: PrincessContainer
    private savedPrincess: boolean = false

    createEntityContainer(): Container {
        this.princessContainer = new PrincessContainer(this.mainScene, 0, 0)
        this.princessContainer.setHappy();
        this.princessContainer.scale = 0
        this.knightContainer = new KnightContainer(this.mainScene, 0, 0)
        return this.scene.add.container(0, 0, [this.knightContainer, this.princessContainer])
    }

    getName(): EntityName {
        return "knight";
    }

    setHasPrincess(val: boolean) {
        this.savedPrincess = val;
    }

    hasPrincess() {
        return this.savedPrincess;
    }

    public async showPrincess() {
        await this.knightContainer.tweenMove({x: -30, y: 0})
        this.princessContainer.setPosition(30, 0)
        await this.princessContainer.blendIn()
    }
}