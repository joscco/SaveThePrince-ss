import {Grid} from "../objects/Grid";
import {WinScreen} from "../objects/WinScreen";
import {GridEntity} from "../objects/GridEntity";
import {Vector2} from "../general/MathUtils";
import {GAME_HEIGHT, GAME_WIDTH} from "../Game";
import Pointer = Phaser.Input.Pointer;

export class MainGameScene extends Phaser.Scene {
    grid: Grid
    winScreen: WinScreen

    levelResolved: boolean = false
    moving: boolean = false
    waitingForNextPosition: boolean = false
    entityWaitingForInput: GridEntity = undefined

    constructor() {
        super('main');
    }

    preload() {
        // general
        this.load.image('field_even', 'assets/images/mainScene/available_field.png');
        this.load.image('field_odd', 'assets/images/mainScene/available_field_2.png');
        this.load.image('focus', 'assets/images/mainScene/focus.png');
        this.load.image('focusFree', 'assets/images/mainScene/focusFree.png');

        // entities
        this.load.image('entities.castle', 'assets/images/mainScene/entities/castle.png');

        this.load.image('entities.knight.head', 'assets/images/mainScene/entities/knightHead_normal.png');
        this.load.image('entities.knight.deadHead', 'assets/images/mainScene/entities/knightHead_dead.png');
        this.load.image('entities.knight.body', 'assets/images/mainScene/entities/knightBody.png');
        this.load.image('entities.hand', 'assets/images/mainScene/entities/hand.png');

        this.load.image('entities.items.sword', 'assets/images/mainScene/entities/item_sword.png');

        this.load.image('entities.princess.fearfulHead', 'assets/images/mainScene/entities/princessHead_fearful.png');
        this.load.image('entities.princess.happyHead', 'assets/images/mainScene/entities/princessHead_happy.png');
        this.load.image('entities.princess.body', 'assets/images/mainScene/entities/princessBody.png');

        this.load.image('entities.wolf.angryHead', 'assets/images/mainScene/entities/wolfHead_angry.png');
        this.load.image('entities.wolf.happyHead', 'assets/images/mainScene/entities/wolfHead_happy.png');
        this.load.image('entities.wolf.body', 'assets/images/mainScene/entities/wolfBody.png');

        this.load.image('entities.swordStone.withSword', 'assets/images/mainScene/entities/swordStone_withSword.png');
        this.load.image('entities.swordStone.withoutSword', 'assets/images/mainScene/entities/swordStone_withoutSword.png');

        this.load.image('entities.tree', 'assets/images/mainScene/entities/tree.png');
    }

    create() {
        this.grid = new Grid(this, GAME_WIDTH / 2, GAME_HEIGHT / 2, 8, 7)
        this.winScreen = new WinScreen(this, GAME_WIDTH / 2, GAME_HEIGHT / 2)
        this.setupFirstLevel()
        //this.setupSecondLevel()

        this.input.on('pointerup', async (pointer: Pointer) => {
            if (!this.moving && !this.levelResolved) {
                if (this.waitingForNextPosition) {
                    let pointerIndex = this.grid.getClosestFieldIndexTo(pointer)
                    if (pointerIndex) {
                        this.waitingForNextPosition = false
                        await this.grid.blendOutFieldAllHints()

                        // If field is free, just move
                        if (this.grid.isFreeField(pointerIndex)) {
                            let path = this.grid.findPath(this.entityWaitingForInput.index, pointerIndex, true)
                            if (path) {
                                this.moving = true
                                await this.grid.blendInPathHints(path)

                                await Promise.all([
                                    this.grid.moveEntityAlongPath(this.entityWaitingForInput, path),
                                    this.grid.blendOutPathHints(path)
                                ])

                                this.moving = false
                            }
                        } else {
                            // If field is taken, interact
                            let path = this.grid.findPath(this.entityWaitingForInput.index, pointerIndex, false)
                            let controlledEntity = this.entityWaitingForInput
                            let otherEntity = this.grid.getEntityAt(pointerIndex)
                            let canInteract = this.grid.canInteractWithField(controlledEntity, otherEntity)
                            if (path && canInteract) {
                                this.moving = true
                                await this.grid.blendInPathHints(path)
                                await Promise.all([
                                    this.grid.moveEntityAndInteractWithField(controlledEntity, otherEntity, path),
                                    this.grid.blendOutPathHints(path)
                                ])
                                this.moving = false
                            } else {
                                await Promise.all([controlledEntity.shake(), otherEntity.shake()])

                            }
                        }

                        await this.grid.checkNeighbors()
                    }
                } else {
                    let pointerIndex = this.grid.getClosestFieldIndexTo(pointer)
                    if (pointerIndex && !this.grid.isFreeField(pointerIndex)) {
                        // Mark entity and show possible next fields
                        let entity = this.grid.getEntityAt(pointerIndex)
                        if (!entity.movable) {
                            // Entity cannot move
                            await entity.shake()
                            return
                        }

                        this.entityWaitingForInput = entity
                        await this.grid.blendInFieldHints(entity.index)
                        this.waitingForNextPosition = true
                    }
                }
            }
        })
    }

    private async setupFirstLevel() {
        await this.grid.blendInFields()

        this.grid.initEntityAt({x: 0, y: 3}, "castle", false).blendIn()
        this.grid.initEntityAt({x: 1, y: 3}, "knight", true).blendIn(300)

        this.grid.initEntityAt({x: 4, y: 3}, "princess", false).blendIn(50)

        this.grid.initEntityAt({x: 3, y: 2}, "tree", false).blendIn(100)
        this.grid.initEntityAt({x: 3, y: 3}, "tree", false).blendIn(150)
        this.grid.initEntityAt({x: 3, y: 4}, "tree", false).blendIn(200)
        this.grid.initEntityAt({x: 4, y: 2}, "tree", false).blendIn(250)
        this.grid.initEntityAt({x: 4, y: 4}, "tree", false).blendIn(300)
        this.grid.initEntityAt({x: 5, y: 2}, "tree", false).blendIn(350)
        this.grid.initEntityAt({x: 5, y: 4}, "tree", false).blendIn(400)

        this.grid.initEntityAt({x: 5, y: 5}, "wolf", false).blendIn(400)
        this.grid.initEntityAt({x: 2, y: 5}, "swordStone", false).blendIn(400)
    }

    private async setupSecondLevel() {
        await this.grid.blendInFields()

        this.grid.initEntityAt({x: 0, y: 3}, "castle", false).blendIn()
        this.grid.initEntityAt({x: 1, y: 3}, "knight", true).blendIn(300)

        this.grid.initEntityAt({x: 6, y: 3}, "princess", false).blendIn(50)

        //this.grid.initEntityAt({x: 5, y: 3}, "wolf", false).blendIn(400)
        this.grid.initEntityAt({x: 3, y: 1}, "swordStone", false).blendIn(400)
    }

    async resolveLevel() {
        this.levelResolved = true
        await this.winScreen.blendIn()
    }

    removeEntityAt(index: Vector2) {
        this.grid.removeEntityAt(index)
    }
}