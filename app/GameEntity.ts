import { Dimension, IDimension, IPhysicalEntity, Move, Size, Location } from "./types";

export abstract class GameEntity implements IPhysicalEntity {
    public location: Location;
    public size: Size;
    public destroyed: boolean;

    constructor(location: Location) {
        this.location = location;
        this.size = { width: 1, height: 1 };
        this.destroyed = false;
    }

    public move(delta: Move): void {
        this.location.x += delta.deltaX;
        this.location.y += delta.deltaY;
    }

    public get dimensions(): IDimension {
        return {
            minX: this.location.x,
            maxX: this.location.x + this.size.width,
            minY: this.location.y,
            maxY: this.location.y + this.size.height
        };
    }
}

export class PhysicalEntity extends GameEntity {
    constructor(location: Location) {
        super(location);
    }
}