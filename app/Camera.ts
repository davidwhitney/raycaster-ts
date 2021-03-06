import { CastDirection, Location2D, RaySamplePoint, Resolution, Surface, Location } from "./types";
import { World } from "./World";

export class Camera {
    public MaxCameraRange: number;
    public location: Location2D;

    private _world: World;
    private _resolution: Resolution;
    private _directionInDegrees: number = 0;
    private _focalLength: number;

    public get directionInDegrees(): number { return this._directionInDegrees; }
    public set directionInDegrees(value) { this._directionInDegrees = value % 360; }

    constructor(world: World, location: Location2D, resolution: Resolution, range: number = 50, focalLength: number = 0.8) {
        this._world = world;
        this.location = location;
        this.MaxCameraRange = range;
        this._resolution = resolution;
        this._focalLength = focalLength;
    }

    Snapshot(): RaySamplePoint[][] {
        var result: RaySamplePoint[][] = [];

        for (var column = 0; column < this._resolution.width; column++) {
            var x = column / this._resolution.width - 0.5;
            const angle = Math.atan2(x, this._focalLength);

            var startPoint = new RaySamplePoint(this.location);
            var castDirection = this.ComputeDirection(this._directionInDegrees, angle);
            var ray = this.Raycast(startPoint, castDirection);

            const onlyRaysWithHeight = ray.filter(r => r.Surface?.Height > 0);

            result[column] = onlyRaysWithHeight;
        }

        return result;
    }

    Raycast(origin: RaySamplePoint, castDirection: CastDirection): RaySamplePoint[] {
        var rayPath: RaySamplePoint[] = [];
        var currentStep = origin;

        let steps = 0;

        while (true) {
            steps++;
            if (steps > this.MaxCameraRange) {
                return rayPath;
            }

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


            if (shortestStep.Surface.IsNotFullHeight()) {
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

    DetectSurface(location: Location): Surface {

        const entityAtLoc = this._world.contents.allEntitesAt(location.x, location.y)[0];

        if (entityAtLoc) {
            return new Surface(0.5, "PLAYER");
        }

        // No entites, let's just find geometry from the game world.

        var x = Math.floor(location.x);
        var y = Math.floor(location.y);

        const yContents = this._world.geometry[y];
        if (!yContents) {
            return Surface.Nothing;
        }

        var glyph = yContents[x];

        if (glyph == "p") {
            const surface = new Surface(0.5);
            surface.Type = "PLAYER";
            return surface;
        }

        return glyph == '#'
            ? new Surface(1)
            : Surface.Nothing;
    }

    Inspect(step: RaySamplePoint, shiftX: number, shiftY: number, distanceTraveled: number, castDirection: CastDirection): RaySamplePoint {
        var dx = castDirection.Cos < 0 ? shiftX : 0;
        var dy = castDirection.Sin < 0 ? shiftY : 0;

        const location = {
            x: step.Location.x - dx,
            y: step.Location.y - dy
        };

        step.Surface = this.DetectSurface(location);
        step.DistanceTraveled = distanceTraveled + Math.sqrt(step.Length);
        return step;
    }


    ComputeDirection(directionDegrees: number, angle: number): CastDirection {
        var radians = Math.PI / 180 * directionDegrees;
        var directionInDegrees: number = radians + angle;
        return new CastDirection(directionInDegrees);
    }
}