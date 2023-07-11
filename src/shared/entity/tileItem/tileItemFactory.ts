import { AssetManager } from "../../assetManager/assetManager";
import { BaseObject } from "../../baseObject/baseObject";
import { Debug } from "../../debug/debug";
import { World } from "../../world/world";
import { TileItemFloor } from "./items/tileItemFloor";
import { TileItemStove } from "./items/tileItemStove";
import { TileItem } from "./tileItem";
import { TileItemCategory, TileItemInfo, TileItemPlaceType, TileItemRotationType, TileItemType } from "./tileItemInfo";

export class TileItemFactory extends BaseObject {
    public get tileItemInfoList() { return this._tileItemInfoList; }

    private _tileItemInfoList: {[id: string]: TileItemInfo} = {}
    private _createdTileItems = new Phaser.Structs.Map<string, TileItem>([]);

    public init() {
        this.initTileItemInfos();
    }

    private initTileItemInfos() {
        this.addTileItemInfo({
            id: 'floor1',
            name: 'floor1',
            texture: 'floor/floor1',
            type: TileItemType.FLOOR,
            rotationType: TileItemRotationType.SIDE_AND_BACK,
            placeType: TileItemPlaceType.FLOOR,
            size: new Phaser.Math.Vector2(1, 1),
            layers: new Phaser.Math.Vector2(1, 1),
            extraLayers: 0,
            collision: {
                x: 0,
                y: 0,
                height: 0
            },
            originPosition: new Phaser.Math.Vector2(84, 0),
            category: TileItemCategory.FLOOR
        })

        this.addTileItemInfo({
            id: 'test_floor1',
            name: 'test_floor1',
            texture: 'floor/test_floor1',
            type: TileItemType.FLOOR,
            rotationType: TileItemRotationType.SIDE_AND_BACK,
            placeType: TileItemPlaceType.FLOOR,
            size: new Phaser.Math.Vector2(1, 1),
            layers: new Phaser.Math.Vector2(1, 1),
            extraLayers: 0,
            collision: {
                x: 0,
                y: 0,
                height: 0
            },
            originPosition: new Phaser.Math.Vector2(84, 0),
            category: TileItemCategory.FLOOR
        })

        this.addTileItemInfo({
            id: 'floorDecoration1',
            name: 'floorDecoration1',
            texture: 'floorDecoration/floorDecoration1',
            type: TileItemType.FLOOR_DECORATION,
            rotationType: TileItemRotationType.SIDE_AND_BACK,
            placeType: TileItemPlaceType.FLOOR,
            size: new Phaser.Math.Vector2(1, 1),
            layers: new Phaser.Math.Vector2(1, 1),
            extraLayers: 0,
            collision: {
                x: 0,
                y: 0,
                height: 42
            },
            originPosition: new Phaser.Math.Vector2(84, 42),
            category: TileItemCategory.DECORATION
        })

        this.addTileItemInfo({
            id: 'floorDecoration2',
            name: 'floorDecoration2',
            texture: 'floorDecoration/floorDecoration2',
            type: TileItemType.FLOOR_DECORATION,
            rotationType: TileItemRotationType.SIDE_AND_BACK,
            placeType: TileItemPlaceType.FLOOR,
            size: new Phaser.Math.Vector2(2, 1),
            layers: new Phaser.Math.Vector2(1, 1),
            extraLayers: 0,
            collision: {
                x: 0,
                y: 0,
                height: 42
            },
            originPosition: new Phaser.Math.Vector2(84, 42),
            category: TileItemCategory.DECORATION
        })

        this.addTileItemInfo({
            id: 'table1',
            name: 'table1',
            texture: 'table/table1',
            type: TileItemType.TABLE,
            rotationType: TileItemRotationType.SIDE_AND_BACK,
            placeType: TileItemPlaceType.FLOOR,
            size: new Phaser.Math.Vector2(1, 1),
            layers: new Phaser.Math.Vector2(1, 1),
            extraLayers: 0,
            collision: {
                x: 0,
                y: 0,
                height: 42
            },
            originPosition: new Phaser.Math.Vector2(84, 42),
            category: TileItemCategory.TABLE
        })

        this.addTileItemInfo({
            id: 'chair1',
            name: 'chair1',
            texture: 'chair/chair1',
            type: TileItemType.CHAIR,
            rotationType: TileItemRotationType.SIDE_AND_BACK,
            placeType: TileItemPlaceType.FLOOR,
            size: new Phaser.Math.Vector2(1, 1),
            layers: new Phaser.Math.Vector2(2, 4),
            extraLayers: 1,
            collision: {
                x: 28,
                y: 25,
                height: 80
            },
            originPosition: new Phaser.Math.Vector2(84, 97),
            category: TileItemCategory.CHAIR
        })

        this.addTileItemInfo({
            id: 'wall1',
            name: 'wall1',
            texture: 'wall/wall1',
            type: TileItemType.WALL,
            rotationType: TileItemRotationType.SIDE_AND_BACK,
            placeType: TileItemPlaceType.FLOOR,
            size: new Phaser.Math.Vector2(1, 1),
            layers: new Phaser.Math.Vector2(1, 1),
            extraLayers: 0,
            collision: {
                x: 0,
                y: 0,
                height: 0,
                isWall: true,
                wallAtFront: true,
                wallSize: 0
            },
            originPosition: new Phaser.Math.Vector2(84, 252),
            category: TileItemCategory.WALL
        })

        this.addTileItemInfo({
            id: 'door1',
            name: 'door1',
            texture: 'door/door1',
            type: TileItemType.DOOR,
            rotationType: TileItemRotationType.SIDE_AND_BACK,
            placeType: TileItemPlaceType.WALL,
            size: new Phaser.Math.Vector2(1, 1),
            layers: new Phaser.Math.Vector2(2, 1),
            extraLayers: 0,
            collision: {
                x: 0,
                y: 20,
                height: -20,
                isWall: true,
                wallAtFront: false,
                wallSize: 5
            },
            originPosition: new Phaser.Math.Vector2(84, 215),
            category: TileItemCategory.DOOR
        })

        this.addTileItemInfo({
            id: 'stove1',
            name: 'stove1',
            texture: 'stove/stove1',
            type: TileItemType.STOVE,
            rotationType: TileItemRotationType.SIDE_AND_BACK,
            placeType: TileItemPlaceType.FLOOR,
            size: new Phaser.Math.Vector2(1, 1),
            layers: new Phaser.Math.Vector2(1, 1),
            extraLayers: 0,
            collision: {
                x: 0,
                y: 0,
                height: 42
            },
            originPosition: new Phaser.Math.Vector2(84, 42),
            category: TileItemCategory.STOVE
        })

        this.addTileItemInfo({
            id: 'counter1',
            name: 'counter1',
            texture: 'counter/counter1',
            type: TileItemType.COUNTER,
            rotationType: TileItemRotationType.SIDE_AND_BACK,
            placeType: TileItemPlaceType.FLOOR,
            size: new Phaser.Math.Vector2(1, 1),
            layers: new Phaser.Math.Vector2(1, 1),
            extraLayers: 0,
            collision: {
                x: 0,
                y: 0,
                height: 42
            },
            originPosition: new Phaser.Math.Vector2(84, 42),
            category: TileItemCategory.COUNTER
        })

        //height is wrong!!
        
        this.addTileItemInfo({
            id: 'table1',
            name: 'table1',
            texture: 'table/table1',
            type: TileItemType.TABLE,
            rotationType: TileItemRotationType.SIDE_AND_BACK,
            placeType: TileItemPlaceType.FLOOR,
            size: new Phaser.Math.Vector2(1, 1),
            layers: new Phaser.Math.Vector2(1, 1),
            extraLayers: 0,
            collision: {
                x: 0,
                y: 0,
                height: 55
            },
            originPosition: new Phaser.Math.Vector2(84, 55),
            category: TileItemCategory.TABLE
        })

        this.addTileItemInfo({
            id: 'window1',
            name: 'window1',
            texture: 'wallDecoration/window1',
            type: TileItemType.WALL_DECORATION,
            rotationType: TileItemRotationType.SIDE_ONLY,
            placeType: TileItemPlaceType.WALL,
            size: new Phaser.Math.Vector2(2, 1),
            layers: new Phaser.Math.Vector2(1, 1),
            extraLayers: 0,
            collision: {
                x: 20,
                y: 60,
                height: 40,
                isWall: true,
                wallAtFront: false,
                wallSize: 5
            },
            originPosition: new Phaser.Math.Vector2(84, 198),
            category: TileItemCategory.WINDOW
        })
    }

    public addTileItemInfo(tileItemInfo: TileItemInfo) {
        this.log(`addTileItemInfo ${tileItemInfo.id}`);

        this._tileItemInfoList[tileItemInfo.id] = tileItemInfo;
        return tileItemInfo;
    }

    public hasTileItemInfo(id: string) {
        return this._tileItemInfoList[id] != undefined;
    }

    public getTileItemInfo(id: string) {
        return this._tileItemInfoList[id];
    }

    public createTileItem<T extends TileItem>(id: string, world: World, customTileItemId?: string) {
        if(!this.hasTileItemInfo(id)) throw `Invalid TileItemInfo '${id}'`

        const tileItemInfo = this.getTileItemInfo(id)

        const map = new Map<TileItemType, typeof TileItem>()
        map.set(TileItemType.FLOOR, TileItemFloor);
        map.set(TileItemType.STOVE, TileItemStove)
        /*
        map.set(TileItemType.WALL, TileItemWall);
        map.set(TileItemType.DOOR, TileItemDoor);
        map.set(TileItemType.CHAIR, TileItemChair);
        map.set(TileItemType.COUNTER, TileItemCounter);
        map.set(TileItemType.TABLE, TileItemTable);
        map.set(TileItemType.WALL_DECORATION, TileItemWallDecoration);
        map.set(TileItemType.FLOOR_DECORATION, tileItemFloorDecoration);
        */

        const type = tileItemInfo.type

        let tileItem: TileItem | undefined

        if(map.has(type)) tileItem = new (map.get(type)!)(world, tileItemInfo)

        if(!tileItem) tileItem = new TileItem(world, tileItemInfo)

        if(customTileItemId) tileItem.id = customTileItemId;

        this._createdTileItems.set(tileItem.id, tileItem);

        this.log(`TileItem ${tileItem.id} created`);
        
        return tileItem as T
    }

    public removeTileItem(id: string) {
        this.log(`TileItem ${id} removed`);

        return this._createdTileItems.delete(id);
    }

    public hasTileItem(id: string) {
        return this._createdTileItems.has(id);
    }

    public getTileItem(id: string) {
        return this._createdTileItems.get(id);
    }

    public addAssetsToLoad() {
        const images: string[][] = [];
        const tileItemInfoList = this.tileItemInfoList;

        for (const id in tileItemInfoList) {
            const tileItemInfo = tileItemInfoList[id]
            const texture = tileItemInfo.texture
            images.push([texture, `tileItem/${texture}.png`])
        }

        for(const image of images) {
            AssetManager.addImage(image[0], image[1]);
        }
    }
}