import { Cell } from "./cell"
import { Grid } from "./grid"

export class Item
{
    public name: string = "";

    public readonly id: string

    public readonly size: Phaser.Math.Vector2

    public color: number = 0

    private _cell: Cell

    private _flipCells: boolean = false
    private _changeRotation: boolean = false
  
    constructor(id: string, cell: Cell, size: Phaser.Math.Vector2)
    {
        this.id = id
        this.size = size
        this.color = Math.round(Math.random() * 16777215)
        this._cell = cell
        
        cell.addItem(this)
    }

    public get flipCells(): boolean
    {
        return this._flipCells
    }

    public get changeRotation(): boolean
    {
        return this._changeRotation
    }

    public getOriginCell(): Cell
    {
        return this._cell
    }

    public setChangeRotation(value: boolean): void
    {
        this._changeRotation = value

        this.getGrid().updateCells()
    }

    public setFlipCells(value: boolean): void
    {
        this._flipCells = value

        this.getGrid().updateCells()
    }

    public getGrid(): Grid
    {
        return this._cell.grid
    }
}