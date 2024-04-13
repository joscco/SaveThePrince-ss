import {LevelConfig} from "./LevelManager";

const ConfigLevel_1: LevelConfig = {
    level: 1,
    columns: 7,
    rows: 7,
    entities: [
        {id: "knight", x: 2, y: 1, movable: true, blendInAt: 100},
        {id: "castle", x: 2, y: 0, movable: false, blendInAt: 0},
        {id: "tree", x: 1, y: 3, movable: false, blendInAt: 150},
        {id: "tree", x: 2, y: 3, movable: false, blendInAt: 200},
        {id: "tree", x: 3, y: 3, movable: false, blendInAt: 250},
        {id: "tree", x: 1, y: 4, movable: false, blendInAt: 300},
        {id: "tree", x: 3, y: 4, movable: false, blendInAt: 350},
        {id: "princess", x: 2, y: 4, movable: false, blendInAt: 400},
        {id: "tree", x: 1, y: 5, movable: false, blendInAt: 450},
        {id: "tree", x: 3, y: 5, movable: false, blendInAt: 500}
    ]
}

const ConfigLevel_2: LevelConfig = {
    level: 1,
    columns: 7,
    rows: 7,
    entities: []
}

export class LevelConfigWiki {

    getConfigForLevel(level: number): LevelConfig {
        switch (level) {
            case 1:
                return ConfigLevel_1
            case 2:
                return ConfigLevel_2
        }
    }
}