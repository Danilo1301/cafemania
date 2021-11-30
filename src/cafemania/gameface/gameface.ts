import { BaseObject } from "../baseObject/baseObject";
import { Camera } from "../camera/camera";
import { Debug } from "../debug/debug";
import { Game } from "../game/game";
import { Input } from "../input/input";
import { Network } from "../network/network";
import { GameScene } from "../scenes/gameScene";
import { MainScene } from "../scenes/mainScene";
import { SyncType } from "../world/world";
import { WorldSyncHelper } from "../world/worldSyncHelper";
import { config } from "./config";

enum PreloadState {
    NOT_LOADED,
    LOADING_PHASER,
    LOADING_GAME,
    COMPLETED
}

export class Gameface extends BaseObject {
    public static Instance: Gameface;

    public events = new Phaser.Events.EventEmitter();
    public get game() { return this._game; }
    public get phaser() { return this._phaser; }
    public get network() { return this._network; }

    private _game: Game;
    private _phaser: Phaser.Game;
    private _preloadState: PreloadState = PreloadState.NOT_LOADED;
    private _network: Network;

    constructor() {
        super();
        Gameface.Instance = this;
        this._game = new Game();
        this._network = new Network();
    }

    public start() {
        this.log("start");

        this.events.on("preload_finish", () => {
            this.log('preload_finish');
            this.onReady();
        })
        
        this.preload();
    }

    public update(dt: number) {
        Camera.update(dt);
    }

    private onReady() {
        this.phaser.scene.add('MainScene', MainScene, true);
    }

    public toggleFullscreen() {
        if (this.phaser.scale.isFullscreen) {
            this.phaser.scale.stopFullscreen();
            return;
        }
        this.phaser.scale.startFullscreen({})
    }

    private preload() {
        this.log("preload", this._preloadState)

        if(this._preloadState == PreloadState.NOT_LOADED) {
            this._preloadState = PreloadState.LOADING_PHASER;
            this._phaser = new Phaser.Game(config);
            this._phaser.events.once('ready', () => {
                this.setupResize();
                this.preload();
            });
            return;
        }

        if(this._preloadState == PreloadState.LOADING_PHASER) { 
            this._preloadState = PreloadState.LOADING_GAME;
            this.game.events.once('ready', () => {
                this.preload();
            });
            this.game.start();
            return;
        } 
        
        this._preloadState = PreloadState.COMPLETED;
        this.events.emit("preload_finish");
    }

    private setupResize() {
        const game = this.phaser;
        const scaleManager = game.scale;

        document.body.style.height = "100%";
        document.body.style.background = "#000000";
        game.canvas.style.width = "100%";
        game.canvas.style.height = "100%";
     
        this.events.on('resize', () => {
            const a = window.innerWidth / window.innerHeight;
            const s = 1;

            if(a < 1) scaleManager.setGameSize(600 * s, 900 * s);
            else scaleManager.setGameSize(1000, 600);
        });

        window.addEventListener('resize', () => {
            this.events.emit('resize');

            //fix weird resize bug
            
        })
        this.events.emit('resize');

        setInterval(() => this.events.emit('resize'), 1000)
    }

    public startSinglePlayer() {
        const world = this.game.createWorld();
        world.initBaseWorld();

        GameScene.initScene(world);

        Camera.setZoom(1)
    }

    public startMultiplayer() {
        const world = this.game.createWorld();
        world.canSpawnPlayer = false;
        world.sync = SyncType.SYNC;

        GameScene.initScene(world);
        WorldSyncHelper.setWorld(world);
    }
}