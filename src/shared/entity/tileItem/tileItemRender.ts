import { GameScene } from "../../../client/scenes/gameScene";
import { BaseObject } from "../../baseObject/baseObject";
import { Debug } from "../../debug/debug";
import { Direction } from "../../direction";
import { Grid } from "../../grid/grid";
import { NewTileCollisionFactory } from "../tile/newTileCollisionFactory";
import { Tile } from "../tile/tile";
import { TileItemInfo, TileItemType } from "./tileItemInfo";
import { TileTextureGenerator } from "../tile/tileTextureGenerator";

interface Sprite {
    x: number
    y: number
    extraLayer: number
    image?: Phaser.GameObjects.Image
    collisionSprite?: Phaser.GameObjects.Graphics;
    collisionShape?: Phaser.Geom.Polygon
}

export class TileItemRender extends BaseObject {
    
    public events = new Phaser.Events.EventEmitter();
    public get tileItemInfo() { return this._tileItemInfo; }
    public get hasCreatedCollision() { return this._hasCreatedCollision; }
    public get hasCreatedSprites() { return this._hasCreatedSprites; }
    public depth: number = 0;

    private _position = new Phaser.Math.Vector2()
    private _tileItemInfo: TileItemInfo;
    private _sprites: {[extraLayer: string]: {[coord: string]: Sprite}} = {}
    private _currentSpriteLayer = new Phaser.Math.Vector2(0, 0);
    private _rotChangeRotation: boolean = false;
    private _rotFlipCells: boolean = false;
    private _hasCreatedSprites: boolean = false;
    private _hasCreatedCollision: boolean = false;
    private _canCreateCollision = false;
    private _isTransparent: boolean = false;
    private _glow: boolean = false;

    constructor(tileItemInfo: TileItemInfo) {
        super();
        this._tileItemInfo = tileItemInfo;
    }

    public setCollisionEnabled(enabled: boolean) {
        if(this._canCreateCollision == enabled) return;
        this._canCreateCollision = enabled;
        this.checkCreateCollision();
    }

    public setGlow(glow: boolean) {
        this._glow = glow;
    }

    public render() {
   
        if(!this._hasCreatedSprites) {
            this._hasCreatedSprites = true;

            this.log("createSprites");

            this.generateSprites();
        }

        this.checkCreateCollision();
    }

    private checkCreateCollision() {
        if(!this._hasCreatedSprites) return;

        console.log('checkCreateCollision', this._hasCreatedCollision, this._canCreateCollision);

        if(this._canCreateCollision) {
            if(!this.hasCreatedCollision) {
                this.createCollisions();
            }
        } else {
            if(this.hasCreatedCollision) {
                this.destroyCollisions();
            }
        }
    }

    public destroy() {

        this._hasCreatedSprites = false;

        this.getSprites().map(sprite => {
            sprite.image?.destroy();
        });

        this.destroyCollisions();

        this._sprites = {};
    }

    private createCollisions() {
        this.log("createCollisions");

        const sprites = this.getSprites();

        this._hasCreatedCollision = true;

        sprites.map((sprite) => {
            if(sprite.extraLayer == 0) this.createCollisionForSprite(sprite);
        })

        this.updateSprites();
    }

    private destroyCollisions() {
        this._hasCreatedCollision = false;
        this._canCreateCollision = false;

        this.getSprites().map(sprite => {
            sprite.collisionSprite?.destroy();
        });
    }

    private generateSprites() {
        const scene = GameScene.Instance;
        const tileItemInfo = this._tileItemInfo;
        const sheetTextureKey = `${tileItemInfo.name}_sheet`

        this._currentSpriteLayer.set(0, 0);

        if(!scene.textures.exists(sheetTextureKey)) {
            this.log("generating texture " + sheetTextureKey + "...")

            TileTextureGenerator.create(
                scene,
                tileItemInfo.texture,
                sheetTextureKey,
                tileItemInfo.originPosition,
                tileItemInfo.size,
                new Phaser.Math.Vector2(tileItemInfo.layers.x, tileItemInfo.layers.y)
            )

            this.log("generated");
        }

        //scene.add.image(0, -100, sheetTextureKey);

        const texture = scene.textures.get(sheetTextureKey)
        const size = tileItemInfo.size

        for (let extraLayer = 0; extraLayer <= tileItemInfo.extraLayers; extraLayer++) {
            this._sprites[extraLayer] = {}

            for (let y = 0; y < size.y; y++) {
                for (let x = 0; x < size.x; x++) {
                    const key = `${this._currentSpriteLayer.x}:${this._currentSpriteLayer.y}:${x}:${y}`

                    const sprite: Sprite = {
                        x: x,
                        y: y,
                        extraLayer: extraLayer
                    }

                    if(texture.has(key)) {
                        const image = sprite.image = scene.add.image(0, 0, texture.key)
                        image.setOrigin(0, 1)
                        image.setFrame(key)

                        //image.texture.setFilter(Phaser.Textures.FilterMode.LINEAR)
                    } else {
                        console.error("no key found")
                    }

                    this._sprites[extraLayer][key] = sprite

                }
            }
        }

        this.log("sprites created");

        this.updateSprites();
    }

    
    public updateSprites() {
        this.log('updateSprites');

        const changeRotation = this._rotChangeRotation
        const flipCells = this._rotFlipCells

        const coords = Grid.getOffsetCoordsItemOcuppes(this._tileItemInfo.size, changeRotation, flipCells);
        const sprites = this.getSprites();


        for (const sprite of sprites)
        {
          
            const x = sprite.x
            const y = sprite.y
            //const key = `${x}:${y}`

            let cs = coords.filter(c => {
                return c[0].x == (!changeRotation ? x : y) && c[0].y == (!changeRotation ? y : x)
            })

            let newCoord = cs[0][1]

            
            const position = Tile.getTilePosition(newCoord.x, newCoord.y)

            position.x += this._position.x
            position.y += this._position.y
            

            
            //position.y -= sprite.extraLayer * 30;
       
            const tileItemInfo = this._tileItemInfo;
            const framesPerLayer = tileItemInfo.layers.y / (tileItemInfo.extraLayers+1)
            const layerY = this._currentSpriteLayer.y + (framesPerLayer * sprite.extraLayer)
            const frameKey = `${this._currentSpriteLayer.x}:${layerY}:${sprite.x}:${sprite.y}`;
            const depth = (position.y) + (sprite.extraLayer*5) + this.depth

            const image = sprite.image
            if(image)
            {
                
                //console.log(sprite)
                
                image.setPosition(
                    position.x - Math.ceil(Tile.SIZE.x/2),
                    position.y - Math.ceil(Tile.SIZE.y/2) + Tile.SIZE.y
                )
                image.setScale(!changeRotation ? 1 : -1, 1)
                image.setOrigin(!changeRotation ? 0 : 1, 1)
                image.setDepth(depth)
                image.setAlpha(this._isTransparent ? 0.5 : 1);
                image.setTint(0xffffff);

                if(this._glow) {
                    image.setTint(0xff0000);
                }


                if(image.texture.has(frameKey)) image.setFrame(frameKey)
            }

            const collision = sprite.collisionSprite
            if(collision)
            {

                /*

                //collision.setPosition(position.x - Math.ceil(Tile.SIZE.x/2), position.y - Math.ceil(Tile.SIZE.y/2) - Tile.SIZE.y)
                
                const add = new Phaser.Math.Vector2(
                    -Math.ceil(Tile.SIZE.x/2) - Tile.SIZE.x,
                    -Math.ceil(Tile.SIZE.y/2)
                )

                const collisionPos = new Phaser.Math.Vector2(
                    position.x - Math.ceil(Tile.SIZE.x/2),
                    position.y - Math.ceil(Tile.SIZE.y/2)
                )

                if(changeRotation) collisionPos.x += Tile.SIZE.x

                collision.setPosition(
                    collisionPos.x,
                    collisionPos.y
                )

                */

                const collisionPos = new Phaser.Math.Vector2(
                    position.x,
                    position.y
                )

                collision.setPosition(
                    collisionPos.x,
                    collisionPos.y
                )

                collision.setScale(!changeRotation ? 1 : -1, 1)
                collision.setDepth(depth + 1000)
            }
        }
    }



    public getSprites() {
        const sprites: Sprite[] = []

        for (const extraLayer in this._sprites) {
            for (const key in this._sprites[extraLayer])
            {
                const sprite = this._sprites[extraLayer][key]

                sprites.push(sprite)
            }
        }

        return sprites
    }

    public setRotation(changeRotation: boolean, flipCells: boolean) {
        this._rotChangeRotation = changeRotation
        this._rotFlipCells = flipCells

        this.updateSprites();
    }

    public setLayer(x: number, y: number) {
        this._currentSpriteLayer.set(x, y);
        this.updateSprites();
    }

    public setTransparent(value: boolean) {
        if(value == this._isTransparent) return;

        this._isTransparent = value;
        this.updateSprites();
    }

    public setPosition(x: number, y: number) {
        this._position.set(x, y);
    }

    private createCollisionForSprite(sprite: Sprite) {
        const tileItemInfo = this._tileItemInfo
        const x = sprite.x
        const y = sprite.y
        const scene = GameScene.Instance

        const size = tileItemInfo.size
        const offsetX = [0, 0]
        const offsetY = [0, 0]
        
        if(x == 0) offsetX[0] = tileItemInfo.collision.x
        if(x == size.x-1) offsetX[1] = tileItemInfo.collision.x

        if(y == 0) offsetY[0] = tileItemInfo.collision.y
        if(y == size.y-1) offsetY[1] = tileItemInfo.collision.y

        let points: Phaser.Math.Vector2[] = []

        let topPoints: Phaser.Math.Vector2[] = [];

        if(tileItemInfo.collision.isWall)
        {
            offsetY[0] -= tileItemInfo.collision.height
            offsetY[1] += tileItemInfo.collision.height

            const atFront = tileItemInfo.collision.wallAtFront === true

            points = NewTileCollisionFactory.getWallCollisionPoints(atFront,
                offsetX,
                offsetY,
                tileItemInfo.collision.wallSize || 0
            )

            
        }
        else
        {
            points = NewTileCollisionFactory.getBlockCollisionPoints(
                offsetX,
                offsetY,
                tileItemInfo.collision.height
            )
        }

    
        const drawCircle = (x: number, y: number) => {
            const c = GameScene.Instance.add.circle(x, y, 10, 0xff0000);
            c.setDepth(100000)
        }

        for (const point of topPoints) {
            drawCircle(point.x, point.y);
        }

        const collisionSprite = sprite.collisionSprite = scene.add.graphics();
        const collisionShape = sprite.collisionShape = new Phaser.Geom.Polygon(points);

        collisionSprite.fillStyle(0xff0000, 0.3); //to set collision visible
        collisionSprite.fillPoints(points);

        collisionSprite.setInteractive(
            new Phaser.Geom.Polygon(points),
            Phaser.Geom.Polygon.Contains
        )

        if(this.tileItemInfo.type == TileItemType.FLOOR) {
            GameScene.Instance.layerFloor.add(sprite.collisionSprite);
        } else {
            GameScene.Instance.layerObjects.add(sprite.collisionSprite);
        }
        
        this.setupCollisionEventsAndStyle(collisionSprite)
    }

    private setupCollisionEventsAndStyle(collisionSprite: Phaser.GameObjects.Graphics) {
        const color = 0xffffff;
        const alphaHover = 1;
        const alpha = 0.5;

        const draw = function(color: number) {
            collisionSprite.clear();
            collisionSprite.fillStyle(color, 0.3);
            collisionSprite.fillCircle(Tile.SIZE.x/2, Tile.SIZE.y/2, 7.5);
        }

        const self = this;

        collisionSprite.on('pointerup', function (pointer) {
            self.events.emit("pointerup");
        });

        collisionSprite.on('pointerdown', function (pointer) {
            self.events.emit("pointerdown");
        });

        collisionSprite.on('pointerover', function (pointer) {
            //collisionSprite.setFillStyle(color, alphaHover)
            self.events.emit("pointerover");

            //draw(0xff0000);
        });

        collisionSprite.on('pointerout', function (pointer) {
            //collision.setFillStyle(color, alpha)
            self.events.emit("pointerout");

            //draw(0);
        });

        //draw(0);
    }

    public static valuesFromDirection(direction: Direction) {
        return [
            [false, true],
            [false, false],
            [true, false],
            [true, true]
        ][direction]
    }
}