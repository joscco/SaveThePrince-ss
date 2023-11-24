import * as Phaser from 'phaser';
import GameConfig = Phaser.Types.Core.GameConfig;
import {Town} from "./Town";
import {Person} from "./Person";
import {Stone} from "./objects/collectibles/Stone";
import {Stick} from "./objects/collectibles/Stick";

export class MainGameScene extends Phaser.Scene {

    people: Person[] = []

    constructor() {
        super('main');
    }

    preload() {
        this.load.image('field', 'assets/field.png');
        this.load.image('person', 'assets/person.png');
        this.load.image('resource/stick', 'assets/resource_stick.png');
        this.load.image('resource/stone', 'assets/resource_stone.png');
        // UI
        this.load.image('inventory/slot', 'assets/inventory_slot.png');

    }

    create() {
        let town = new Town(this)

        for (let i = 0; i < 50; i++) {
            let person = new Person(this, GAME_WIDTH * Math.random(), GAME_HEIGHT * Math.random())
            this.people.push(person)
            town.addEntity(person)
        }

        // Scatter random trees inside and more on the outside
        for (let i = 0; i < 10; i++) {
            town.addEntity(new Stone(this, Math.random() * GAME_WIDTH, Math.random() * GAME_HEIGHT))
        }
        for (let i = 0; i < 10; i++) {
            town.addEntity(new Stick(this, Math.random() * GAME_WIDTH, Math.random() * GAME_HEIGHT))
        }
    }

    update(time: number, delta: number) {
        for(let person of this.people) {
            person.update()
        }
    }
}

export const GAME_WIDTH = 1920;
export const GAME_HEIGHT = 1080;

const config: GameConfig = {
    type: Phaser.AUTO,
    mode: Phaser.Scale.NONE,
    backgroundColor: '#DDDDDD',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game',
    zoom: 1 / 2,
    scene: MainGameScene
};

const game = new Phaser.Game(config);
