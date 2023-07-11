import { SpriteSheetOrganizer } from "../../spriteSheetOrganizer"
import { Tile } from "./tile"

interface Frame
{
    x: number
    y: number
    layerX: number
    layerY: number
    cropRect: Phaser.Geom.Rectangle
    imageData: ImageData
    position: Phaser.Math.Vector2
}

export class TileTextureGenerator
{
    private static _scene?: Phaser.Scene
    private static _baseTexture?: Phaser.Textures.Texture
    private static _baseCanvas?: Phaser.Textures.CanvasTexture
    private static _generatedTexureKey: string = ""
    private static _size = new Phaser.Math.Vector2(0, 0)
    private static _totalLayers = new Phaser.Math.Vector2(0, 0)
    private static _originTilePosition = new Phaser.Math.Vector2(0, 0)

    private static _frames: Frame[] = []

    public static create(scene: Phaser.Scene, textureKey: string, generatedTextureKey: string, originTilePosition: Phaser.Math.Vector2, size: Phaser.Math.Vector2, totalLayers: Phaser.Math.Vector2): Phaser.Textures.CanvasTexture
    {
        this.setup(scene, textureKey, generatedTextureKey, originTilePosition, size, totalLayers)

        const rectSize = this.getRectSize()

        const iconImageData = this.getImageData(
            0,
            0,
            rectSize.width,
            rectSize.height
        )

        const iconCanvas = scene.textures.createCanvas(`${generatedTextureKey}_icon`, rectSize.width, rectSize.height)
        iconCanvas.putData(iconImageData, 0, 0)
        iconCanvas.refresh()

        for (let layerY = 0; layerY < totalLayers.y; layerY++)
        {
            for (let layerX = 0; layerX < totalLayers.x; layerX++)
            {
                for (let y = 0; y < size.y; y++)
                {
                    for (let x = 0; x < size.x; x++)
                    {
                        if(!this.canTileBeCut(x, y)) continue

                        const cropRect = this.getCropRect(x, y)

                        cropRect.x += layerX * rectSize.width
                        cropRect.y += layerY * rectSize.height

                        const imageData = this.getImageData(
                            cropRect.x,
                            cropRect.y,
                            cropRect.width,
                            cropRect.height
                        )

                        if(true)
                        {
                            this._baseCanvas!.clear(
                                cropRect.x,
                                cropRect.y,
                                cropRect.width,
                                cropRect.height
                            )
                        }
                        
                        const frame: Frame = {
                            x: x,
                            y: y,
                            layerX: layerX,
                            layerY: layerY,
                            cropRect: cropRect,
                            imageData: imageData,
                            position: new Phaser.Math.Vector2()
                        }

                        this._frames.push(frame)
                    }
                }
            }
        }

        const sheet = new SpriteSheetOrganizer()
        
        this._frames.map((frame, index) =>
        {
            sheet.addItem(`${index}`, frame.cropRect.width, frame.cropRect.height)
        })

        sheet.organize()

        const canvas = this._scene!.textures.createCanvas(this._generatedTexureKey, sheet.width, sheet.height)
        //canvas.context.fillStyle = "red"
        //canvas.context.fillRect(0, 0, canvas.width, canvas.height)
        canvas.refresh()
        canvas.setFilter(Phaser.Textures.FilterMode.LINEAR)
        //canvas.setFilter(Phaser.Textures.FilterMode.NEAREST)
        canvas.add(`MAIN`, 0, 0, 0, canvas.width, canvas.height)

        this._frames.map((frame, index) =>
        {
            const position = sheet.getItemPosition(`${index}`)

            canvas.putData(frame.imageData, position.x, position.y)
            canvas.add(`${frame.layerX}:${frame.layerY}:${frame.x}:${frame.y}`, 0, position.x, position.y, frame.cropRect.width, frame.cropRect.height)
        })

        canvas.refresh()

        this.destroy()
        this._frames = []

        return canvas
    }

    private static setup(scene: Phaser.Scene, textureKey: string, generatedTextureKey: string, originTilePosition: Phaser.Math.Vector2, size: Phaser.Math.Vector2, totalLayers: Phaser.Math.Vector2): void
    {
        const manager = scene.textures
        const texture = manager.get(textureKey)
        const src = texture.getSourceImage() as HTMLImageElement
        const canvas = manager.createCanvas('_TileTextureGenerator_BaseCanvas', src.width, src.height);
  
        canvas.draw(0, 0, src);

        this._scene = scene
        this._baseTexture = texture
        this._baseCanvas = canvas
        this._generatedTexureKey = generatedTextureKey
        this._size = size
        this._totalLayers = totalLayers
        this._originTilePosition = originTilePosition
    }

    private static canTileBeCut(x: number, y: number): boolean
    {
        const size = this._size!

        if(size.x != 1 && size.y != 1)
        {
            if(y != size.y-1 && x != size.x-1) return false
        }

        return true
    }

    private static getImageData(x: number, y: number, width: number, height: number): ImageData
    {
        const canvas = this._baseCanvas!
        const imageData = canvas.getContext().getImageData(x, y, width, height)
        
        return imageData
    }

    private static getOffset()
    {
        const bounds = this.getBounds()
        const rectSize = this.getRectSize()

        const offset = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        }

        offset.left = this._originTilePosition.x + bounds.left
        offset.right = (rectSize.width - bounds.width) - offset.left - 1
        offset.top = this._originTilePosition.y
        offset.bottom = (rectSize.height - bounds.height) - offset.top - 1

        return offset
    }

    private static getBounds(): Phaser.Geom.Rectangle
    {
        const size = this._size!

        return Tile.getTileGridBounds(size.x, size.y)
    }

    private static getCropRect(x: number, y: number): Phaser.Geom.Rectangle
    {
        const rectSize = this.getRectSize()
        const size = this._size!

        const bounds = this.getBounds()

        const originTilePosition = this._originTilePosition

        //const image = this.getImage()

        const offset = this.getOffset()
        
        const cropRect = new Phaser.Geom.Rectangle(
            (originTilePosition.x - Math.floor(Tile.SIZE.x / 2) + 1) + Tile.getTilePosition(x, y).x,
            0, //originTilePosition.y
            Tile.SIZE.x,
            rectSize.height - offset.bottom - bounds.height + Tile.getTilePosition(x, y).y + Tile.SIZE.y - 1

        )

        return cropRect
    }

    private static getImage(): HTMLImageElement
    {
        return this._baseTexture!.getSourceImage() as HTMLImageElement 
    }

    private static getRectSize(): Phaser.Geom.Rectangle
    {
        const totalLayers = this._totalLayers
        const image = this.getImage()

        return new Phaser.Geom.Rectangle(0, 0, image.width / totalLayers.x, image.height / totalLayers.y)
    }

    private static destroy()
    {
        this._baseCanvas?.destroy()
    }
}