import { Tile } from "./tile"

export class NewTileCollisionFactory {
    public static DOOR_HEIGHT = 232;
    
    public static getBlockCollisionPoints(offsetX: number[], offsetY: number[], height: number) {
        const points: Phaser.Math.Vector2[] = []

        points.push(new Phaser.Math.Vector2(-Tile.SIZE.x/2,     0));
        points.push(new Phaser.Math.Vector2(0,                  Tile.SIZE.y/2));
        points.push(new Phaser.Math.Vector2(Tile.SIZE.x/2,      0));
        points.push(new Phaser.Math.Vector2(0,                  -Tile.SIZE.y/2));

        if(height > 0) {
            points.splice(0, 0, new Phaser.Math.Vector2(-Tile.SIZE.x/2,     0).add(new Phaser.Math.Vector2(0, -height)));
            points.splice(4, 0, new Phaser.Math.Vector2(Tile.SIZE.x/2,      0).add(new Phaser.Math.Vector2(0, -height)));

            points[5].y -= height;

        }

        return points
    }

    public static getWallCollisionPoints(atFrontTile: boolean, offsetX: number[], offsetY: number[], wallSize: number) {
        const h = this.DOOR_HEIGHT

        const points: Phaser.Math.Vector2[] = []

        points.push(new Phaser.Math.Vector2(-Tile.SIZE.x/2,     0));
        points.push(new Phaser.Math.Vector2(0,                  Tile.SIZE.y/2));

        points.push(new Phaser.Math.Vector2(0,      Tile.SIZE.y/2 - h));
        points.push(new Phaser.Math.Vector2(-Tile.SIZE.x/2,     -h));

        if(wallSize > 0) {
            points.splice(2, 0, new Phaser.Math.Vector2(0, Tile.SIZE.y/2).add(this.moveAlongXY(0, -wallSize)));
            points.splice(4, 0, new Phaser.Math.Vector2(-Tile.SIZE.x/2,     -h).add(this.moveAlongXY(0, -wallSize)));

            points[3].add(this.moveAlongXY(0, -wallSize));
        }

        return points
    }

    public static moveAlongXY(moveX: number, moveY: number): Phaser.Math.Vector2
    {
        var baseTileSize = Tile.SIZE
        var pos = new Phaser.Math.Vector2(0, 0)

        pos.x += moveX * baseTileSize.x / 2 / 100
        pos.y += moveX * baseTileSize.y / 2 / 100

        pos.x += moveY * -baseTileSize.x / 2 / 100
        pos.y += moveY * baseTileSize.y / 2 / 100

        return pos
    }
}