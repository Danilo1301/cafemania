import { BaseObject } from "../baseObject/baseObject";
import { Direction } from "../direction";
import { Tile } from "../entity/tile/tile";
import { Grid } from "../grid/grid";
import { World } from "./world";

export class TileMap extends BaseObject {
    public get tiles() { return this._tiles.values(); }
    public get grid() { return this._grid; }
    public get world() { return this._world; }

    private _tiles = new Phaser.Structs.Map<string, Tile>([]);
    private _grid: Grid;
    private _world: World;
    
    constructor(world: World) {
        super();
        this._grid = new Grid();
        this._world = world;
    }

    public tileExists(x: number, y: number) {
        return this._tiles.has(`${x}:${y}`)
    }

    public addTile(x: number, y: number) {
        const position = Tile.getTilePosition(x, y);

        const tile = new Tile(this.world, x, y);
        this._tiles.set(tile.tileId, tile);
        this._grid.addCell(x, y);

        tile.position.set(position.x, position.y);

        this.world.addEntity(tile);

        return tile;
    }

    public removeTile(x: number, y: number) {
        const key = `${x}:${y}`;
        const tile = this._tiles.get(key);
        this._tiles.delete(key);
        
        this.world.removeEntity(tile);
    }

    public getTile(x: number, y: number) {
        return this._tiles.get(`${x}:${y}`)
    }

    //-----------

    
}