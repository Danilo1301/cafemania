import * as Phaser from "phaser";
import { Debug } from "../../shared/debug/debug";
import { Camera } from "../camera/camera";
import { Gameface } from "../gameface/gameface";

export class GameScene extends Phaser.Scene {
    public static Instance: GameScene;

    public layerFloor: Phaser.GameObjects.Layer;
    public layerObjects: Phaser.GameObjects.Layer;
    public layerTop: Phaser.GameObjects.Layer;
    public layerHud: Phaser.GameObjects.Layer;

    public hudContainer: Phaser.GameObjects.Container;

    constructor() {
        super({});
        GameScene.Instance = this;
    }

    public create() {
        Debug.log("GameScene", "game scene create");
        
        this.layerFloor = this.add.layer();
        this.layerFloor.setDepth(0);

        this.layerObjects = this.add.layer();
        this.layerObjects.setDepth(100);

        this.layerTop = this.add.layer();
        this.layerTop.setDepth(1000);

        this.layerHud = this.add.layer();
        this.layerHud.setDepth(10000);
        
        this.hudContainer = this.add.container();
        this.layerHud.add(this.hudContainer);
    }
    
    public update(time: number, delta: number) {
        this.updateHudContainer();
        Gameface.Instance.render(delta / 100);
    }

    public updateHudContainer() {
        //Debug.log("GameScene", "updateHudContainer");

        const gameScene = this;
        
        const position = Camera.getPosition();
        const gameSize = gameScene.game.scale.gameSize;
        
        gameScene.cameras.main.setScroll(
            position.x - gameSize.width / 2,
            position.y - gameSize.height / 2
        );

        const zoom = gameScene.cameras.main.zoom;
        const s = 1/zoom;
        //gameScene.hudContainer.setScale(s * this.scaleMod.x, s * this.scaleMod.y);
        gameScene.hudContainer.setScale(s, s);
        gameScene.hudContainer.setPosition(
            gameScene.cameras.main.scrollX - ((s-1)*(gameSize.width/2)),
            gameScene.cameras.main.scrollY - ((s-1)*(gameSize.height/2))
        );
    }
    
    public static drawCircleNumber(text: string, x: number, y: number) {
        const c = GameScene.Instance.add.circle(0, 0, 8, 0x0000ff);
        c.setOrigin(0.5)

        const s = GameScene.Instance.add.text(0, 0, text, {color: "yellow", fontFamily: 'AlfaSlabOne-Regular', fontSize: "10px"});
        //s.setFontStyle('bold')
        s.setOrigin(0.5)
        

        const container = GameScene.Instance.add.container();
        container.add(c);
        container.add(s);
        container.setDepth(100000)
        container.setPosition(x, y);

        return container;
    }
}

