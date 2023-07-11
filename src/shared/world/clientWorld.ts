import { Gameface } from "../../client/gameface/gameface";
import { PacketData_Test, PacketData_WorldData_Entities, PacketData_WorldData_Tiles, PacketType } from "../../client/network/packet";
import { Entity } from "../entity/entity";
import { TileItem } from "../entity/tileItem/tileItem";
import { EventRegister } from "../eventRegister/eventRegister";
import { Game } from "../game/game";
import { World } from "./world";

export class ClientWorld extends World {
    public get gameface() { return Gameface.Instance; }
    public get network() { return this.gameface.network; }

    private _eventRegister: EventRegister;

    constructor(game: Game) {
        super(game);

        this._eventRegister = new EventRegister(this);

        this.log("init");

        this.network.packetManager.registerListener<PacketData_WorldData_Tiles>(this._eventRegister, PacketType.WORLD_DATA_TILES, (data) => {
            this.log("WORLD_DATA_TILE");

            const world = this;
            const tileItemFactory = world.game.tileItemFactory;

            data.tiles.map(tileData => {
                if(!world.tileMap.tileExists(tileData.x, tileData.y)) {
                    world.tileMap.addTile(tileData.x, tileData.y);
                }
            });

            data.tiles.map(tileData => {
                const tile = world.tileMap.getTile(tileData.x, tileData.y);

                for (const tileItemData of tileData.tileItems) {

                    let tileItem = tileItemFactory.getTileItem(tileItemData.id);
    
                    if(tileItem) {
                        if(tileItem.tile != tile) {
                            console.warn("different tile");
                            //world.removeTileItem(tileItem);
                            //tileItem = undefined;
                        }
                    }
    
                    if(!tileItem) {
                        tileItem = tileItemFactory.createTileItem(tileItemData.tileItemId, world, tileItemData.id);
                    }
    
                    //const tileItem = tileItemFactory.getTileItem(tileItemData.id);
    
                    if(!tileItem.tile) world.forceAddTileItemToTile(tileItem, tile);
    
                    if(tileItem.direction != tileItemData.direction) tileItem.setDirection(tileItemData.direction);
    
                    /*
                    if(tileItemData.data) {
    
                        tileItem.unserializeData(tileItemData.data);
                    }
                    */
                }
            });

        });

        this.network.packetManager.registerListener<PacketData_WorldData_Entities>(this._eventRegister, PacketType.WORLD_DATA_ENTITIES, (data) => {
            this.log("WORLD_DATA_ENTITIES");

            const world = this;

            data.entities.map(entityData => {
                if(!world.hasEntity(entityData.id)) {
                    const entity = new Entity(world);
                    entity.id = entityData.id;
                    world.addEntity(entity);
                }
                world.getEntity(entityData.id)!.position.set(entityData.x, entityData.y);
            });

        });
    }

    public destroy() {
        super.destroy();

        this._eventRegister.removeAllListeners();
    }
}