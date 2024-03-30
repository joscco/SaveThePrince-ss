import {EntityName} from "./EntityName";
import {vector2Add, Vector2D, vector2Scalar, vector2Sub} from "../../general/MathUtils";
import {MainGameScene} from "../../scenes/MainGameScene";
import Container = Phaser.GameObjects.Container;

// We want:
// Multiple Entities bundled together
// Make these bundled entities half size
// Flip those bundled entities
// Make this bundled entities have items which change depth when flipped
// Make entities blendIndable

// GridEntity ->

export class GridEntityDescription {
    name: string
    isPlural: boolean
}

export abstract class GridEntity extends Container {

    mainScene: MainGameScene
    index: Vector2D
    container: Container
    movable: boolean = true

    private readonly shakeOffset = 5;
    private readonly verticalMoveOffset = 80;
    private readonly durationPerStep = 200;
    private readonly attackDuration = 150;

    constructor(scene: MainGameScene, x: number, y: number) {
        super(scene, x, y)
        this.mainScene = scene
        scene.add.existing(this)
        this.container = scene.add.container()
        this.container.scale = 0
        this.add([this.container])
        this.fillEntityContainer()
        this.depth = y
    }

    async turnTowards(otherIndex: Vector2D) {
        await this.adaptToMoveDirection(vector2Sub(otherIndex, this.index))
    }

    abstract fillEntityContainer()

    abstract getName(): EntityName

    abstract getDescriptionName(): GridEntityDescription

    setIndex(index: Vector2D) {
        this.index = index
    }

    setMovable(movable: boolean) {
        this.movable = movable
    }

    async tweenJumpMoveTo(pos: Vector2D) {
        let direction = vector2Sub({x: pos.x, y: pos.y}, {x: this.x, y: this.y})
        let isHorizontalMove = direction.y == 0

        // Adapt direction only if necessary
        await this.adaptToMoveDirection(direction)

        return new Promise<void>((resolve) => this.scene.tweens.add({
            targets: this,
            x: pos.x,
            y: pos.y,
            duration: this.durationPerStep,
            ease: Phaser.Math.Easing.Sine.InOut,
            onComplete: () => {
                this.container.y = 0
                this.container.x = 0
                resolve()
            },
            onUpdate: (tween) => {
                let value = tween.progress
                if (isHorizontalMove) {
                    this.container.y = -Math.min(value, 1 - value) * this.verticalMoveOffset
                }
                this.depth = this.y
            }
        }))
    }

    async attack(pos: Vector2D) {
        let ownPosition = {x: this.x, y: this.y}
        let mean = vector2Scalar(0.5, vector2Add(ownPosition, pos))
        this.depth = pos.y + 20
        return new Promise<void>((resolve) => this.scene.tweens.add({
            targets: this,
            x: mean.x,
            y: mean.y,
            duration: this.attackDuration,
            ease: Phaser.Math.Easing.Quadratic.Out,
            yoyo: true,
            onComplete: () => {
                resolve()
                this.depth = ownPosition.y
            }
        }))
    }

    async adaptToMoveDirection(direction: Vector2D) {
        // this can be overrideable for flipping etc
    }

    async scaleUp() {
        await this.scaleTween(1.2)
    }

    async scaleDown() {
        await this.scaleTween(1)
    }

    async blendIn(delay: number = 0) {
        await this.scaleTween(1, delay)
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
                    x: -this.shakeOffset,
                    duration: 40,
                    ease: Phaser.Math.Easing.Quadratic.InOut
                },
                {
                    x: this.shakeOffset,
                    duration: 40,
                    ease: Phaser.Math.Easing.Quadratic.InOut
                },
                {
                    x: -this.shakeOffset,
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

    private async scaleTween(scale: number, delay: number = 0) {
        return new Promise<void>(resolve => this.scene.tweens.add({
            targets: this.container,
            scale: scale,
            delay: delay,
            duration: 200,
            ease: Phaser.Math.Easing.Back.Out,
            onComplete: () => resolve()
        }))
    }
}