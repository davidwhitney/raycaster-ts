export class Resolution {
    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}

export class Location2D {
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

export class Surface {
    Height: number;
    HasNoHeight(): boolean { return this.Height <= 0; };
    public static Nothing: Surface = new Surface(0);

    constructor(height: number) {
        this.Height = height
    }
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

    constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}
