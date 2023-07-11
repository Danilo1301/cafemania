import Phaser from 'phaser';

import { BaseObject } from "../baseObject/baseObject";
import { TileItemFactory } from '../entity/tileItem/tileItemFactory';
import { ClientWorld } from '../world/clientWorld';
import { World } from "../world/world";

export class Game extends BaseObject {
    public get worlds() { return this._worlds; }
    public get tileItemFactory() { return this._tileItemFactory; }

    private _worlds: World[] = [];
    private _tileItemFactory: TileItemFactory;

    constructor() {
        super();
        this._tileItemFactory = new TileItemFactory();
    }

    public init() {
        this.tileItemFactory.init();
    }

    public start() {
    }

    public update(dt: number) {
        this._worlds.map(world => world.update(dt));
    }

    public render(dt: number) {
        //this._worlds.map(world => world.render(dt));
    }

    public createWorld() {
        this.log('create world');

        const world = new World(this);
        this._worlds.push(world);
        return world;
    }

    public findWorld(fn: (world: World) => boolean): World | undefined {
        return this._worlds.filter(fn)[0];
    }

    public createClientWorld() {
        this.log('create client world');

        const world = new ClientWorld(this);
        this._worlds.push(world);
        return world;
    }
}