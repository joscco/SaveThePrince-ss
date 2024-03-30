import * as Phaser from 'phaser';
import {GAME_HEIGHT, GAME_WIDTH, NUMBER_OF_LEVELS} from "../Game";
import {wait} from "../general/AsyncUtils";
import {GridCalculator} from "../mainScene/GridCalculator";
import {LevelButton} from "../levelChoosingScene/LevelButton";

export class LevelChoosingScene extends Phaser.Scene {

    private levelButtonSelected: boolean = false
    private levelButtons: LevelButton[] = []

    constructor() {
        super('levels');
    }

    preload() {
        this.load.image('levelScene_button', 'assets/images/levelScene/levelButton.png');
    }

    create() {
        let gridCalculator = new GridCalculator(GAME_WIDTH / 2, GAME_HEIGHT / 2, 7, 7, 125, 125)
        for (let row = 0; row < 7; row++) {
            for (let column = 0; column < 7; column++) {
                let level = 1 + row * 7 + column
                if (level <= NUMBER_OF_LEVELS) {
                    let position = gridCalculator.getPositionForIndex({x: column, y: row})
                    let levelButton = new LevelButton(this, position, level)
                    levelButton.once('pointerup', async () => {
                        await this.changeToLevel(level)
                    })
                    this.levelButtons.push(levelButton)
                }
            }
        }

        this.levelButtons.forEach(button => button.blendIn(Math.random() * 300))
    }

    private async changeToLevel(level: number) {
        if (!this.levelButtonSelected) {
            this.levelButtonSelected = true
            await Promise.all(this.levelButtons.map(button => button.blendOut(Math.random() * 300)))
            this.scene.start('main', {level: level})
        }
    }
}
