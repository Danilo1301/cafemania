import { Debug } from "../debug/debug";
import { Input } from "../input/input";
import { Tile } from "../tile/tile";
import { TileItem } from "../tileItem/tileItem";
import { TileItemType } from "../tileItem/tileItemInfo";
import { World } from "../world/world";
import { WorldEvent } from "../world/worldEvents";

export class MoveTileItem {
    public static get isMovingAnyTileItem() { return this._movingTileItem != undefined; }

    private static _movingTileItem?: TileItem;

    private static _selectedTileItem?: TileItem;

    private static _hoveringTileItem?: TileItem;

    private static _placeAtTile?: Tile;

    private static _world: World;

    public static init() {
        Input.events.on("pointerup", () => {
            
            Debug.log('pointerup');

            if(this.isMovingAnyTileItem) {
                this.stopMoving();
            }

        })

        Input.events.on("pointerdown", () => {
            Debug.log('pointerdown');
        })

        Input.events.on("pointermove", (ev) => {
        })

        Input.events.on("begindrag", () => {
            
            Debug.log('begindrag');


            if(this._selectedTileItem != undefined) {
                if(this._selectedTileItem == this._hoveringTileItem) {
                    console.log("begin drag tileitem");

                    if(!this.isMovingAnyTileItem) {
                        this.startMove(this._selectedTileItem);
                    }
                }

            }


        })
    }

    public static unselectCurrentTileItem() {
        if(this._selectedTileItem) {
            this._selectedTileItem.setIsSelected(false);
            this._selectedTileItem = undefined;
        }
    }

    public static selectTileItem(tileItem: TileItem) {
        if(tileItem == this._selectedTileItem) return;

        this.unselectCurrentTileItem();

        tileItem.setIsSelected(true);
        this._selectedTileItem = tileItem;
    }

    public static setWorld(world: World) {
        this._world = world;

        world.events.on(WorldEvent.TILE_ITEM_POINTER_DOWN, (tileItem: TileItem) => {
            
        })

        world.events.on(WorldEvent.TILE_ITEM_POINTER_UP, (tileItem: TileItem) => {

            if(tileItem.tileItemInfo.type == TileItemType.FLOOR || tileItem.tileItemInfo.type == TileItemType.WALL || tileItem.tileItemInfo.type == TileItemType.STOVE) return;

            if(Input.isDragging) {
                Debug.log("Input.isDragging")
            }

            if(!Input.isDragging && !this.isMovingAnyTileItem) {
                console.log("try select tileitem");

                if(this._selectedTileItem == tileItem) {
                    this.unselectCurrentTileItem();
                    return;
                }
                
                this.selectTileItem(tileItem);
                

            }
        })

        world.events.on(WorldEvent.TILE_ITEM_POINTER_OVER, (tileItem: TileItem) => {
            this._hoveringTileItem = tileItem;

            if(this.isMovingAnyTileItem) {
                this.tryPlaceMovingTileItemAtTileItem();
            }
        })

        world.events.on(WorldEvent.TILE_ITEM_POINTER_OUT, (tileItem: TileItem) => {
            this._hoveringTileItem = undefined;
        })
    }

    public static startMove(tileItem: TileItem) {
        if(tileItem.tileItemInfo.type == TileItemType.FLOOR || tileItem.tileItemInfo.type == TileItemType.WALL) return;

        this._movingTileItem = tileItem;

        tileItem.setIsMoving(true);

        this._world.toggleAllItemsCollision(false);
        this._world.toggleFloorCollision(true);
    }


    private static tryPlaceMovingTileItemAtTileItem() {
        const movingTileItem = this._movingTileItem;
        const hoveringTileItem = this._hoveringTileItem;

        if(!movingTileItem || !hoveringTileItem) return false;

        if(hoveringTileItem.tileItemInfo.type != TileItemType.FLOOR) return false;


        const world = movingTileItem.world;

        //const canBePlaced = world.tileMap.canTileItemBePlacedAtTile(movingTileItem, hoveringTileItem.tile);

        const canBePlaced = world.tryMoveTileItem(movingTileItem, hoveringTileItem.tile)
        
        if(canBePlaced) {
            this._placeAtTile = hoveringTileItem.tile;

            //world.moveTileItem(movingTileItem, hoveringTileItem.tile);

        }
        
        return canBePlaced;
    }

    public static stopMoving() {
        if(this._movingTileItem) {
            this._movingTileItem.setIsMoving(false);

            this._world.restoreAllItemsCollision();
        }
        this._movingTileItem = undefined;
    }
}