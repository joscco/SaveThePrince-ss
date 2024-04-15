import {LevelConfig} from "./LevelManager";

const ConfigLevel_1: LevelConfig = {
    level: 1,
    columns: 7,
    rows: 3,
    entities: [
        {id: "knight", x: 1, y: 1, movable: true, blendInAt: 100},
        {id: "castle", x: 0, y: 1, movable: false, blendInAt: 0},
        {id: "tree", x: 4, y: 0, movable: false, blendInAt: 150},
        {id: "tree", x: 4, y: 1, movable: false, blendInAt: 200},
        {id: "tree", x: 5, y: 0, movable: false, blendInAt: 250},
        {id: "princess", x: 5, y: 1, movable: false, blendInAt: 300},
        {id: "tree", x: 6, y: 0, movable: false, blendInAt: 350},
        {id: "tree", x: 6, y: 1, movable: false, blendInAt: 400},
        {id: "tree", x: 6, y: 2, movable: false, blendInAt: 450},
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