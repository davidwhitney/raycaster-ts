import { RaySamplePoint, Rgba32 } from "./types";

export class BitmapRenderer {
    _range: number;
    ImageHeight: number;
    ImageWidth: number;

    constructor(imageWidth: number, imageHeight: number, range: number) {
        this._range = range;
        this.ImageHeight = imageHeight;
        this.ImageWidth = imageWidth;
    }

    RenderBitmap(columnData: RaySamplePoint[]): Rgba32[][] {
        var pixels: Rgba32[][] = [];

        for (let i = 0; i < this.ImageWidth; i++) {
            pixels.push([]);
        }

        for (let c of pixels) {
            c.fill(new Rgba32(0, 0, 0), 0, this.ImageHeight);
        }

        for (var column = 0; column < columnData.length; column++) {
            var samplePoint = columnData[column];
            var maxPossibleHeight = this.ImageHeight * samplePoint.Surface.Height;
            var height = maxPossibleHeight / (samplePoint.DistanceTraveled / 2.5);

            var verticalPadding = Math.floor((this.ImageHeight - height) / 2);

            var texture = this.SelectTexture(samplePoint);

            for (var y = verticalPadding; y < this.ImageHeight - verticalPadding; y++) {
                pixels[column][y] = texture;
            }
        }

        return pixels;
    }

    SelectTexture(samplePoint: RaySamplePoint): Rgba32 {
        var percentage = (samplePoint.DistanceTraveled / this._range) * 100;
        var brightness = 200 - ((200.00 / 100) * percentage);

        return new Rgba32(brightness, brightness, brightness);
    }
}
