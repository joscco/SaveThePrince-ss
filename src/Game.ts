import * as Phaser from 'phaser';
import {Grid} from "./objects/Grid";
import {EntityWiki} from "./objects/EntityWiki";
import {CUT_RICE_MAKI} from "./objects/EntityData";
import GameConfig = Phaser.Types.Core.GameConfig;
import Center = Phaser.Scale.Center;
import {vector2Equals, vector2Sub, vector2Unify} from "./general/MathUtils";
import Pointer = Phaser.Input.Pointer;
import {GridEntity} from "./objects/GridEntity";

export const GAME_HEIGHT = 1080;
export const GAME_WIDTH = 1080;

export class MainGameScene extends Phaser.Scene {
    grid: Grid
    entityWiki: EntityWiki

    entityWaitingForInput: GridEntity
    moving: boolean
    waitingForAim: boolean

    constructor() {
        super('main');
    }

    preload() {
        // general
        this.load.image('field', 'assets/images/available_field.png');
        this.load.image('focus', 'assets/images/focus.png');
        this.load.image('focusFree', 'assets/images/focusFree.png');

        // sushi
        this.load.image('sushi/cutRiceMaki', 'assets/images/entities/sushi/cutRiceMaki.png');
    }

    create() {
        this.grid = new Grid(this, GAME_WIDTH / 2, GAME_HEIGHT / 2, 5, 5)
        this.entityWiki = new EntityWiki(this)
        this.setupFirstLevel()

        this.input.on('pointerup', async (pointer: Pointer) => {
            if (!this.moving) {
                let pointerIndex = this.fieldManager.getClosestFieldIndexTo(pointer)
                if (this.waitingForAim) {
                    await this.fieldManager.blendOutPossibleFieldHints(this.possibleNextIndices.map(([index, _]) => index))
                    if (pointerIndex) {
                        this.waitingForAim = false
                        if (this.possibleNextIndices.some(([index, _]) => vector2Equals(index, pointerIndex))) {
                            // If field is free, just move
                            if (this.isFreeField(pointerIndex)) {
                                this.moving = true
                                await this.moveEntityTo(pointerIndex, this.entityWaitingForInput)
                                this.moving = false
                            } else {
                                // If field is taken, interact
                                let mainEntity = this.entityWaitingForInput
                                let direction = vector2Unify(vector2Sub(pointerIndex, mainEntity.index))
                                let lastIndexBeforePointer = vector2Sub(pointerIndex, direction)
                                this.moving = true
                                await this.moveEntityTo(lastIndexBeforePointer, this.entityWaitingForInput)
                                let otherEntity = this.entities.get(pointerIndex)
                                await this.letInteract(this.entityWaitingForInput, otherEntity)
                                if (this.isFreeField(pointerIndex)) {
                                    await this.moveEntityTo(pointerIndex, this.entityWaitingForInput)
                                }
                                this.moving = false
                            }
                        }
                    }
                } else {
                    if (pointerIndex && !this.isFreeField(pointerIndex)) {
                        // Mark entity and show possible next fields
                        let possibleNextPositions = this.findNextPossibleIndices(pointerIndex)
                        await this.fieldManager.blendInPossibleFieldHints(possibleNextPositions)
                        this.waitingForAim = true
                        this.possibleNextIndices = possibleNextPositions
                        this.entityWaitingForInput = this.entities.get(pointerIndex)
                    }
                }
            }
        })
    }

    private async setupFirstLevel() {
        await this.grid.blendInFields()
        this.grid.initEntityAt({x: 0, y: 0}, CUT_RICE_MAKI)
        this.grid.initEntityAt({x: 3, y: 3}, CUT_RICE_MAKI)
    }
}

const config: GameConfig = {
    type: Phaser.AUTO,
    transparent: true,
    parent: 'game',
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
