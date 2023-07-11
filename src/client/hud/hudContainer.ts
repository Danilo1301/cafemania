import { BaseObject } from "../../shared/baseObject/baseObject";
import { GameScene } from "../scenes/gameScene";
import { Hud } from "./hud";

export enum HORIZONTAL_ALIGN {
    LEFT,
    MIDDLE,
    RIGHT
}

export enum VERTICAL_ALIGN {
    TOP,
    MIDDLE,
    BOTTOM
}

export class HudContainer extends BaseObject {
    public get container() { return this._container; }

    public get position() { return this._position; }
    public get size() { return this._size; }
    public get children() { return this._children; }
    public get isZoneLocked() { return this._zoneLocked; }

    public horizontalAlign = HORIZONTAL_ALIGN.LEFT;
    public verticalAlign = VERTICAL_ALIGN.TOP;
    public keepAspect: boolean = false;
    public name: string = "HudContainer";

    private _scene: Phaser.Scene;
    private _container: Phaser.GameObjects.Container;
    private _background: Phaser.GameObjects.Graphics;
    private _text: Phaser.GameObjects.Text;

    private _position = new Phaser.Math.Vector2();
    private _size = new Phaser.Math.Vector2(100, 100);
    private _children: HudContainer[] = [];

    private _zoneLocked: boolean = false;
    private _destroyed: boolean = false;

    private _parent?: HudContainer;

    constructor(scene: Phaser.Scene) {
        super();

        this._scene = scene;

        this._container = scene.add.container();

        this._background = scene.add.graphics();
        this._text = scene.add.text(0, 0, "TEXT");
        this._text.setFontSize(10);

        this._container.add(this._background);
        this._container.add(this._text);
    }

    public setParent(parent: HudContainer) {
        this._parent = parent;
    }

    public setZoneLocked(locked: boolean) {
        this._zoneLocked = locked;
        this.updateGraphics();
    }

    public addChild(x: number, y: number, width: number, height: number) {
        const child = new HudContainer(this._scene);
        child.position.set(x, y);
        child.size.set(width, height);

        child.setParent(this);

        this._container.add(child.container);

        this._children.push(child);

        Hud.needResize = true;

        return child;
    }

    public updateGraphics() {
        this._background.clear();

        this._text.setText(``);

        if(this._parent) {
            this._background.fillStyle(this.isZoneLocked ? 0xff0000 : 0xffff00, 0.3);
            this._background.fillRect(0, 0, this._size.x, this._size.y);
        }
        
        const bounds = (this.getBounds());
        this._text.setText(`${this.name}\nx: ${bounds.x} y: ${bounds.y} w: ${bounds.width} h: ${bounds.height}`);
    }

    public resize() {
        this.log("resize");

        const scaleManager = this._scene.scale;
    
        const parentWidth = this._parent ? this._parent._size.x : scaleManager.gameSize.width;
        const parentHeight = this._parent ? this._parent._size.y : scaleManager.gameSize.height;

        if(Hud.mainContainer == this) {
            this._size.set(parentWidth, scaleManager.gameSize.height);

            //this._container.setSize(scaleManager.gameSize.width, scaleManager.gameSize.height);
        }
        
        //const f = (Hud.scaleMod.y / Hud.scaleMod.x);
        const scaleMod = {
            x: Hud.scaleMod.x < 1 ? Hud.scaleMod.x : 1,
            y: Hud.scaleMod.y < 1 ? Hud.scaleMod.y : 1
        }

        if(!this.keepAspect) {
            scaleMod.x = 1;
            scaleMod.y = 1;
        }

        //

        const position = {
            x: (this.keepAspect ? (this.position.x * scaleMod.x) : this.position.x),
            y: (this.keepAspect ? (this.position.y * scaleMod.y) : this.position.y)
        }
        const width = this._size.x;
        const height = this._size.y;
        
        //

        if(this.horizontalAlign == HORIZONTAL_ALIGN.RIGHT) {
            position.x += parentWidth - (this.keepAspect ? (width * scaleMod.x) : width);
        }

        if(this.horizontalAlign == HORIZONTAL_ALIGN.MIDDLE) {
            position.x += parentWidth/2 - (this.keepAspect ? (width * scaleMod.x) : width)/2;
        }

        //

        if(this.verticalAlign == VERTICAL_ALIGN.BOTTOM) {
            position.y += parentHeight - (this.keepAspect ? (height * scaleMod.y) : height);
        }

        if(this.verticalAlign == VERTICAL_ALIGN.MIDDLE) {
            position.y += parentHeight/2 - (this.keepAspect ? (height * scaleMod.y) : height)/2;
        }

        //

        this._container.setScale(scaleMod.x, scaleMod.y);
        this._container.setPosition(position.x, position.y);
        //

        this.updateGraphics();

        this._children.map(child => {
            child.resize();
        })
        
        /*
        const scaleManager = this._scene.scale;
        const parentWidth = scaleManager.gameSize.width;
        const parentHeight = scaleManager.gameSize.height;

        const width = 500;
        const height = 500;

        //const realWidth = width * Hud.scaleMod.x;

        const position = this.position;

        this._container.setScale(Hud.scaleMod.x, Hud.scaleMod.y);
        this._container.setPosition(
            position.x - (width * Hud.scaleMod.x)/2,
            position.y
        );
        */
    }

    public getBounds() {
        const hudContainer = GameScene.Instance.hudContainer;
        const container = this.container;

        const hudContainerMat = hudContainer.getWorldTransformMatrix();
        const containerMat = container.getWorldTransformMatrix();

        const rect = new Phaser.Geom.Rectangle(
            containerMat.tx - hudContainerMat.tx,
            containerMat.ty - hudContainerMat.ty,
            this.size.x * containerMat.scaleX,
            this.size.y * containerMat.scaleY
        );

        return rect;
    }

    public isLocked(x: number, y: number) {
        if(!this.isZoneLocked) return false;

        console.log(this.getBounds())

        return this.getBounds().contains(x, y);
    }

    public removeChild(child: HudContainer) {
        if(!this._children.includes(child)) return;
        this._children.splice(this._children.indexOf(child), 1);

        child.destroy();
    }

    public destroy() {
        if(this._destroyed) return;
        this._destroyed = true;

        this._container.destroy();
        this._parent?.removeChild(this);
    }
}