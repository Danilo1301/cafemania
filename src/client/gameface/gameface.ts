import { AssetManager } from "../../shared/assetManager/assetManager";
import { BaseObject } from "../../shared/baseObject/baseObject";
import { Game } from "../../shared/game/game";
import { World } from "../../shared/world/world";
import { Camera } from "../camera/camera";
import { Hud } from "../hud/hud";
import { HudLockZone } from "../hud/hudLockZone";
import { Input } from "../input/input";
import { Network } from "../network/network";
import { PacketData_JoinServer, PacketData_JoinServerStatus, PacketData_JoinWorld, PacketData_JoinWorldStatus, PacketData_ServerList, PacketData_Test, PacketType } from "../network/packet";
import { GameScene } from "../scenes/gameScene";
import { Test } from "../test/test";
import { PhaserLoad } from "./phaserLoad";

export class Gameface extends BaseObject {
    public static Instance: Gameface;

    public events = new Phaser.Events.EventEmitter();
    public get phaser() { return this._phaser; }
    public get game() { return this._game; }
    public get network() { return this._network; }
    public get world() { return this._world; }

    private _phaser: Phaser.Game;
    private _game: Game;
    private _network: Network;
    private _world?: World;

    constructor() {
        super();
        Gameface.Instance = this;

        this._game = new Game();
        this._network = new Network();
    }

    public async start() {
        this.log("start");

        this._phaser = await PhaserLoad.load();
        this.setupResize();

        this.log("start GameScene");

        this.startScene(GameScene);

        Input.addScene(GameScene.Instance);
        Camera.init();
        Hud.init();
        this.game.init();

        this.startInvervalUpdate();
        
        this.log("loading assets");

        AssetManager.init();
        AssetManager.initPreloadAssets();
        AssetManager.initAssets();
        this.game.tileItemFactory.addAssetsToLoad();

        //

        //

        await AssetManager.loadAssets(GameScene.Instance);

        this.log("assets loaded");

        this.game.start();

        //Test.testGrid(world, 0, 0);
        
        
        this.network.init();
        window['network'] = this.network;

        this.network.connect((connected) => {
            this.log(`network connected`, connected);
        });

        this.network.packetManager.addListener<PacketData_ServerList>(PacketType.SERVER_LIST, (data) => {
            this.log("servers", data.servers);

            this.network.send<PacketData_JoinServer>(PacketType.JOIN_SERVER, {id: data.servers[0].id});
        });

        this.network.packetManager.addListener<PacketData_JoinServerStatus>(PacketType.JOIN_SERVER_STATUS, (data) => {
            this.log("worlds", data.worlds);

            const enterWorld = window["enterWorld"] = (world: number) => {
                this.network.send<PacketData_JoinWorld>(PacketType.JOIN_WORLD, {id: data.worlds![world]});
            }

            enterWorld(0);
        });

        this.network.packetManager.addListener<PacketData_JoinWorldStatus>(PacketType.JOIN_WORLD_STATUS, (data) => {
            this.log("JOIN_WORLD_STATUS", data);

            if(this._world) this.removeWorld();
            this.startClientWorld();

            window["playerid"] = data.playerId;
        });

        GameScene.drawCircleNumber("center", 0, 0);

        
        Test.testHud1(0, 200);
    }

    public startClientWorld() {
        const world = this.game.createClientWorld();
        window['world'] = world;

        this.setWorld(world);
    }

    public update(dt: number) {
        this.game.update(dt);
    }

    public render(dt: number) {
        Camera.render(dt);
        Hud.render(dt);
        HudLockZone.render(dt);

        this.game.render(dt);

        if(this._world) this._world.render(dt);
    }

    public setWorld(world: World) {
        this._world = world;
    }

    public removeWorld() {
        if(this._world) this._world.destroy();
        this._world = undefined;
    }

    private startInvervalUpdate() {
        var self = this;
        var lastUpdate = Date.now();
        var myInterval = setInterval(tick, 1);
        function tick() {
            var now = Date.now();
            var dt = now - lastUpdate;
            lastUpdate = now;
        
            if(dt == 0) dt = 0.01;
            if(dt > 30) dt = 30;

            self.update(dt / 100);
        }
    }

    private setupResize() {
        this.log("setupResize");

        const game = this.phaser;
        game.canvas.style.width = "100%";
        game.canvas.style.height = "100%";

        document.body.style.height = "100%";
        document.body.style.background = "#000000";
     
        const scaleManager = game.scale;
        scaleManager.on('resize', (gameSize, baseSize, displaySize, resolution) => this.resize());

        window.addEventListener('resize', () => {
            const a = window.innerWidth / window.innerHeight;
            const s = 1;

            this.log("window resize");
        })
    }

    public setResolution(width: number, height: number) {
        this.log(`set resolution ${width}, ${height}`);

        const game = this.phaser;
        const scaleManager = game.scale;
        scaleManager.setGameSize(width, height);

        Hud.resize();
    }

    private resize() {
        this.log("resize");

        const game = this.phaser;
        const scaleManager = game.scale;

        const width = scaleManager.gameSize.width;
        const height = scaleManager.gameSize.height;

        Hud.resize(width / window.innerWidth, height / window.innerHeight);
    }

    public startScene(scene: typeof Phaser.Scene) {
        const phaser = this.phaser;
        const key = scene.name;

        if(this.hasSceneStarted(scene)) {
            this.removeScene(scene);
        }

        const s = this.phaser.scene.add(key, scene, true);
        return s;
    }

    public removeScene(scene: typeof Phaser.Scene) {
        const phaser = this.phaser;
        const key = scene.name;

        console.log("removeScene", key, scene)

        if(this.hasSceneStarted(scene)) {
            const s = phaser.scene.keys[key];
            s.scene.remove();
        }
    }

    public hasSceneStarted(scene: typeof Phaser.Scene) {
        const phaser = this.phaser;
        return phaser.scene.keys[scene.name];
    }
}