import { BaseObject } from "../baseObject/baseObject";
import { Direction } from "../direction";
import { TileItem } from "../entity/tileItem/tileItem";
import { World } from "./world";

export class WorldGenerator extends BaseObject {
    public get world() { return this._world; }

    private _world: World;

    constructor(world: World) {
        super();
        this._world = world;
    }

    public generate() {
        const size = new Phaser.Math.Vector2(7, 10);
        
        const world = this.world;
        const tileItemFactory = world.game.tileItemFactory;
        
        this.generateFloors("floor1", 0, 0, size.x, size.y);
        this.generateFloors('test_floor1', 0, size.y, 4, 4);
        this.generateWalls(size.x, size.y);
        this.generateSideWalks(20);

        const floorDecoration = world.addTileItemToTile("floorDecoration2", 2, 2);
        floorDecoration.setCollisionEnabled(true);

        const stove = world.addTileItemToTile("stove1", 2, 4);
        stove.setCollisionEnabled(true);
        window['stove'] = stove;

        const chair = world.addTileItemToTile("chair1", 4, 4);
        chair.setCollisionEnabled(true);
        window['chair'] = chair;
    }

    public generateTest() {
        const size = new Phaser.Math.Vector2(5, 5);
        
        const world = this.world;
        const tileItemFactory = world.game.tileItemFactory;
        
        this.generateFloors("floor1", 0, 0, size.x, size.y);
        this.generateWalls(size.x, size.y);
        this.generateSideWalks(20);

        const stove = world.addTileItemToTile("stove1", 2, 4);
        stove.setCollisionEnabled(true);
        window['stove'] = stove;
    }

    public generateFloors(floorId: string, x: number, y: number, sizeX: number, sizeY: number) {
        const world = this.world;
        const tileMap = this.world.tileMap;

        for (let iy = 0; iy < sizeY; iy++) {
            for (let ix = 0; ix < sizeX; ix++) {

                const pos = {x: x + ix, y: y + iy}

                if(!tileMap.tileExists(pos.x, pos.y)) tileMap.addTile(pos.x, pos.y);

                const tile = tileMap.getTile(pos.x, pos.y);
                
                if(tile.tileItems.length == 0) world.addTileItemToTile(floorId, pos.x, pos.y);
            }
        }
    }

    public generateSideWalks(size: number) {
        const world = this.world;
        const tileMap = this.world.tileMap;

        for (let y = -2; y < size; y++)
        {
            for (let x = -2; x < size; x++)
            {
                if((x == -2 || y == -2))
                {
                    if(tileMap.tileExists(x, y)) continue

                    const tile = tileMap.addTile(x, y);

                    tile.isSidewalk = true;

                    if(tile.tileItems.length == 0) {
                        world.addTileItemToTile('test_floor1', x, y);
                    }
                }
            }
        }
    }

    public generateWalls(amountX: number, amountY: number) {
        const world = this.world;
        const tileMap = this.world.tileMap;

        const generate = (x: number, y: number, flip?: boolean) => {
            if(!tileMap.tileExists(x, y)) {
                tileMap.addTile(x, y);
            }

            //if(x == -1 && y == 1) return;

            const tile = tileMap.getTile(x, y);


            if(tile.tileItems.length == 0) {
                
                const wall = world.addTileItemToTile('wall1', x, y);

                if(flip) wall.setDirection(Direction.EAST);
            }
        }

        for (let i = 0; i < amountX; i++) {
            generate(i, -1);
        }
        for (let i = 0; i < amountY; i++) {
            generate(-1, i, true);
        }
        
    }
}