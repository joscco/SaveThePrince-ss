import * as Phaser from 'phaser';
import {GAME_HEIGHT, GAME_WIDTH} from "../Game";
import {wait} from "../general/AsyncUtils";
import {Button} from "../startScene/Button";

export class StartScene extends Phaser.Scene {

    constructor() {
        super('start');
    }

    preload() {
        // general
        this.load.image('startScene_logo', 'assets/images/startScene/logo.png');
        this.load.image('startScene_startButton', 'assets/images/startScene/startButton.png');
        this.load.image('startScene_title', 'assets/images/startScene/title.png');
    }

    create() {
        this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 300, 'startScene_logo')
        this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50, 'startScene_title')
        let startButton = new Button(this, {x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 + 350}, 'startScene_startButton')

        startButton.setInteractive()
        startButton.once('pointerup', async () => {
            await startButton.wiggle()
            this.scene.start('levels')
        })

    }
}
