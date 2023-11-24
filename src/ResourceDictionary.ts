import Container = Phaser.GameObjects.Container;
import {ResourceDictionarySlot} from "./ResourceDictionarySlot";
import {Scene} from "phaser";
import {GAME_HEIGHT, GAME_WIDTH} from "./Game";
import {Resource} from "./Resource";

export class ResourceDictionary extends Container {
    slots: ResourceDictionarySlot[] = []

    constructor(scene: Scene, resources: Resource[]) {
        super(scene);

        let bottomCenterPoint = {
            x: GAME_WIDTH / 2,
            y: GAME_HEIGHT
        }

        let maxNumberOfSlots = resources.length

        for (let i = 0; i < maxNumberOfSlots; i++) {
            let x = bottomCenterPoint.x + (i - maxNumberOfSlots/2) * 120
            let y = bottomCenterPoint.y - 100
            this.slots.push(new ResourceDictionarySlot(scene, x, y, resources[i]))
        }
    }

    updateResources(resources: Map<Resource, number>) {
        this.slots.forEach(slot => {
            let value = resources.get(slot.resource) ?? 0
            if (slot.shown) {
                if (value <= 0) {
                    slot.blendOut()
                } else {
                    slot.updateNumber(value)
                }
            } else if (!slot.shown && value > 0) {
                slot.updateNumber(value)
                slot.blendIn()
            }
        })
    }
}