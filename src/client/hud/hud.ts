import { BaseObject } from "../../shared/baseObject/baseObject";
import { Debug } from "../../shared/debug/debug";
import { GameScene } from "../scenes/gameScene";
import { Test } from "../test/test";
import { HudContainer } from "./hudContainer";

export class Hud {
    public static scaleMod = {x: 1, y: 1};

    public static mainContainer: HudContainer;
    public static needResize: boolean = true;

    public static init() {
        this.mainContainer = new HudContainer(GameScene.Instance);
        GameScene.Instance.hudContainer.add(this.mainContainer.container);
    }

    public static render(dt: number) {
        if(this.needResize) {
            this.needResize = false;
            this.resize();
        }
    }

    public static resize(sx?: number, sy?: number) {
        Debug.log("Hud", "resize");

        if(sx) this.scaleMod.x = sx;
        if(sy) this.scaleMod.y = sy;

        this.mainContainer.resize();
    }
}