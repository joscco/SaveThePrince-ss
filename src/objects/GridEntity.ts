import {EntityName} from "./EntityData";
import {Vector2, vector2Sub} from "../general/MathUtils";
import Container = Phaser.GameObjects.Container;
import Vector2Like = Phaser.Types.Math.Vector2Like;
import {MainGameScene} from "../scenes/MainGameScene";

export abstract class GridEntity extends Container {

    mainScene: MainGameScene
    index: Vector2
    container: Container
    movable: boolean = true

    constructor(scene: MainGameScene, x: number, y: number) {
        super(scene, x, y)
        this.mainScene = scene
        scene.add.existing(this)

        this.container = this.createEntityContainer()

        this.add([this.container])

        this.scale = 0
        this.depth = y
    }

    abstract createEntityContainer(): Container

    abstract getName(): EntityName

    async tweenMoveTo(pos: Vector2Like) {
        var direction = vector2Sub({x: pos.x, y: pos.y}, {x: this.x, y: this.y})

        this.adaptToMoveDirection(direction)

        return new Promise<void>((resolve) => this.scene.tweens.add({
            targets: this,
            x: pos.x,
            y: pos.y,
            duration: 150,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            onComplete: () => resolve(),
            onUpdate: () => {this.depth = this.y}
        }))
    }

    adaptToMoveDirection(direction: Vector2) {
        // this can be overrideable for flipping etc
    }

    setIndex(index: Vector2) {
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

    async blendOutThenDestroy() {
        return new Promise<void>(resolve => this.scene.tweens.add({
            targets: this.container,
            scale: 0,
            duration: 200,
            ease: Phaser.Math.Easing.Back.In,
            onComplete: () => {
                this.destroy()
                resolve()
            }
        }))
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