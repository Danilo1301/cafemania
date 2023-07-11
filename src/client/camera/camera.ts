import Phaser from 'phaser';
import { Debug } from '../../shared/debug/debug';
import { Hud } from '../hud/hud';
import { HudLockZone } from '../hud/hudLockZone';
import { Input } from '../input/input';
import { GameScene } from '../scenes/gameScene';

export class Camera {
    public static canMove = true;

    private static _position = new Phaser.Math.Vector2();

    private static _startMovePosition = new Phaser.Math.Vector2();
    private static _startMoveScenePosition = new Phaser.Math.Vector2();
    private static _currentScroll = new Phaser.Math.Vector2();
    //private static _oldMovePosition = new Phaser.Math.Vector2();

    private static _isMoving: boolean = false;

    public static getPosition() {
        return new Phaser.Math.Vector2(this._position.x, this._position.y);
    }

    public static render(dt: number) {
    }

    public static setZoom(zoom: number) {
        GameScene.Instance.cameras.main.setZoom(zoom);
    }

    public static zoomTo(zoom: number) {
        GameScene.Instance.cameras.main.zoomTo(zoom);
    }

    public static setPosition(x: number, y: number) {
        this._position.set(x, y);
    }

    public static init() {
        this.setupMoveEvents();
    }

    public static setupMoveEvents() {
        Input.events.on('begindrag', (pointer) => {
            if(!this.canMove) return;
            if(HudLockZone.isZoneLocked()) return;

            if(this._isMoving) return;

            this._isMoving = true;

            const scene = GameScene.Instance;
            const gameSize = scene.game.scale.gameSize;

            this._startMovePosition.x = pointer.x
            this._startMovePosition.y = pointer.y

            this._startMoveScenePosition.x = scene.cameras.main.scrollX + gameSize.width/2
            this._startMoveScenePosition.y = scene.cameras.main.scrollY + gameSize.height/2

            Debug.log("Camera", "begin drag");
        });

        Input.events.on('enddrag', (pointer) => {
            if(!this._isMoving) return;

            this._isMoving = false;
            Debug.log("Camera", "end drag");
        });

        Input.events.on('pointermove', (pointer) => {
            //if(TileItemDrag.isMovingAnyTileItem) return;
            
            if(!this._isMoving) return;

            //console.log("camera mov")

            const scene = GameScene.Instance;
            const zoom = scene.cameras.main.zoom;

            const delta = new Phaser.Math.Vector2(this._startMovePosition.x - pointer.x, this._startMovePosition.y - pointer.y);

            this._currentScroll.x = Math.round(this._startMoveScenePosition.x + (delta.x / zoom))
            this._currentScroll.y = Math.round(this._startMoveScenePosition.y + (delta.y / zoom))

            this.updateSceneScroll();
        })
    }

    private static updateSceneScroll()
    {
        const currentScroll = this._currentScroll;

        //while((currentScroll.x - (this._mPixelsX.offset || 0)) % this._mPixelsX.interval != 0) currentScroll.x += 1
        //while((currentScroll.y - (this._mPixelsY.offset || 0)) % this._mPixelsY.interval != 0) currentScroll.y += 1

        Camera.setPosition(currentScroll.x, currentScroll.y)
    }
}