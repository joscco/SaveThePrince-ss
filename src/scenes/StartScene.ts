import * as Phaser from 'phaser';
import {GAME_HEIGHT, GAME_WIDTH} from "../Game";
import {Button} from "../general/Button";
import {ScalableImage} from "../mainScene/ScalableImage";

export class StartScene extends Phaser.Scene {
    private logo: ScalableImage;
    private title: ScalableImage;
    private startButton: Button;

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
        this.logo = new ScalableImage(this, {x:GAME_WIDTH / 2, y: GAME_HEIGHT / 2 - 300}, 'startScene_logo')
        this.logo.setScale(0)
        this.logo.setAlpha(0)
        this.title = new ScalableImage(this, {x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 + 50}, 'startScene_title')
        this.title.setScale(0)
        this.title.setAlpha(0)
        this.startButton = new Button(this, {x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 + 350}, 'startScene_startButton')
        this.startButton.setScale(0)
        this.startButton.setAlpha(0)

        this.startButton.setInteractive()
        this.startButton.once('pointerup', async () => {
            await this.startButton.scaleUp()
            await this.blendOutAll()
            this.scene.start('levels')
        })

        this.blendInAll()
    }

    private async blendInAll() {
        await this.title.blendIn()
        await this.logo.blendIn()
        await this.startButton.blendIn()
    }

    private async blendOutAll() {
        await this.startButton.blendOut()
        await this.logo.blendOut()
        await this.title.blendOut()
    }
}
