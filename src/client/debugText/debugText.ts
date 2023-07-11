import { BaseObject } from "../../shared/baseObject/baseObject";

export class DebugText extends BaseObject {
    private _enabled: boolean = true;

    public get container() { return this._container!; }
    public get scene() { return this._scene; }

    private _container?: Phaser.GameObjects.Container;
    private _scene: Phaser.Scene;
    private _lines: {[key: string]: string} = {};

    private _textGameObject?: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {
        super();
        this._scene = scene;

        this.createContainer();
    }

    public setLine(key: string, text: string) {
        this._lines[key] = text;
    }
    
    public render(dt: number) {
        if(!this._enabled) return;

        this.createContainer();

        let text = "";

        for (const key in this._lines) {
            let str = this._lines[key];
            if(str.length == 0) continue;
            text += `${str}\n`;
        }

        this._textGameObject?.setText(text);
    }

    public setEnabled(enabled: boolean) {
        
        if(this._enabled == enabled) return;
        this._enabled = enabled;

        if(!enabled) this.destroy();
        else this.createContainer();
        
    }

    public createContainer() {
        if(this._container) return;

        const scene = this.scene;

        this._container = scene.add.container();
        this._textGameObject = scene.add.text(0, 0, "DebugText");
        this._textGameObject.setColor("blue");
        this._textGameObject.setFontSize(10);

        this._container.add(this._textGameObject);
        this._container.setDepth(10000);
    }

    public destroy() {
        this._textGameObject?.destroy();
        this._container?.destroy();
    }
}