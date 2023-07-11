import { DebugText } from "../../client/debugText/debugText";
import { GameScene } from "../../client/scenes/gameScene";
import { BaseObject } from "../baseObject/baseObject";
import { World } from "../world/world";

import { v4 as uuidv4 } from 'uuid';

export interface EntityData {
    id: string
    type: string
    x: number
    y: number
}

export class Entity extends BaseObject {
    public id: string = uuidv4();
    public name: string = "Entity";
    public showDebugText: boolean = true;
    public destroyed = false;

    public get container() { return this._container!; }
    public get position() { return this._position; }
    public get world() { return this._world; }
    public get debugText() { return this._debugText!; }
    public get scene() { return GameScene.Instance; }
    public get isPointerOver() { return this._isPointerOver; }
    public get isPointerDown() { return this._isPointerDown; }

    private _container?: Phaser.GameObjects.Container;
    private _position = new Phaser.Math.Vector2();
    private _world: World;
    private _debugText?: DebugText;
    private _isPointerOver: boolean = false;
    private _isPointerDown: boolean = false;

    constructor(world: World) {
        super();
        this._world = world;

        this.name = this.constructor.name;
    }

    public update(dt: number) {
    }

    public render(dt: number) {
        if(!this._container) {
            const scene = GameScene.Instance;
            const container = this._container = scene.add.container();
        }

        const container = this._container;
        container.setPosition(this.position.x, this.position.y);

        if(!this._debugText) {
            this._debugText = new DebugText(this.scene);
            this._debugText.setLine("!", `${this.name}`);
            //container.add(this._debugText.container);
        }
        if(this._debugText) {
            this._debugText.setEnabled(this.showDebugText);

            if(this.showDebugText) {
                this._debugText.setLine("pointerOver", this.isPointerOver ? `pointerOver` : "");
                this._debugText.setLine("pointerDown", this.isPointerDown ? `pointerDown` : "");
                this._debugText.container.setPosition(this.position.x, this.position.y);
                this._debugText.render(dt);
            }
        }
    }

    public destroy() {
        this.destroyed = true;
        
        if(this._debugText) {
            this._debugText.destroy();
        }

        this.log("destroy");

    }

    public changePointerOverState(pointerOver: boolean) {
        if(pointerOver == this._isPointerOver) return;

        this._isPointerOver = pointerOver;

        if(pointerOver) this.onPointerOver();
        else this.onPointerOut();
    }

    public onPointerOver() {}
    public onPointerOut() {}

    public changePointerDown(pointerDown: boolean) {
        if(pointerDown == this._isPointerDown) return;

        this._isPointerDown = pointerDown;

        if(pointerDown) this.onPointerDown();
        else this.onPointerUp();
    }

    public onPointerDown() {}
    public onPointerUp() {}

    public serialize(): EntityData {
        return {
            id: this.id,
            type: this.constructor.name,
            x: this.position.x,
            y: this.position.y
        }
    }
}