import {EntityName} from "./EntityData";
import {MainGameScene} from "../Game";
import {Vector2, vector2Dist, vector2Sub} from "../general/MathUtils";
import Container = Phaser.GameObjects.Container;
import Vector2Like = Phaser.Types.Math.Vector2Like;

export abstract class GridEntity extends Container {

    index: Vector2
    container: Container
    movable: boolean = true

    constructor(scene: MainGameScene, x: number, y: number) {
        super(scene, x, y)
        scene.add.existing(this)

        this.container = this.createImageContainer()

        this.add([this.container])

        this.scale = 0
        this.depth = 10
    }

    abstract createImageContainer(): Container

    abstract getName(): EntityName

    async tweenMoveTo(pos: Vector2Like) {
        var direction = vector2Sub({x: pos.x, y: pos.y}, {x: this.x, y: this.y})
        var distance = vector2Dist(direction)
        if (direction.x > 0) {
            this.flip(false)
        } else if (direction.x < 0) {
            this.flip(true)
        }
        return new Promise<void>((resolve) => this.scene.tweens.add({
            targets: this,
            x: pos.x,
            y: pos.y,
            duration: distance * 1.5,
            ease: Phaser.Math.Easing.Sine.InOut,
            onComplete: () => resolve()
        }))
    }

    flip(lookingLeft: boolean) {
        this.container.setScale(lookingLeft ? -1 : 1, 1)
    }

    setIndex(index: Vector2) {
        this.depth = index.y
        this.index = index
    }

    blendIn(delay: number = 0) {
        this.scene.tweens.add({
            targets: this,
            scale: 1,
            delay: delay,
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

    async shake(): Promise<void> {
        return new Promise<void>(resolve => this.scene.tweens.chain({
            targets: this.container,
            onComplete: () => resolve(),
            tweens: [
                {
                    x: -5,
                    duration: 40,
                    ease: Phaser.Math.Easing.Quadratic.InOut
                },
                {
                    x: 5,
                    duration: 40,
                    ease: Phaser.Math.Easing.Quadratic.InOut
                },
                {
                    x: -5,
                    duration: 40,
                    ease: Phaser.Math.Easing.Quadratic.InOut
                },
                {
                    x: 0,
                    duration: 40,
                    ease: Phaser.Math.Easing.Quadratic.InOut
                }
            ],
        }))
    }

    setMovable(movable: boolean) {
        this.movable = movable
    }
}