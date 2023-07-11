
import { Direction } from "../../direction";
import { TileMap } from "../../world/tileMap";
import { World } from "../../world/world";
import { Entity } from "../entity";
import { TileItem, TileItemData } from "../tileItem/tileItem";

export interface TileData {
    x: number
    y: number
    tileItems: TileItemData[]
}

export class Tile extends Entity {
    public static SIZE = new Phaser.Math.Vector2(170, 85);

    public isSidewalk: boolean = false;

    public get tileId() { return `${this.x}:${this.y}`; }
    public get tileMap() { return this.world.tileMap; }
    public get tileItems() { return this._tileItems; }

    public readonly x: number;
    public readonly y: number;

    private _tileItems: TileItem[] = [];

    constructor(world: World, x: number, y: number) {
        super(world);

        this.x = x;
        this.y = y;

        this.showDebugText = true;
    }

    public update(dt: number) {
        super.update(dt);
    }

    public render(dt: number) {
        super.render(dt);
    }

    public destroy(): void {
        super.destroy();

        this.tileItems.map(tileItem => tileItem.destroy());
    }

    public addTileItem(tileItem: TileItem) {
        this._tileItems.push(tileItem);
        tileItem.setTile(this);
    }

    public getTileItem(id: string): TileItem | undefined {
        const ts = this._tileItems.filter(tileItem => tileItem.id == id);
        if(ts.length > 0) return ts[0];
        return
    }

    //-------------

    public static getTilePosition(x: number, y: number) {
        const sx = (Tile.SIZE.x / 2) - 1
        const sy = (Tile.SIZE.y / 2) - 0.5

        return new Phaser.Math.Vector2(
            (x * sx) - (y * sx),
            (y * sy) + (x * sy)
        )
    }

    public static getTileGridBounds(sizex: number, sizey: number)
    {
        const rect = new Phaser.Geom.Rectangle()

        const tileAtTop = Tile.getTilePosition(0, 0)
        const tileAtLeft = Tile.getTilePosition(0, (sizey-1))
        const tileAtRight = Tile.getTilePosition((sizex-1), 0)
        const tileAtBottom = Tile.getTilePosition((sizex-1), (sizey-1))

        rect.top = tileAtTop.y

        rect.left = tileAtLeft.x
        rect.right = tileAtRight.x + (Tile.SIZE.x - 1)

        rect.bottom = tileAtBottom.y + (Tile.SIZE.y - 1)

        return rect
    }

    public static getOffsetFromDirection(direction: Direction)
    {
        interface IOption
        {
            x: number
            y: number
        }

        const options = new Map<Direction, IOption>()

        options.set(Direction.NORTH, {x: 0, y: -1})
        options.set(Direction.SOUTH, {x: 0, y: 1})
        options.set(Direction.EAST, {x: 1, y: 0})
        options.set(Direction.WEST, {x: -1, y: 0})

        options.set(Direction.SOUTH_EAST, {x: 1, y: 1})
        options.set(Direction.NORTH_WEST, {x: -1, y: -1})
        options.set(Direction.NORTH_EAST, {x: 1, y: -1})
        options.set(Direction.SOUTH_WEST, {x: -1, y: 1})

        return options.get(direction)!
    }

    public static getDirectionFromOffset(x: number, y: number)
    {
        const options = new Map<string, Direction>()

        options.set(`0:-1`, Direction.NORTH)
        options.set(`0:1`, Direction.SOUTH)
        options.set(`1:0`, Direction.EAST)
        options.set(`-1:0`, Direction.WEST)

        options.set(`1:1`, Direction.SOUTH_EAST)
        options.set(`-1:-1`, Direction.NORTH_WEST)
        options.set(`1:-1`, Direction.NORTH_EAST)
        options.set(`-1:1`, Direction.SOUTH_WEST)

        const find = `${x}:${y}`

        if(!options.has(find)) throw "Invalid offset"

        return options.get(find)!
    }

    public static getClosestTile(position: Phaser.Math.Vector2, tiles: Tile[])
    {
        let closestTile = tiles[0]

        for (const tile of tiles)
        {
            if(tile == closestTile) continue

            const tileDistance = Phaser.Math.Distance.BetweenPoints(position, tile.position)
            const closestTileDistance = Phaser.Math.Distance.BetweenPoints(position, closestTile.position)

            if(tileDistance < closestTileDistance)
            {
                closestTile = tile
            }
        }
        
        return closestTile
    }

    public serializeTile(): TileData {
        return {
            x: this.x,
            y: this.y,
            tileItems: this.tileItems.map(tileItem => tileItem.serializeTileItem())
        }
    }
}