import { Grid } from "./grid"
import { Item } from "./item"

export class Cell {
    public readonly x: number;
    public readonly y: number;
    public readonly grid: Grid;

    public ocuppiedByItems: Item[] = [];
    
    public items: Item[] = [];

    public get id() { return `${this.x}:${this.y}`; }

    constructor(grid: Grid, x: number, y: number) {
        this.grid = grid;
        this.x = x;
        this.y = y;
    }

    public addItem(item: Item) {
        this.items.push(item);
    }

    public removeItem(item: Item) {
        this.items.splice(this.items.indexOf(item), 1);
    }
}