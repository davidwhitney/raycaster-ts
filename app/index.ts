import { CanvasRenderer } from "./CanvasRenderer";
import { Location2D, Resolution, Rgba32 } from "./types";
import { Camera } from "./Camera";

const mapElement = <HTMLTextAreaElement>document.getElementById("map");
const mapLines = mapElement.value.split("\n");

const resolution = new Resolution(1024, 768);
const camera = new Camera(new Location2D(10, 7), resolution, mapLines);
const renderer = new CanvasRenderer("renderTarget", resolution, camera.MaxCameraRange);

let updatingMap: boolean = false;

mapElement.addEventListener("keypress", (evt) => {
    updatingMap = true;
    camera.World = mapElement.value.split("\n");
    updatingMap = false;
});

document.addEventListener("keypress", (evt) => {
    var degrees = camera.directionInDegrees;
    const moveSpeed = 0.45;
    const turnSpeed = 2.5;

    var x = Math.cos(degrees * Math.PI / 180) * moveSpeed;
    var y = Math.sin(degrees * Math.PI / 180) * moveSpeed;

    switch (evt.key) {
        case "up":
        case "w":
            camera.location = new Location2D(camera.location.x + x, camera.location.y + y);
            break;
        case "down":
        case "s":
            camera.location = new Location2D(camera.location.x - x, camera.location.y - y);
            break;
        case "left":
        case "a":
            camera.directionInDegrees -= turnSpeed;
            break;
        case "right":
        case "d":
            camera.directionInDegrees += turnSpeed;
            break;
    }
});

function step(timestamp: number) {
    if (!updatingMap) {
        const state = camera.Snapshot();
        renderer.render(state);
    }

    window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);