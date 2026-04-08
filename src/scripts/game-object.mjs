import { Matrix } from "./matrix.mjs"

export class Point {
	constructor(x, y, z) {
		this.mat = new Matrix([
			[ x ],
			[ y ],
			[ z ]
		]);
	}

	x(value = null) {
		if (value)
			this.mat.set(0, 0, value);

		return this.mat.at(0, 0);
	}
	y(value = null) {
		if (value)
			this.mat.set(1, 0, value);

		return this.mat.at(1, 0);
	}
	z(value = null) {
		if (value)
			this.mat.set(2, 0, value);

		return this.mat.at(2, 0);
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

		this.mat = new Matrix([
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

		this.mat = new Matrix([
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

		this.mat = new Matrix([
			[ Math.cos(angle), -Math.sin(angle), 0 ],
			[ Math.sin(angle),  Math.cos(angle), 0 ],
			[               0,                0, 1 ]
		]).multiply(this.mat);

		return this;
	}
	rot(point) {
		if (!(point instanceof Point)) {
			throw new TypeError("Expected argument `point` to be of type `Point`");
		}

		this
			.rotX(point.x())
			.rotY(point.y())
			.rotZ(point.z());

		return this;
	}
}

export class GameObject {
	constructor(pos, vertices, edges) {
		if (!(pos instanceof Point)) {
			throw new TypeError("Expected argument `pos` to be of type `Point`");
		}
		if (!Array.isArray(vertices)) {
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

	move(x, y, z) {
		if (typeof x !== "number") {
			throw new TypeError("Expected argument `x` to be of type `number`");
		}
		if (typeof y !== "number") {
			throw new TypeError("Expected argument `y` to be of type `number`");
		}
		if (typeof z !== "number") {
			throw new TypeError("Expected argument `z` to be of type `number`");
		}

		let local_movement = new Point(x, y, z);
		local_movement.rot(this.rot);
		this.pos.translate(local_movement);

		return this;
	}

	render(ctx, camera) {
		if (!(ctx instanceof CanvasRenderingContext2D)) {
			throw new TypeError("Expected argument `ctx` to be of type `CanvasRenderingContext2D`");
		}
		if (!(camera instanceof GameObject)) {
			throw new TypeError("Expected argument `camera` to be of type `GameObject`");
		}

		let neg_cam_pos = camera.pos.clone().negate();
		let neg_cam_rot = camera.rot.clone().negate();

		ctx.strokeStyle = "#000000"
		ctx.lineWidth = 2;
		ctx.lineJoin = "miter";

		const cx = ctx.canvas.width / 2;
		const cy = ctx.canvas.height / 2;

		ctx.beginPath();
		for (const [from, to] of this.edges) {
			let from_pos = this.vertices[from].clone();
			let to_pos   = this.vertices[to].clone();

			from_pos.rot(this.rot).translate(this.pos);
			to_pos.rot(this.rot).translate(this.pos);

			from_pos.translate(neg_cam_pos)
				.rotZ(neg_cam_rot.z())
				.rotY(neg_cam_rot.y())
				.rotX(neg_cam_rot.x());
			to_pos.translate(neg_cam_pos)
				.rotZ(neg_cam_rot.z())
				.rotY(neg_cam_rot.y())
				.rotX(neg_cam_rot.x());

			if (from_pos.z() <= 0 || to_pos.z() <= 0) {
				continue;
			}

			let screen_x_from = (from_pos.x() / from_pos.z()) * camera.fov + cx;
			let screen_y_from = (from_pos.y() / from_pos.z()) * camera.fov + cy;
			let screen_x_to   = (to_pos.x() / to_pos.z()) * camera.fov + cx;
			let screen_y_to   = (to_pos.y() / to_pos.z()) * camera.fov + cy;

			ctx.moveTo(screen_x_from, screen_y_from);
			ctx.lineTo(screen_x_to, screen_y_to);
		}
		ctx.stroke();
		ctx.closePath();
	}
}
