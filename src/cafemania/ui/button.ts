import { Input } from "../input/input";
import { EventRegister } from "../utils/eventRegister";

export class Button {
    public onClick?: () => void;
    public onPointerOver?: () => void;
    public onPointerOut?: () => void;
    public onBeginDrag?: () => void;
    public get container() { return this._container!; }
    
    private _container?: Phaser.GameObjects.Container;
    private _backgrond?: Phaser.GameObjects.Image;
    private _text?: Phaser.GameObjects.BitmapText;

    private _width: number;
    private _height: number;

    private _eventRegister: EventRegister;

    private _isPointerOver: boolean = false;
    
    constructor(scene: Phaser.Scene, text: string, x: number, y: number, width: number, height: number, texture: string) {
        this._width = width;
        this._height = height;

        this._eventRegister = new EventRegister(this);
        this._eventRegister.addListener(Input.events, "begindrag", this.onBeginDragEv.bind(this));

        const container = this._container = scene.add.container();

        /*
        const background = this._backgrond = scene.add.nineslice(0, 0, width, height, texture, offset).setOrigin(0.5);
        background.setInteractive();
        container.add(background);
        */

        const background = this._backgrond = scene.add.image(0, 0, texture);
        background.setDisplaySize(width, height)
        background.setInteractive();
        container.add(background);

        const textgo = this._text = scene.add.bitmapText(0, 0, 'gem', text, 18);
        //text3.setFontSize(12);
        //text3.setStroke("#55330D", 10)
        textgo.setOrigin(0.5);
        container.add(textgo);

        const self = this;
        const pointerOverScale = 1.05;
    
        background.on('pointerover',function(pointer){
            self.setScale(pointerOverScale, pointerOverScale);
            textgo.setScale(pointerOverScale);

            self.onPointerOver?.();
            self._isPointerOver = true;
        })

        background.on('pointerout',function(pointer){
            self.setScale(1, 1);
            textgo.setScale(1);

            self.onPointerOut?.();
            self._isPointerOver = false;
        })


        background.on('pointerup',function(pointer){
            self.onClick?.();
            Input.simulatePointerUp(pointer);
        })
        
        container.setPosition(x, y);

        container.once("destroy", () => {
            this.onDestroy();
        })
    }

    private onBeginDragEv() {
        if(!this._isPointerOver) return;
        
        this.onBeginDrag?.();
    }

    public setScale(sx: number, sy: number) {
        this._backgrond?.setDisplaySize(this._width * sx, this._height * sy)
    }

    public destroy() {
        this._backgrond?.destroy();
        this._text?.destroy();
        this._container?.destroy();

        this.onDestroy();
    }

    private onDestroy() {
        this._backgrond = undefined;
        this._text = undefined;
        this._container = undefined;

        this._eventRegister.removeAllListeners();
    }
}