
import { World } from "../../world/world";
import { Entity } from "../entity";
import { TileItemInfo, TileItemPlaceType, TileItemRotationType, TileItemType } from "./tileItemInfo";
import { EventRegister } from "../../eventRegister/eventRegister";
import { Tile } from "../tile/tile";
import { TileItemRender } from "./tileItemRender";
import { Direction } from "../../direction";
import { Input } from "../../../client/input/input";

export interface TileItemData {
    id: string
    tileItemId: string
    direction: Direction
}

export class TileItem extends Entity {
    public get tileItemInfo() { return this._tileItemInfo; }
    public get tileItemRender() { return this._tileItemRender!; }
    public get tile() { return this._tile!; }
    public get direction() { return this._direction; }
    
    private _tileItemSpriteIndex = new Phaser.Math.Vector2(0, 0);

    private _tileItemInfo: TileItemInfo;
    private _tileItemRender?: TileItemRender;
    private _tile?: Tile;
    private _direction: Direction = Direction.SOUTH;

    private _eventRegister: EventRegister;
    
    private _collisionEnabled: boolean = false;
    private _glow: boolean = false;

    private _playAnimation = false;
    private _animTime: number = 0;

    constructor(world: World, tileItemInfo: TileItemInfo) {
        super(world);
        this._tileItemInfo = tileItemInfo;
        this._eventRegister = new EventRegister(this);

        if(tileItemInfo.layers.x > 1) this._playAnimation = true;
    }

    public update(dt: number) {
        super.update(dt);
    }

    public render(dt: number) {
        super.render(dt);

        if(!this._tileItemRender) {
            this.log("create TileItemRender");

            this._tileItemRender = new TileItemRender(this.tileItemInfo);
            
            this.setupTileItemRenderEvents();

            //--
            if(this.tileItemInfo.placeType == TileItemPlaceType.WALL) {
                if(this.tileItemInfo.type == TileItemType.DOOR)  this._tileItemRender.depth = -Tile.SIZE.y/3;
            }
            if(this.tileItemInfo.type == TileItemType.WALL) this._tileItemRender.depth =-2;
            //--

            this.tileItemRender.render();
            this.updateSprites();
            this.updateSpritesLayer();
        }

        if(this._playAnimation) {
            this._animTime += dt;

            if(this._animTime >= 10) {
                this._animTime = 0;

                let layer = this._tileItemSpriteIndex.x + 1;
                if(layer >= this.tileItemInfo.layers.x) layer = 0;
                this.setAnimLayer(layer);
            }
        }

        this.debugText.setLine("tile", `${this._tile ? `Tile: ${this.tile.x}, ${this.tile.y}` : "No tile"}`);
    
        this.debugText.setLine("anim", `${this.tileItemInfo.layers.x}, ${this.tileItemInfo.layers.y} ${this._animTime} ${this._tileItemSpriteIndex.x}`);
        
        this.debugText.setLine("serialize", this.isPointerOver ? JSON.stringify(this.serialize()) : "");
    }

    public destroy() {
        super.destroy();

        this._tileItemRender?.destroy();
        this._tileItemRender = undefined;
        
        this._eventRegister.removeAllListeners();

        this.changePointerOverState(false);

        if(this.world.game.tileItemFactory.hasTileItem(this.id)) {
            this.world.game.tileItemFactory.removeTileItem(this.id);
        }
    }

    public setAnimLayer(layer: number) {
        this._tileItemSpriteIndex.x = layer;
        this.updateSprites();
    }

    private setupTileItemRenderEvents() {
        
        const evPointerDown = () => {
            if(this.isPointerOver) {
                this.changePointerDown(true);
            }
        }
        
        const evPointerUp = () => {
            this.changePointerDown(false);
        }
        
        this._eventRegister.addListener(Input.events, "pointerdown", evPointerDown);
        this._eventRegister.addListener(Input.events, "pointerup", evPointerUp);

        const evPointerOver = () => {
            this.changePointerOverState(true)
        }

        const evPointerOut = () => {
            this.changePointerOverState(false);
        }

        this._eventRegister.addListener(this.tileItemRender.events, "pointerover", evPointerOver);
        this._eventRegister.addListener(this.tileItemRender.events, "pointerout", evPointerOut);

        //this._eventRegister.addListener(this.tileItemRender.events, "pointerdownoutside", onPointerDown_Outside);
        //this._eventRegister.addListener(this.tileItemRender.events, "pointerupoutside", onPointerUp_Outside);
    }

    public setCollisionEnabled(enabled: boolean) {
        if(this._collisionEnabled == enabled) return;
        
        //if(this._isPointerOver) this.onPointerOut();
        console.warn("this");

        this._collisionEnabled = enabled;
        this.updateSprites();
    }

    public setGlow(glow: boolean) {
        if(this._glow == glow) return;
        this._glow = glow;

        this.tileItemRender.setGlow(glow);
        this.updateSprites();
    }

    public setTile(tile?: Tile) {
        this._tile = tile;
    }

    public updateSprites() {
        this.log('updateSprites');

        this.updateTileItemRender();
    }

    public updateTileItemRender() {
        const tileItemRender = this._tileItemRender
        //const tile = this._tile

        if(tileItemRender)
        {
            const os = TileItemRender.valuesFromDirection(this._direction)

            const changeLayer = this.direction == Direction.NORTH || this.direction == Direction.WEST

            tileItemRender.setPosition(this.position.x, this.position.y);
            tileItemRender.setRotation(os[0], os[1]);
            tileItemRender.setLayer(this._tileItemSpriteIndex.x, this._tileItemSpriteIndex.y + (changeLayer ? 1 : 0));
            tileItemRender.setCollisionEnabled(this._collisionEnabled);
        }
    }

    public updateSpritesLayer() {
        const scene = this.scene;

        this.log('updateSpritesLayer');

        let layer = scene.layerObjects;
        if(this.tileItemInfo.type == TileItemType.FLOOR) layer = scene.layerFloor;

        this.tileItemRender.getSprites().map(sprite =>
        {
            if(sprite.image) layer.add(sprite.image)
            if(sprite.collisionSprite) layer.add(sprite.collisionSprite)
        })
    }

    public setDirection(direction: Direction) {
        const tileItem = this;
        const tileMap = this.tile.tileMap;
        const tile = tileItem.tile;
        const canBePlaced = this.world.canTileItemBePlacedAtTile(tileItem, tile, direction)

        if(!canBePlaced) return false
        
        const gridItem = tileMap.grid.getItem(tileItem.id)
        const o = TileItemRender.valuesFromDirection(direction)

        gridItem.setChangeRotation(o[0])
        gridItem.setFlipCells(o[1])

        tileItem.setVisualsDirection(direction);

        return true;
    }

    public rotate() {
        const tileMap = this.tile.tileMap;
        const rotationMap = this.getAvaliableRotations();
        const avaliable = rotationMap.filter(d => this.world.canTileItemRotateTo(this, d));
        const nextDirection = this.getNextRotation(avaliable);

        this.setDirection(nextDirection);
    }

    public getAvaliableRotations() {
        const rotationMap = [0, 2, 1, 3];

        if(this.tileItemInfo.rotationType == TileItemRotationType.SIDE_ONLY) {
            rotationMap.splice(rotationMap.indexOf(0), 1)    
            rotationMap.splice(rotationMap.indexOf(3), 1)    
        }

        return rotationMap;
    }

    public getNextRotation(rotationMap: number[]) {
        let index = rotationMap.indexOf(this._direction);

        index++;
        if(index >= rotationMap.length) index = 0;
        return rotationMap[index];
    }

    public setVisualsDirection(direction: Direction) {
        this._direction = direction;
        this.updateSprites();
    }

    public setTransparent(value: boolean) {
        this.tileItemRender?.setTransparent(value);
        //this.updateSprites();
    }

    public onPointerDown(): void {
        super.onPointerDown();

        this.rotate();
    }

    public serializeTileItem(): TileItemData {
        return {
            id: this.id,
            tileItemId: this.tileItemInfo.id,
            direction: this.direction
        }
    }
}