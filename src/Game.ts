import * as Phaser from 'phaser';
import {Grid} from "./objects/Grid";
import {Vector2, vector2Equals} from "./general/MathUtils";
import {GridEntity} from "./objects/GridEntity";
import GameConfig = Phaser.Types.Core.GameConfig;
import Center = Phaser.Scale.Center;
import Pointer = Phaser.Input.Pointer;

export const GAME_HEIGHT = 1080;
export const GAME_WIDTH = 1080;

export class MainGameScene extends Phaser.Scene {
    grid: Grid

    entityWaitingForInput: GridEntity
    moving: boolean
    waitingForNextPosition: boolean
    possibleNextIndices: [Vector2, boolean][]

    constructor() {
        super('main');
    }

    preload() {
        // general
        this.load.image('field', 'assets/images/available_field.png');
        this.load.image('focus', 'assets/images/focus.png');
        this.load.image('focusFree', 'assets/images/focusFree.png');

        // entities
        this.load.image('entities.castle', 'assets/images/entities/castle.png');
        this.load.image('entities.knight.head', 'assets/images/entities/knightHead.png');
        this.load.image('entities.knight.body', 'assets/images/entities/knightBody.png');

        this.load.image('entities.princess.fearfulHead', 'assets/images/entities/fearfulPrincessHead.png');
        this.load.image('entities.princess.body', 'assets/images/entities/princessBody.png');

        this.load.image('entities.tree', 'assets/images/entities/tree.png');
    }

    create() {
        this.grid = new Grid(this, GAME_WIDTH / 2, GAME_HEIGHT / 2, 7, 7)
        this.setupFirstLevel()

        this.input.on('pointerup', async (pointer: Pointer) => {
            if (!this.moving) {
                if (this.waitingForNextPosition) {
                    let pointerIndex = this.grid.getClosestFieldIndexTo(pointer)
                    await this.grid.blendOutPossibleFieldHints(this.possibleNextIndices.map(([index, _]) => index))
                    if (pointerIndex) {
                        this.waitingForNextPosition = false
                        if (this.possibleNextIndices.some(([index, _]) => vector2Equals(index, pointerIndex))) {
                            // If field is free, just move
                            if (this.grid.isFreeField(pointerIndex)) {
                                this.moving = true
                                await this.grid.moveEntityTo(this.entityWaitingForInput, pointerIndex)
                                this.moving = false
                            } else {
                                // If field is taken, interact
                                this.moving = true
                                await this.grid.moveEntityAndInteractWithField(this.entityWaitingForInput, pointerIndex)
                                this.moving = false
                            }
                        }
                    }
                } else {
                    let pointerIndex = this.grid.getClosestFieldIndexTo(pointer)
                    if (pointerIndex && !this.grid.isFreeField(pointerIndex)) {
                        // Mark entity and show possible next fields
                        let entity = this.grid.getEntityAt(pointerIndex)
                        if (!entity.movable) {
                            // Entity cannot move
                            entity.shake()
                            return
                        }

                        this.entityWaitingForInput = entity
                        let possibleNextPositions = this.grid.findNextPossibleIndices(pointerIndex)
                        await this.grid.blendInPossibleFieldHints(possibleNextPositions)
                        this.waitingForNextPosition = true
                        this.possibleNextIndices = possibleNextPositions

                    }
                }
            }
        })
    }

    private async setupFirstLevel() {
        await this.grid.blendInFields()

        this.grid.initEntityAt({x: 0, y: 3}, "castle", false).blendIn()
        this.grid.initEntityAt({x: 1, y: 3}, "knight", true).blendIn(300)

        this.grid.initEntityAt({x: 4, y: 3}, "princess", true).blendIn(50)

        this.grid.initEntityAt({x: 3, y: 2}, "tree", false).blendIn(100)
        this.grid.initEntityAt({x: 3, y: 3}, "tree", false).blendIn(150)
        this.grid.initEntityAt({x: 3, y: 4}, "tree", false).blendIn(200)
        this.grid.initEntityAt({x: 4, y: 2}, "tree", false).blendIn(250)
        this.grid.initEntityAt({x: 4, y: 4}, "tree", false).blendIn(300)
        this.grid.initEntityAt({x: 5, y: 2}, "tree", false).blendIn(350)
        this.grid.initEntityAt({x: 5, y: 4}, "tree", false).blendIn(400)
    }
}

const config: GameConfig = {
    type: Phaser.AUTO,
    transparent: true,
    parent: 'game',
    roundPixels: false,
    scale: {
        mode: Phaser.Scale.FIT,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        autoCenter: Center.CENTER_BOTH,
        min: {
            width: GAME_WIDTH / 2,
            height: GAME_HEIGHT / 2
        },
        max: {
            width: GAME_WIDTH,
            height: GAME_HEIGHT
        }
    },
    scene: MainGameScene,
};

const game = new Phaser.Game(config);
