import { GameObject } from "./game-object.mjs"

export class Camera extends GameObject {
	constructor(pos, fov) {
		super(pos, [], []);
		this.fov = fov;
	}
}
