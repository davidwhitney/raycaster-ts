import { GameEntity } from "./GameEntity";
import { WorldContents } from "./WorldContents";

export class World {
    public contents: WorldContents;
    public geometry: string[];
    public geometryUpdating: boolean = false;

    constructor(locations: Array<GameEntity> = []) {
        this.contents = new WorldContents(locations);
    }

    public setContents(lines: string): World {
        this.geometryUpdating = true;
        this.geometry = lines.split("\n");
        this.geometryUpdating = false;
        return this;
    }
}