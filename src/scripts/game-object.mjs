import { Matrix } from "./matrix.mjs"

export class Point {
	constructor(x, y, z) {
		this.mat = new Matrix(3, 1);
		this.mat.set(0, 0, x);
		this.mat.set(1, 0, y);
		this.mat.set(2, 0, z);
	}

	clone() {
		return new Point(
			this.mat.at(0, 0),
			this.mat.at(1, 0),
			this.mat.at(2, 0)
		);
	}

	translate(point) {
		if (!(point instanceof Point)) {
			throw new TypeError("Expected argument `point` to be of type `Point`");
		}

		this.mat.set(0, 0, this.mat.at(0, 0) + point.mat.at(0, 0));
		this.mat.set(1, 0, this.mat.at(1, 0) + point.mat.at(1, 0));
		this.mat.set(2, 0, this.mat.at(2, 0) + point.mat.at(2, 0));

		return this;
	}
	negate() {
		this.mat.set(0, 0, -this.mat.at(0, 0));
		this.mat.set(1, 0, -this.mat.at(1, 0));
		this.mat.set(2, 0, -this.mat.at(2, 0));

		return this;
	}

	rotX(angle) {
		if (typeof angle !== "number") {
			throw new TypeError("Expected argument `angle` to be of type `number`");
		}

		this.mat = new Matrix(3, 1, [
			[ 1,               0,                0 ],
			[ 0, Math.cos(angle), -Math.sin(angle) ],
			[ 0, Math.sin(angle),  Math.cos(angle) ]
		]).multiply(this.mat);

		return this;
	}
	rotY(angle) {
		if (typeof angle !== "number") {
			throw new TypeError("Expected argument `angle` to be of type `number`");
		}

		this.mat = new Matrix(3, 1, [
			[ Math.cos(angle), 0, -Math.sin(angle) ],
			[               0, 1,                0 ],
			[ Math.sin(angle), 0,  Math.cos(angle) ]
		]).multiply(this.mat);

		return this;
	}
	rotZ(angle) {
		if (typeof angle !== "number") {
			throw new TypeError("Expected argument `angle` to be of type `number`");
		}

		this.mat = new Matrix(3, 1, [
			[ Math.cos(angle), 0, -Math.sin(angle) ],
			[ Math.sin(angle), 0,  Math.cos(angle) ],
			[               0, 0,                1 ]
		]).multiply(this.mat);

		return this;
	}
	rot(point) {
		if (!(point instanceof Point)) {
			throw new TypeError("Expected argument `point` to be of type `Point`");
		}

		this
			.rotX(point.rot.z)
			.rotY(point.rot.y)
			.rotZ(point.rot.x);

		return this;
	}
}

export class GameObject {
	constructor(pos, vertices, edges) {
		if (!(pos instanceof Point)) {
			throw new TypeError("Expected argument `pos` to be of type `Point`");
		}
		if (!Array.isArray(points)) {
			throw new TypeError("Expected argument `vertices` to be of type `Array<Point>`");
		}
		if (!Array.isArray(edges)) {
			throw new TypeError("Expected argument `edges` to be of type `Array<Array<number>>`");
		}

		this.pos = pos;
		this.vertices = vertices;
		this.edges = edges;
		this.rot = new Point(0, 0, 0);
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

		this.rot.x += x;
		this.rot.y += y;
		this.rot.z += z;

		return this;
	}

	render(ctx, camera) {
		if (!(ctx instanceof CanvasRenderingContext2D)) {
			throw new TypeError("Expected argument `ctx` to be of type `CanvasRenderingContext2D`");
		}
		if (!(camera instanceof GameObject)) {
			throw new TypeError("Expected argument `camera` to be of type `GameObject`");
		}

		let pos = this.pos.clone();
		let neg_cam = camera.clone().negate();
		pos.translate(neg_cam);
		pos.multiply(
			pos
				.clone()
				.rot(neg_cam)
		);


	}
}
