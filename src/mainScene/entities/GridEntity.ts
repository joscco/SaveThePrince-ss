import {EntityId} from "./EntityId";
import {vector2Add, Vector2D, vector2Scalar} from "../../general/MathUtils";
import {MainGameScene} from "../../scenes/MainGameScene";
import Container = Phaser.GameObjects.Container;
import BaseSound = Phaser.Sound.BaseSound;

export class GridEntityDescription {
    name: string
    isPlural: boolean
}

export abstract class GridEntity extends Container {

    mainScene: MainGameScene
    index: Vector2D
    container: Container
    movable: boolean = true
    moveSounds: BaseSound[]

    private readonly shakeOffset = 5;
    private readonly durationPerStep = 200;
    private readonly attackDuration = 150;

    constructor(scene: MainGameScene, x: number, y: number) {
        super(scene, x, y)
        this.mainScene = scene
        scene.add.existing(this)
        this.container = scene.add.container()
        this.container.y = -50
        this.container.alpha = 0
        this.add([this.container])
        this.fillEntityContainer()
        this.depth = y

        this.moveSounds = [
            this.scene.sound.add("move_1"),
            this.scene.sound.add("move_2"),
            this.scene.sound.add("move_3"),
            this.scene.sound.add("move_4")
        ]
    }

    abstract fillEntityContainer()

    abstract getName(): EntityId

    abstract getDescriptionName(): GridEntityDescription

    setIndex(index: Vector2D) {
        this.index = index
    }

    setMovable(movable: boolean) {
        this.movable = movable
    }

    async tweenJumpMoveTo(pos: Vector2D) {
        this.moveSounds[Math.floor(Math.random() * 4)].play()
        return new Promise<void>((resolve) => this.scene.tweens.add({
            targets: this,
            x: pos.x,
            y: pos.y,
            duration: this.durationPerStep,
            ease: Phaser.Math.Easing.Cubic.InOut,
            onComplete: async () => {
                resolve()
            },
            onUpdate: () => {
                this.depth = this.y
            }
        }))
    }

    async attack(pos: Vector2D) {
        let ownPosition = {x: this.x, y: this.y}
        let mean = vector2Scalar(0.5, vector2Add(ownPosition, pos))
        return new Promise<void>((resolve) => this.scene.tweens.add({
            targets: this,
            x: mean.x,
            y: mean.y,
            duration: this.attackDuration,
            ease: Phaser.Math.Easing.Cubic.Out,
            yoyo: true,
            onComplete: () => {
                resolve()
                this.depth = this.y
            }
        }))
    }

    async scaleUp() {
        await this.scaleTween(1.1, 150, Phaser.Math.Easing.Back.InOut)
    }

    async scaleDown() {
        await this.scaleTween(1)
    }

    async blendIn(delay: number = 0) {
        await Promise.all([
            this.moveYTween(0, 400, Phaser.Math.Easing.Cubic.Out, delay),
            this.alphaTween(1, 300, Phaser.Math.Easing.Cubic.Out, delay)
        ])
    }

    async blendOutThenDestroy() {
        await Promise.all([
            this.moveYTween(-50, 400, Phaser.Math.Easing.Cubic.Out),
            this.alphaTween(0, 300, Phaser.Math.Easing.Cubic.Out)
        ])
        this.destroy()
    }

    async shake(): Promise<void> {
        let sound = this.scene.sound.add("move_1")
        sound.play()
        return new Promise<void>(resolve => this.scene.tweens.chain({
            targets: this.container,
            onComplete: () => resolve(),
            tweens: [
                {
                    x: -this.shakeOffset,
                    duration: 40,
                    ease: Phaser.Math.Easing.Cubic.InOut
                },
                {
                    x: this.shakeOffset,
                    duration: 40,
                    ease: Phaser.Math.Easing.Cubic.InOut
                },
                {
                    x: -this.shakeOffset,
                    duration: 40,
                    ease: Phaser.Math.Easing.Cubic.InOut
                },
                {
                    x: 0,
                    duration: 40,
                    ease: Phaser.Math.Easing.Cubic.InOut
                }
            ],
        }))
    }

    private async scaleTween(scale: number, duration: number = 200, ease: (i: number) => number = Phaser.Math.Easing.Cubic.Out, delay: number = 0) {
        return new Promise<void>(resolve => this.scene.tweens.add({
            targets: this.container,
            scale: scale,
            delay: delay,
            duration: duration,
            ease: ease,
            onComplete: () => resolve()
        }))
    }

    private async alphaTween(alpha: number, duration: number = 200, ease: (i: number) => number = Phaser.Math.Easing.Cubic.Out, delay: number = 0) {
        return new Promise<void>(resolve => this.scene.tweens.add({
            targets: this.container,
            alpha: alpha,
            delay: delay,
            duration: duration,
            ease: ease,
            onComplete: () => resolve()
        }))
    }

    private async moveYTween(y: number, duration: number = 200, ease: (i: number) => number = Phaser.Math.Easing.Cubic.Out, delay: number = 0) {
        return new Promise<void>(resolve => this.scene.tweens.add({
            targets: this.container,
            y: y,
            delay: delay,
            duration: duration,
            ease: ease,
            onComplete: () => resolve()
        }))
    }

    async pickUp() {
        return new Promise<void>(resolve => this.scene.tweens.add({
            targets: this.container,
            y: -20,
            angle: -5 + Math.random() * 10,
            duration: 200,
            ease: Phaser.Math.Easing.Back.InOut,
            onComplete: () => resolve()
        }))
    }

    async letDown() {
        return new Promise<void>(resolve => this.scene.tweens.add({
            targets: this.container,
            y: 0,
            angle: 0,
            duration: 200,
            ease: Phaser.Math.Easing.Back.InOut,
            onComplete: () => resolve()
        }))
    }
}