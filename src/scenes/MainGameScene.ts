import {LevelManager} from "../mainScene/LevelManager";
import {LevelConfigWiki} from "../mainScene/LevelConfigWiki";

export type LevelData = { level: number }

export class MainGameScene extends Phaser.Scene {
    level: number
    levelManager: LevelManager
    levelConfigWiki: LevelConfigWiki

    constructor() {
        super('main');
    }

    init(data: LevelData) {
        this.level = data.level
    }

    preload() {
        // general
        this.load.image('field_even', 'assets/images/mainScene/available_field.png');
        this.load.image('field_odd', 'assets/images/mainScene/available_field_2.png');
        this.load.image('focus', 'assets/images/mainScene/focus.png');
        this.load.image('focusFree', 'assets/images/mainScene/focusFree.png');
        this.load.image('focusGray', 'assets/images/mainScene/focusGray.png');
        this.load.image('focusFreeGray', 'assets/images/mainScene/focusFreeGray.png');

        // entities
        this.load.image('entities.castle', 'assets/images/mainScene/entities/castle.png');

        this.load.image('entities.knight', 'assets/images/mainScene/entities/knight.png');

        this.load.image('entities.items.sword', 'assets/images/mainScene/entities/item_sword.png');
        this.load.image('entities.items.meat', 'assets/images/mainScene/entities/item_meat.png');
        this.load.image('entities.items.key', 'assets/images/mainScene/entities/item_key.png');
        this.load.image('entities.items.emptyBucket', 'assets/images/mainScene/entities/item_emptyBucket.png');
        this.load.image('entities.items.fullBucket', 'assets/images/mainScene/entities/item_fullBucket.png');

        this.load.image('entities.queen', 'assets/images/mainScene/entities/queen.png');

        this.load.image('entities.wolf', 'assets/images/mainScene/entities/wolf.png');

        this.load.image('entities.fire', 'assets/images/mainScene/entities/fire.png');
        this.load.image('entities.well', 'assets/images/mainScene/entities/well.png');
        this.load.image('entities.fireplace.withMeat', 'assets/images/mainScene/entities/fireplace_with_meat.png');
        this.load.image('entities.fireplace.withoutMeat', 'assets/images/mainScene/entities/fireplace_without_meat.png');

        this.load.image('entities.swordStone.withSword', 'assets/images/mainScene/entities/sword_stone_filled.png');
        this.load.image('entities.swordStone.withoutSword', 'assets/images/mainScene/entities/sword_stone_empty.png');

        this.load.image('entities.tree', 'assets/images/mainScene/entities/tree.png');

        this.load.audio('move_1', ['assets/sounds/move/move-01.mp3']);
        this.load.audio('move_2', ['assets/sounds/move/move-02.mp3']);
        this.load.audio('move_3', ['assets/sounds/move/move-03.mp3']);
        this.load.audio('move_4', ['assets/sounds/move/move-04.mp3']);
    }

    create() {
        this.levelConfigWiki = new LevelConfigWiki()
        let levelConfig = this.levelConfigWiki.getConfigForLevel(this.level)
        this.levelManager = new LevelManager(this, levelConfig)
        this.levelManager.init()
    }
}