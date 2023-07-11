import { Cell } from "./cell"
import { Item } from "./item"

export class Grid {

    private _cells = new Map<string, Cell>()
    private _items = new Map<string, Item>()

    public getItem(id: string) {
        return this._items.get(id)!
    }

    public getCoordsItemOcuppes(cell: Cell, size: Phaser.Math.Vector2, changeRotation: boolean, flipCells: boolean) {
        const pos = Grid.getOffsetCoordsItemOcuppes(size, changeRotation, flipCells);
        const coords: Phaser.Math.Vector2[] = [];

        for (const p of pos) {
            //const coord = p[0]
            const newCoord = p[1];

            newCoord.x += cell.x;
            newCoord.y += cell.y;

            coords.push(newCoord);
        }

        return coords;
    }

    public static getOffsetCoordsItemOcuppes(itemSize: Phaser.Math.Vector2, changeRotation: boolean, flipCells: boolean) {
        const pos: Phaser.Math.Vector2[][] = []
        const size = new Phaser.Math.Vector2(itemSize.x, itemSize.y)

        if(changeRotation) {
            const oldx = size.x
            const oldy = size.y

            size.x = oldy
            size.y = oldx
        }

        for (let y = 0; y < size.y; y++) {
            for (let x = 0; x < size.x; x++) {
                const coord = new Phaser.Math.Vector2(x, y)
                const newCoord = new Phaser.Math.Vector2(x, y)

                if(itemSize.x < itemSize.y)
                {
                    if(changeRotation && !flipCells) newCoord.x -= (size.x-size.y)
                }

                if(flipCells)
                {
                    if(changeRotation)
                    {
                        if(itemSize.x > itemSize.y)
                        {
                            //flip
                            if(size.y > 1) newCoord.y -= size.y-1

                            //change origin
                            newCoord.y += (size.x-1)
                        }
                    }
                    else
                    {
                        if(itemSize.x > itemSize.y)
                        {
                            //flip
                            if(size.x > 1) newCoord.x -= size.x-1

                            //change origin
                            newCoord.x += (size.y-1)
                        }
                        else
                        {
                            //flip
                            if(size.y > 1) newCoord.y -= size.y-1

                            //change origin
                            newCoord.y += (size.x-1)
                        }
                    }
                }

                pos.push([coord, newCoord])
            }
        }

        //console.log(`Origin was changed from 0, 0 to ${pos[0][1].x}, ${pos[0][1].y}`)
        //console.log(pos)

        return pos
    }
  
    public canItemBePlaced(cell: Cell, size: Phaser.Math.Vector2, changeRotation: boolean, flipCells: boolean, compareFn: (compareCell: Cell, compareItem?: Item) => boolean) {
        const coords = this.getCoordsItemOcuppes(cell, size, changeRotation, flipCells)

        let canBePlaced = true

        coords.map(coord => {

            if(!this.hasCell(coord.x, coord.y))
            {
                canBePlaced = false
                return
            }

            const coordCell = this.getCell(coord.x, coord.y)

            let result = true
            
            //console.log(`at ${coord.x}, ${coord.y}`)

            for(const item of coordCell.ocuppiedByItems)
            {
                //console.log(`found item ${item.name}`, item)

                if(compareFn(coordCell, item) === false) result = false
            }

            if(result === false) canBePlaced = false
        })

        return canBePlaced
    }

    public addCell(x: number, y: number)
    {
        const cell = new Cell(this, x, y)

        this._cells.set(cell.id, cell)
        
        return cell
    }
    
    public getCell(x: number, y: number)
    {
        return this._cells.get(`${x}:${y}`)!
    }

    public hasCell(x: number, y: number)
    {
        return this._cells.has(`${x}:${y}`)
    }

    public addItem(id: string, x: number, y: number, size: Phaser.Math.Vector2): Item
    {
        const cell = this.getCell(x, y)

        const item = new Item(id, cell, size)

        this._items.set(item.id, item)

        this.updateCells()

        return item
    }

    public removeItem(id: string) {
        const item = this._items.get(id)!;

        item.getOriginCell().removeItem(item);

        this._items.delete(id);

        //console.log(this._items)

        this.updateCells()
    }

    public updateCells()
    {
        const cells = this.getCells()

        for (const cell of cells)
        {
            cell.ocuppiedByItems = []
        }

        for (const cell of cells)
        {
            if(cell.items.length == 0) continue

            for (const item of cell.items) {
                if(cell != item.getOriginCell()) continue

                const coords = this.getCoordsItemOcuppes(cell, item.size, item.changeRotation, item.flipCells)

                coords.map(coord =>
                {
                    const list = this.getCell(coord.x, coord.y).ocuppiedByItems;
                    
                    if(!list.includes(item)) list.push(item)
                })
            }


            

            //console.log(coords)
        }
    }

    public getCells()
    {
        return Array.from(this._cells.values())
    }
}