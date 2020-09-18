import { RaySamplePoint, Resolution, Rgba32 } from "./types";

export class CanvasRenderer {
    private _range: number;
    private _target: HTMLCanvasElement;
    private _context2D: CanvasRenderingContext2D;
    private _resolution: Resolution;

    constructor(canvasId: string, resolution: Resolution, range: number) {
        this._range = range;
        this._resolution = resolution;

        this._target = <HTMLCanvasElement>document.getElementById(canvasId);
        this._context2D = <CanvasRenderingContext2D>this._target.getContext("2d");
    }

    render(columnData: RaySamplePoint[]): void {

        this._context2D.clearRect(0, 0, this._resolution.width, this._resolution.height);

        for (var x = 0; x < columnData.length; x++) {
            const samplePoint = columnData[x];
            const maxPossibleHeight = this._resolution.height * samplePoint.Surface.Height;
            const height = maxPossibleHeight / (samplePoint.DistanceTraveled / 2.5);

            const verticalPadding = Math.floor((this._resolution.height - height) / 2);
            const rgba = this.SelectTexture(samplePoint) || new Rgba32(255, 255, 255);

            this._context2D.fillStyle = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, 1)`;
            this._context2D.fillRect(x, verticalPadding, 1, height);

        }
    }

    SelectTexture(samplePoint: RaySamplePoint): Rgba32 {
        var percentage = (samplePoint.DistanceTraveled / this._range) * 100;
        var brightness = 200 - ((200.00 / 100) * percentage);
        return new Rgba32(brightness, brightness, brightness);
    }
}
