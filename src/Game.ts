import * as Phaser from 'phaser';
import {StartScene} from "./scenes/StartScene";
import GameConfig = Phaser.Types.Core.GameConfig;
import Center = Phaser.Scale.Center;
import {MainGameScene} from "./scenes/MainGameScene";
import {LevelChoosingScene} from "./scenes/LevelChoosingScene";

export const GAME_HEIGHT = 1080;
export const GAME_WIDTH = 1080;
export const NUMBER_OF_LEVELS = 1;


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
    scene: [StartScene, LevelChoosingScene, MainGameScene],
};

new Phaser.Game(config);
