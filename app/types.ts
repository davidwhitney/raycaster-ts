export class Resolution {
    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}

export type Move = { deltaX: number, deltaY: number };

export interface IPhysicalEntity {
    readonly dimensions: IDimension;
}

export interface IDimension {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
};

export class Dimension implements IDimension {
    public minX: number;
    public maxX: number;
    public minY: number;
    public maxY: number;

    constructor(location: Location, size: Size) {
        this.minX = location.x;
        this.maxX = location.x + size.width;
        this.minY = location.y;
        this.maxY = location.y + size.height;
    }
}


export interface Location {
    x: number,
    y: number
};

export type Size = {
    width: number,
    height: number
};

export class Location2D implements Location {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public FlipXY(): Location2D {
        return new Location2D(this.y, this.x);
    }
};

export type SurfaceType = "WALL" | "PLAYER" | "NOTHING";

export class Surface {
    Height: number;
    Type: SurfaceType = "WALL";

    HasNoHeight(): boolean { return this.Height <= 0; };
    IsNotFullHeight(): boolean { return this.Height < 1; };

    constructor(height: number, type: SurfaceType = "WALL") {
        this.Height = height
        this.Type = type;
    }

    public static Nothing: Surface = new Surface(0, "NOTHING");
}

export class RaySamplePoint {
    public Location: Location2D;
    public Length: number;
    public DistanceTraveled: number;
    public Surface: Surface;

    constructor(location2D: Location2D, length: number = 0, distanceTraveled: number = 0) {
        this.Location = location2D;
        this.Length = length;
        this.DistanceTraveled = distanceTraveled;
        this.Surface = Surface.Nothing;
    }
}

export class CastDirection {
    public Sin: number;
    public Cos: number;

    constructor(angle: number) {
        this.Sin = Math.sin(angle);
        this.Cos = Math.cos(angle);
    }
}

export class Rgba32 {
    r: number;
    g: number;
    b: number;
    a: number = 1;

    constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}
