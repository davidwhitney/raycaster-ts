import { BitmapRenderer } from "./BitmapRenderer";
import { Location2D, Rgba32 } from "./types";
import { RayCaster } from "./RayCaster";

const World = [
    "########################################",
    "#                                      #",
    "#                                      #",
    "#                      ###             #",
    "#                      ###             #",
    "#                      ###             #",
    "#                                      #",
    "#                                      #",
    "#                                      #",
    "#                      ###             #",
    "#                      ###             #",
    "#                                      #",
    "########################################",
];

const rayCaster = new RayCaster(World, 50);
const cameraLocation: Location2D = new Location2D(10, 7);
const columns = rayCaster.CastRays(cameraLocation, 1024);

const bmpRenderer = new BitmapRenderer(1024, 768, 50);
const bitmap = bmpRenderer.RenderBitmap(columns);

const canvas = <HTMLCanvasElement>document.getElementById("renderTarget");
const context2D = <CanvasRenderingContext2D>canvas.getContext("2d");

for (let x = 0; x < bitmap.length; x++) {
    for (let y = 0; y < bitmap[x].length; y++) {

        const rgba = bitmap[x][y] || new Rgba32(255, 255, 255);
        context2D.fillStyle = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, 1)`;
        context2D.fillRect(x, y, 1, 1);
    }
}