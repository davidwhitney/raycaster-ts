import { CastDirection, Location2D, RaySamplePoint, Resolution, Surface } from "./types";

export class Camera {
    public World: string[];
    public MaxCameraRange: number;
    public location: Location2D;

    private _resolution: Resolution;
    private _directionInDegrees: number = 0;

    public get directionInDegrees(): number { return this._directionInDegrees; }
    public set directionInDegrees(value) { this._directionInDegrees = value % 360; }

    constructor(location: Location2D, resolution: Resolution, world: string[], range: number = 50, focalLength: number = 0.8) {
        this.location = location;
        this.World = world;
        this.MaxCameraRange = range;
        this._resolution = resolution;
    }

    Snapshot(): RaySamplePoint[] {
        var result: RaySamplePoint[] = [];

        for (var column = 0; column < this._resolution.width; column++) {
            var x = column / this._resolution.width - 0.5;

            var startPoint = new RaySamplePoint(this.location);
            var castDirection = this.ComputeDirection(this._directionInDegrees, x);
            var ray = this.Raycast(startPoint, castDirection);

            result[column] = ray[ray.length - 1];
        }

        return result;
    }

    Raycast(origin: RaySamplePoint, castDirection: CastDirection): RaySamplePoint[] {
        var rayPath: RaySamplePoint[] = [];
        var currentStep = origin;

        while (true) {
            rayPath.push(currentStep);

            var stepX = this.NextStepOnTheLine(
                castDirection.Sin,
                castDirection.Cos,
                currentStep.Location.x,
                currentStep.Location.y);

            var stepY = this.NextStepOnTheLine(castDirection.Cos,
                castDirection.Sin,
                currentStep.Location.y,
                currentStep.Location.x,
                true);

            var shortestStep = stepX.Length < stepY.Length
                ? this.Inspect(stepX, 1, 0, currentStep.DistanceTraveled, castDirection)
                : this.Inspect(stepY, 0, 1, currentStep.DistanceTraveled, castDirection);


            if (shortestStep.Surface.HasNoHeight()) {
                currentStep = shortestStep;
                continue;
            }

            if (shortestStep.DistanceTraveled > this.MaxCameraRange) {
                return rayPath;
            }

            rayPath.push(shortestStep);
            return rayPath;
        }
    }

    NextStepOnTheLine(rise: number, run: number, firstValue: number, secondValue: number, inverted: boolean = false): RaySamplePoint {
        var steppedFirst = run > 0 ? Math.floor(firstValue + 1) - firstValue : Math.ceil(firstValue - 1) - firstValue;
        var steppedSecond = steppedFirst * (rise / run);

        var length = steppedFirst * steppedFirst + steppedSecond * steppedSecond;
        var location2D = new Location2D(firstValue + steppedFirst, secondValue + steppedSecond);
        location2D = inverted ? location2D.FlipXY() : location2D;

        return new RaySamplePoint(location2D, length);
    }

    SurfaceAt(x: number, y: number): Surface {
        const yContents = this.World[y];
        if (!yContents) {
            return Surface.Nothing;
        }

        var glyph = yContents[x];
        return glyph == '#'
            ? new Surface(1)
            : Surface.Nothing;
    }

    DetectSurface(xDouble: number, yDouble: number): Surface {
        var x = Math.floor(xDouble);
        var y = Math.floor(yDouble);
        return this.SurfaceAt(x, y);
    }

    Inspect(step: RaySamplePoint, shiftX: number, shiftY: number, distanceTraveled: number, castDirection: CastDirection): RaySamplePoint {
        var dx = castDirection.Cos < 0 ? shiftX : 0;
        var dy = castDirection.Sin < 0 ? shiftY : 0;

        step.Surface = this.DetectSurface(step.Location.x - dx, step.Location.y - dy);
        step.DistanceTraveled = distanceTraveled + Math.sqrt(step.Length);
        return step;
    }


    ComputeDirection(directionDegrees: number, angle: number): CastDirection {
        var radians = Math.PI / 180 * directionDegrees;
        var directionInDegrees: number = radians + angle;
        return new CastDirection(directionInDegrees);
    }
}