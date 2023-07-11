import { Network } from "../../client/network/network";
import { Debug } from "../debug/debug";

enum AssetType {
    IMAGE,
    AUDIO,
    FONT
}

export class Asset {
    public type: AssetType;
    public key: string;
    public path: string;
    public loaded: boolean = false;

    constructor(type: AssetType, key: string, path: string) {
        this.type = type;
        this.key = key;
        this.path = path;
    }
}

export class AssetManager {
    public static ASSETS_URL = "";

    private static _assets: Asset[] = [];

    public static init() {
        const isLocalHost = location.host.includes('localhost') || location.host.includes(':');
        this.ASSETS_URL = isLocalHost ? `${location.protocol}//${location.host}/assets/` : `${Network.SERVER_ADDRESS}/assets/`;

        Debug.log("AssetManager", `${this.ASSETS_URL}`);
    }

    public static initPreloadAssets() {
        this.addImage('background', 'background.png');
        this.addImage('loading_background', 'loading_background.png');
        this.addImage('sign', 'sign.png');
        this.addFont('gem', 'fonts/gem');
    }
    
    public static initAssets() {
        this.addImage('wallMask', 'wallMask.png');
        this.addImage('tile', 'tile.png');
        this.addImage('tile2', 'tile2.png');
        this.addImage('panel', 'panel.png');
        
        this.addImage('button/panel/gift', 'button/panel/gift.png');
        this.addImage('button/panel/waiter', 'button/panel/waiter.png');
        this.addImage('button/panel/shop', 'button/panel/shop.png');
        this.addImage('button/panel/clothes', 'button/panel/clothes.png');
        this.addImage('button/panel/stove', 'button/panel/stove.png');
        this.addImage('button/panel/counter', 'button/panel/counter.png');
        this.addImage('button/panel/table', 'button/panel/table.png');
        this.addImage('button/panel/none', 'button/panel/none.png');

        this.addImage('button/button1_large', 'button/button1_large.png');
        this.addImage('button/button1', 'button/button1.png');
        this.addImage('button/button_small_green', 'button/button_small_green.png');
        this.addImage('button/button_cook', 'button/button_cook.png');
        this.addImage('button/zoom_in', 'button/zoom_in.png');
        this.addImage('button/zoom_out', 'button/zoom_out.png');
        this.addImage('button/fullscreen', 'button/fullscreen.png');

        this.addImage('button/signin_google', 'button/signin_google.png');
        this.addImage('button/signin_guest', 'button/signin_guest.png');
        this.addImage('button/signout', 'button/signout.png');
        this.addImage('button/play', 'button/play.png');
        
        this.addImage('messagebox/1', 'messagebox/1.png');
        this.addImage('messagebox/1_bottom', 'messagebox/1_bottom.png');
        
        this.addImage('player/eye', 'player/eye.png');
    }

    public static addImage(key: string, path: string) {
        const asset = new Asset(AssetType.IMAGE, key, path);
        this._assets.push(asset);
        return asset;
    }

    public static addFont(key: string, path: string) {
        const asset = new Asset(AssetType.FONT, key, path);
        this._assets.push(asset);
        return asset;
    }

    public static async loadAssets(scene: Phaser.Scene) {
        Debug.log("AssetManager", "loadAssets");

        const assetsToLoad: Asset[] = this._assets.filter(asset => !asset.loaded);

        const loader = scene.load;

        loader.setPath(AssetManager.ASSETS_URL);
        loader.on('filecomplete', function(key, type, data) {
            Debug.log("AssetManager", "file complete");
        });

        for (const asset of assetsToLoad) {
            console.log(asset.key);

            const key = asset.key;
            const url = asset.path;

            if(asset.type == AssetType.IMAGE) loader.image(key, url);
            if(asset.type == AssetType.AUDIO) loader.audio(key, url);
            if(asset.type == AssetType.FONT) loader.bitmapFont(key, `${url}.png`, `${url}.xml`);
        }

        await new Promise<void>((resolve) => {
            loader.once('complete', async () => {
                Debug.log("AssetManager", "complete");
                resolve();
            });
            loader.start();
        });

        for (const asset of assetsToLoad) {
            asset.loaded = true;
        }

        Debug.log("AssetManager", "done");
    }
}