import { BaseObject } from "../baseObject/baseObject";
import { Entity } from "../entity/entity";
import { Player } from "../entity/player/player";
import { Game } from "../game/game";

import { v4 as uuidv4 } from 'uuid';
import { TileMap } from "./tileMap";
import { WorldGenerator } from "./worldGenerator";
import { TileItem } from "../entity/tileItem/tileItem";
import { Tile } from "../entity/tile/tile";
import { Direction } from "../direction";
import { TileItemRender } from "../entity/tileItem/tileItemRender";
import { TileItemType } from "../entity/tileItem/tileItemInfo";

export class World extends BaseObject {
    public events = new Phaser.Events.EventEmitter();
    public id: string = uuidv4();
    public get game() { return this._game; }
    public get entities() { return this._entities; }
    public get tileMap() { return this._tileMap; }
    public get worldGenerator() { return this._worldGenerator; }

    private _game: Game;
    private _entities: Entity[] = [];
    private _tileMap: TileMap;
    private _worldGenerator: WorldGenerator;

    constructor(game: Game) {
        super();
        this._game = game;
        this._tileMap = new TileMap(this);
        this._worldGenerator = new WorldGenerator(this);
    }

    public update(dt: number) {
        this._entities.map(entity => entity.update(dt));
    }

    public render(dt: number) {
        this._entities.map(entity => entity.render(dt));
    }

    public destroy() {
        this.log("destroy");

        this.tileMap.tiles.map(tile => {
            console.log("removing tile", tile.x, tile.y)
            this.tileMap.removeTile(tile.x, tile.y);
        })

        this._entities.map(entity => entity.destroy());
    }

    public spawnEntity(x: number, y: number) {
        const entity = new Entity(this);
        this.addEntity(entity);
        return entity;
    }

    public spawnPlayer(x: number, y: number) {
        const entity = new Player(this);
        this.addEntity(entity);
        return entity;
    }

    public addEntity(entity: Entity) {
        this._entities.push(entity);
    }

    public removeEntity(entity: Entity) {
        this._entities.splice(this._entities.indexOf(entity), 1);

        if(entity.destroyed) return;

        entity.destroy();
    }

    public hasEntity(id: string) {
        for (const entity of this._entities) {
            if(entity.id == id) return true;
        }
        return false;
    }

    public getEntity(id: string) {
        for (const entity of this._entities) {
            if(entity.id == id) return entity;
        }
        return undefined;
    }

    public getNormalEntities() {
        return this._entities.filter(entity => {
            if(entity instanceof Tile) return false;
            if(entity instanceof TileItem) return false;

            return true;
        });
    }

    //-------------

    //works, same as try
    public addTileItemToTile(tileItemId: string, tileX: number, tileY: number) {
        
        const tile = this.tileMap.getTile(tileX, tileY);
        const tileItem = this.game.tileItemFactory.createTileItem(tileItemId, this);

        const canBePlaced = this.canTileItemBePlacedAtTile(tileItem, tile);

        if(canBePlaced) this.forceAddTileItemToTile(tileItem, tile);
        
        return tileItem;
    }

    public tryAddTileItemToTile(tileItem: TileItem, tile: Tile) {
        const canBePlaced = this.canTileItemBePlacedAtTile(tileItem, tile);

        if(canBePlaced) this.forceAddTileItemToTile(tileItem, tile);
        
        return canBePlaced;
    }

    public forceAddTileItemToTile(tileItem: TileItem, tile: Tile) {
        //this.log(`forceAddTileItemToTile`, tileItem, tile);

        const pos = tile.position;
        tileItem.position.set(pos.x, pos.y);
        this.addEntity(tileItem);

        tile.addTileItem(tileItem);

        this.putGridItem(tileItem, tile);
        
 
        return tileItem;
    }

    //-----

    public putGridItem(tileItem: TileItem, tile: Tile) {
        const tileItemInfo = tileItem.tileItemInfo;

        const gridItem = this.tileMap.grid.addItem(tileItem.id, tile.x, tile.y, tileItemInfo.size)
        gridItem.name = tileItemInfo.name;

        const type = tileItemInfo.type
        if(type == TileItemType.FLOOR) gridItem.color = 0
        if(type == TileItemType.WALL) gridItem.color = 0xcccccc
    }

    //-----

    public canTileItemBePlacedAtTile(tileItem: TileItem, tile: Tile, direction?: Direction)
    {
        //console.log(`canTileItemBePlacedAtTile :`, tileItem.getInfo().name)

        if(direction === undefined) direction = tileItem.direction

        const tileMap = this.tileMap;
        const grid = tileMap.grid;
        const cell = grid.getCell(tile.x, tile.y)
        const size = tileItem.tileItemInfo.size;

        const o = TileItemRender.valuesFromDirection(direction)
        

        var result = grid.canItemBePlaced(cell, size, o[0], o[1], (compareCell, compareItem) =>
        {

            if(!compareItem)
                return true

            if(compareItem.id == tileItem.id)
                return true

                

            const compareTileItem = tileMap.getTile(compareItem.getOriginCell().x, compareItem.getOriginCell().y).getTileItem(compareItem.id)!

            //console.log(`compare ${compareTileItem.getInfo().name}`)


            if(tileItem.tileItemInfo.type == TileItemType.WALL)
                return false

            if(compareTileItem.tileItemInfo.type == tileItem.tileItemInfo.type)
                return false
                
            if(compareTileItem.tileItemInfo.placeType == tileItem.tileItemInfo.placeType && compareTileItem.tileItemInfo.type != TileItemType.FLOOR && tileItem.tileItemInfo.type != TileItemType.FLOOR)
                return false
                
            return true
        })

        //console.log("the result was ", result)

        return result;
    }
    
    public canTileItemRotateTo(tileItem: TileItem, direction: Direction) {
        return this.canTileItemBePlacedAtTile(tileItem, tileItem.tile, direction);
    }

    //----------

    public getAllTileItems() {
        const tileItems: TileItem[] = []

        this.tileMap.tiles.map(tile =>
        {
            tile.tileItems.map(tileItem => tileItems.push(tileItem));
        })
        return tileItems
    }

    //----
}