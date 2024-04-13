import * as Phaser from 'phaser';
import {GAME_HEIGHT, GAME_WIDTH, NUMBER_OF_LEVELS} from "../Game";
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
        let gridCalculator = new GridCalculator(GAME_WIDTH / 2, GAME_HEIGHT / 2, 3, 7, {x: 150, y: 0}, {x: 0, y: 150})
        for (let row = 0; row < 7; row++) {
            for (let column = 0; column < 3; column++) {
                let level = 1 + row * 3 + column
                if (level <= NUMBER_OF_LEVELS) {
                    let index = {x: column, y: row}
                    let position = gridCalculator.getPositionForIndex(index)
                    let levelButton = new LevelButton(this, position, level)
                    levelButton.setScale(0)
                    levelButton.setAlpha(0)
                    levelButton.setInteractive()
                    levelButton.once('pointerup', async () => {
                        await this.changeToLevel(level, levelButton)
                    })
                    this.levelButtons.push(levelButton)
                }
            }
        }

        this.levelButtons.forEach((button, i) => button.blendIn(i * 50))
    }

    private async changeToLevel(level: number, levelButton: LevelButton) {
        if (!this.levelButtonSelected) {
            this.levelButtonSelected = true
            await levelButton.scaleUp()
            await Promise.all(this.levelButtons.map((button, i) => button.blendOut(i * 50)))
            this.scene.start('main', {level: level})
        }
    }
}
