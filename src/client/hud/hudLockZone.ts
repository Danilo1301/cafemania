import { Input } from "../input/input";
import { Hud } from "./hud";
import { HudContainer } from "./hudContainer";

export class HudLockZone {
    //public static drawLockedZones: boolean = true;

    //private static _lockedRects = new Map<string, Phaser.Geom.Rectangle>();
    //private static _lockedRectsVisual = new Map<string, Phaser.GameObjects.Graphics>();
    //private static _lockedZones: string[] = [];

    public static render(dt: number) {
        window['HudLockZone'] = HudLockZone;

        //this._lockedZones = [];

        /*
        const mousePos = Input.mousePosition;
    
        for (const id of this._lockedRects.keys()) {
            const rect = this._lockedRects.get(id)!;
            
            if(rect.contains(mousePos.x, mousePos.y)) {
                this._lockedZones.push(id);
            }

        }
        */
    }

    /*
    public static addLockZone(id: string, x: number, y: number, width: number, height: number) {
        const rectangle = new Phaser.Geom.Rectangle(x, y, width, height);

        this._lockedRects.set(id, rectangle);

        if(this.drawLockedZones) {
            const scene = GameScene.Instance;
            const graphics = scene.add.graphics();
            graphics.fillStyle(0xff0000, 0.2);
            graphics.fillRect(0, 0, width, height);
            graphics.setPosition(x, y);
            scene.hudContainer.add(graphics);

            this._lockedRectsVisual.set(id, graphics);
        }
    }
    */

    /*
    public static removeLockZone(id: string) {
        this._lockedRects.delete(id);

        this._lockedRectsVisual.get(id)?.destroy();
        this._lockedRectsVisual.delete(id);
    }
    */

    public static isZoneLocked() {
        const mousePos = Input.mousePosition;
    
        const testChild = (child: HudContainer) => {
            if(child.isLocked(mousePos.x, mousePos.y)) return true;

            for (const c of Hud.mainContainer.children) {
                if(c.isLocked(mousePos.x, mousePos.y)) return true;
            }

            return false;
        }

        return testChild(Hud.mainContainer);
    }
}