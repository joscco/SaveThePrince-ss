import Text = Phaser.GameObjects.Text;
import {LevelChoosingScene} from "../scenes/LevelChoosingScene";
import {Vector2D} from "../general/MathUtils";
import {Button} from "../general/Button";

export class LevelButton extends Button {
    private readonly text: Text;

    constructor(levelScene: LevelChoosingScene, pos: Vector2D, level: number) {
        super(levelScene, pos, 'levelScene_button');

        this.text = levelScene.add.text(0, 0, '' + level, {
            fontSize: 80,
            color: "0x000000",
            fontFamily: "Londrina"
        })
        this.text.setOrigin(0.5, 0.5)
        this.container.add([this.text])

        this.container.scale = 0
    }
}