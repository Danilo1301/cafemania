interface Item {
    key: string
    width: number
    height: number
    position: {x: number, y: number}
}

export class SpriteSheetOrganizer {
    private _items = new Map<string, Item>()

    private _sheetSize = {width: 0, height: 0}

    public get width(): number
    {
        return this._sheetSize.width
    }

    public get height(): number
    {
        return this._sheetSize.height
    }

    public addItem(key: string, width: number, height: number): void
    {
        const item: Item = {
            key: key,
            width:  width,
            height: height,
            position: {x: 0, y: 0}
        }

        this._items.set(item.key, item)
    }

    private getItems(): Item[]
    {
        return Array.from(this._items.values())
    }

    public getItemPosition(key: string): {x: number, y: number}
    {
        return this._items.get(key)!.position
    }

    public organize(): void
    {
        this._sheetSize.width = 0
        this._sheetSize.height = 0

        const items = this.getItems()

        const sheetSize = this._sheetSize

        const numItemsOnColumn = items.length <= 3 ? items.length : Math.ceil(Math.sqrt(items.length))

        let column = 0
        let row = 0

        let currentRowWidth = 0
        let currentRowHeight = 0

        items.map((item, index) =>
        {
            item.position.x = currentRowWidth
            item.position.y = sheetSize.height

            //console.log(`${row},${column} w${currentRowWidth}`)

            currentRowWidth += item.width
            row++

            if(sheetSize.width <= currentRowWidth) sheetSize.width = currentRowWidth
            if(currentRowHeight <= item.height) currentRowHeight = item.height

            if(row >= numItemsOnColumn || index == items.length-1)
            {
                sheetSize.height += currentRowHeight
            }

            if(row >= numItemsOnColumn)
            {
                currentRowWidth = 0
                currentRowHeight = 0
                row = 0
                column++
            }
            
        })
    }
}