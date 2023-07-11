import * as NineSlicePlugin from 'phaser3-nineslice'
import { config } from "./config";

export class PhaserLoad {
    private static _phaser?: Phaser.Game;

    public static async load() {
        if(this._phaser) return this._phaser;

        const cfg = config;
        cfg.plugins = {
            global: [ NineSlicePlugin.Plugin.DefaultCfg ]
        }

        this._phaser = await new Promise<Phaser.Game>((resolve) => {
            const phaser = new Phaser.Game(cfg);
            phaser.events.once('ready', () => {
                resolve(phaser);
            });
        });

        return this._phaser;
    }
}