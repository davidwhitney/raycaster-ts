import { Dimension, IDimension } from "./types";
import { GameEntity } from "./GameEntity";

export class WorldContents {
    public locations: Array<GameEntity>;
    constructor(locations: Array<GameEntity>) {
        this.locations = locations;
    }

    public allEntitesAt(x: number, y: number): Array<GameEntity> {
        return this.locations.filter(loc => this.inGridLoation(loc?.dimensions, x, y));
    }

    private inGridLoation(other: Dimension, x: number, y: number): boolean {
        if (!other) { return false; }

        if (this.isBetween(x, other.minX, other.maxX)
            && this.isBetween(y, other.minY, other.maxY)) {
            return true;
        }

        return false;
    }

    isBetween(i: number, lower: number, upper: number) {
        return i >= lower && i < upper;
    }
}