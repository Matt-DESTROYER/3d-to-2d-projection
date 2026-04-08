import { GameObject } from "./game-object.mjs"

export class Camera extends GameObject {
	constructor(pos, fov) {
		super(pos, [], []);
		this.fov = fov;
	}

	x(value = null) {
		return this.pos.x(value);
	}
	y(value = null) {
		return this.pos.y(value);
	}
	z(value = null) {
		return this.pos.z(value);
	}

	rotate(x, y, z) {
		if (typeof x !== "number") {
			throw new TypeError("Expected argument `x` to be of type `number`");
		}
		if (typeof y !== "number") {
			throw new TypeError("Expected argument `y` to be of type `number`");
		}
		if (typeof z !== "number") {
			throw new TypeError("Expected argument `z` to be of type `number`");
		}

		this.rot.mat.set(0, 0, this.rot.x() + x);
		this.rot.mat.set(1, 0, this.rot.y() + y);
		this.rot.mat.set(2, 0, this.rot.z() + z);

		return this;
	}

	render(ctx, camera) {}
}
