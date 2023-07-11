import { Debug } from "../../shared/debug/debug";
import { Cell } from "../../shared/grid/cell";
import { Item } from "../../shared/grid/item";
import { World } from "../../shared/world/world";
import { Hud } from "../hud/hud";
import { HORIZONTAL_ALIGN, VERTICAL_ALIGN } from "../hud/hudContainer";
import { GameScene } from "../scenes/gameScene";

export class Test {
    public static testHud1(x: number, y: number) {
        Debug.log("test", "testHud");

        const container = Hud.mainContainer.addChild(x, y, 200, 50);
        container.name = "TestHud1";
        container.horizontalAlign = HORIZONTAL_ALIGN.RIGHT;
        container.verticalAlign = VERTICAL_ALIGN.TOP;
        container.keepAspect = true;
        container.setZoneLocked(true);

        return container;
    }

    public static testGrid(world: World, x: number, y: number) {
        const container = Hud.mainContainer.addChild(x, y, 200, 200);
        container.name = "Grid";
        container.horizontalAlign = HORIZONTAL_ALIGN.RIGHT;
        container.verticalAlign = VERTICAL_ALIGN.TOP;
        container.keepAspect = true;
        container.setZoneLocked(true);

        const scene = GameScene.Instance;
        const graphics = scene.add.graphics();
        const grid = world.tileMap.grid;

        container.container.add(graphics);

        setInterval(() => {
            graphics.clear();

            if(!grid) return;

            grid.getCells().map(cell => {

                const fillRect = (color: number, alpha: number) => {
                    const s = 5;
                    graphics.fillStyle(color, alpha);
                    graphics.fillRect(20 + cell.x * (s + 1), 40 + (cell.y * (s + 1)), s, s);
                }

                fillRect(0xffffff, 1);

                for (const item of cell.ocuppiedByItems)
                {
                    if(item.color == 0) {
                        fillRect(0x9f9f9f, 0.3);
                    }
                }

                for (const item of cell.ocuppiedByItems)
                {
                    if(item.color != 0) {
                        fillRect(0x0000ff, 0.3);
                    }
                }
            })
        }, 300)
    }
}