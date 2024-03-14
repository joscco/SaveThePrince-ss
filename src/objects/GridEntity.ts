import {EntityData} from "./EntityData";
import {MainGameScene} from "../Game";
import Image = Phaser.GameObjects.Image;
import Container = Phaser.GameObjects.Container;
import Vector2Like = Phaser.Types.Math.Vector2Like;
import {Vector2} from "../general/MathUtils";

export class GridEntity extends Container {

    index: Vector2
    icon: Image
    entityData: EntityData

    constructor(scene: MainGameScene, x: number, y: number, entityData: EntityData) {
        super(scene, x, y)
        scene.add.existing(this)

        this.entityData = entityData
        this.icon = scene.add.image(0, 0, entityData.textureName)

        this.add([this.icon])

        this.scale = 0
        this.depth = 0
    }

    async tweenMoveTo(pos: Vector2Like) {
        return new Promise<void>((resolve) => this.scene.tweens.add({
            targets: this,
            x: pos.x,
            y: pos.y,
            duration: 300,
            ease: Phaser.Math.Easing.Quadratic.Out,
            onComplete: () => resolve()
        }))
    }

    setIndex(index: Vector2) {
        this.index = index
    }

    blendIn() {
        this.scene.tweens.add({
            targets: this,
            scale: 1,
            duration: 200,
            ease: Phaser.Math.Easing.Back.Out
        })
    }

    blendOutThenDestroy() {
        this.scene.tweens.add({
            targets: this,
            scale: 0,
            duration: 200,
            ease: Phaser.Math.Easing.Back.In,
            onComplete: () => {
                this.destroy()
            }
        })
    }

    getName() {
        return this.entityData.name
    }

    async shake(): Promise<void> {
        return new Promise<void>(resolve => this.scene.tweens.chain({
            targets: this.icon,
            onComplete: () => resolve(),
            tweens: [
                {
                    x: -10,
                    duration: 50,
                    ease: Phaser.Math.Easing.Quadratic.InOut
                },
                {
                    x: 10,
                    duration: 50,
                    ease: Phaser.Math.Easing.Quadratic.InOut
                },
                {
                    x: -10,
                    duration: 50,
                    ease: Phaser.Math.Easing.Quadratic.InOut
                },
                {
                    x: 0,
                    duration: 50,
                    ease: Phaser.Math.Easing.Quadratic.InOut
                }
            ],
        }))
    }
}