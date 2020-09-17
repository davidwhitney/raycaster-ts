import { CastDirection, Location2D, RaySamplePoint, Surface } from "./types";

export class RayCaster {
    World: any;
    MaxCameraRange: any;

    constructor(world: string[], maxCameraRange: number) {
        this.World = world;
        this.MaxCameraRange = maxCameraRange;
    }

    CastRays(origin: Location2D, renderWidth: number, directionInDegrees: number = 0): RaySamplePoint[] {
        var result: RaySamplePoint[] = [];

        for (var column = 0; column < renderWidth; column++) {
            var x = column / renderWidth - 0.5;

            var startPoint = new RaySamplePoint(origin);
            var castDirection = this.ComputeDirection(directionInDegrees, x);
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
                currentStep.Location.X,
                currentStep.Location.Y);

            var stepY = this.NextStepOnTheLine(castDirection.Cos,
                castDirection.Sin,
                currentStep.Location.Y,
                currentStep.Location.X,
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

        step.Surface = this.DetectSurface(step.Location.X - dx, step.Location.Y - dy);
        step.DistanceTraveled = distanceTraveled + Math.sqrt(step.Length);
        return step;
    }


    ComputeDirection(directionDegrees: number, angle: number): CastDirection {
        var radians = Math.PI / 180 * directionDegrees;
        var directionInDegrees: number = radians + angle;
        return new CastDirection(directionInDegrees);
    }
}