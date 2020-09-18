import { CanvasRenderer } from "./CanvasRenderer";
import { Location2D, Resolution } from "./types";
import { Camera } from "./Camera";
import { World } from "./World";
import { PhysicalEntity } from "./GameEntity";

const mapElement = <HTMLTextAreaElement>document.getElementById("map");

const world = new World().setContents(mapElement.value);
world.contents.locations.push(new PhysicalEntity({ x: 16, y: 10 }));

const resolution = new Resolution(1024, 768);
const camera = new Camera(world, new Location2D(10, 7), resolution);
const renderer = new CanvasRenderer("renderTarget", resolution, camera.MaxCameraRange);

function moveCamera(evt: KeyboardEvent) {
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
}

function updateMap() {
    world.setContents(mapElement.value);
}

function renderToCanvas(timestamp: number) {
    if (!world.geometryUpdating) {
        const state = camera.Snapshot();
        renderer.render(state);
    }

    window.requestAnimationFrame(renderToCanvas);
}

mapElement.addEventListener("keyup", updateMap);
mapElement.addEventListener("keydown", updateMap);
document.addEventListener("keypress", moveCamera);
window.requestAnimationFrame(renderToCanvas);