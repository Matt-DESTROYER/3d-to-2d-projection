import { Point, GameObject } from "./game-object.mjs"

const canvas = document.createElement("canvas");

const FOV = 90;

function resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

class Game {
	constructor(input, camera, gameobjects, ctx) {
		this.previous_frame = 0;

		this.input = input;
		this.camera = camera;
		this.gameobjects = gameobjects;
		this.ctx = ctx;
	}

	#loop() {
		const current_frame = performance.now();
		const delta_time = current_frame - this.previous_frame;

		this.update(delta_time);
		this.render();

		window.requestAnimationFrame(() => this.#loop());
	}
	start() {
		window.requestAnimationFrame(() => this.#loop());
	}

	update(delta_time) {
		if (this.input.forward) {
			this.camera.x(this.camera.x() + 0.5 * delta_time);
		}
		if (this.input.backward) {
			this.camera.x(this.camera.x() - 0.5 * delta_time);
		}
		if (this.input.left) {
			this.camera.z(this.camera.z() + 0.5 * delta_time);
		}
		if (this.input.right) {
			this.camera.z(this.camera.z() + 0.5 * delta_time);
		}
		if (this.input.up) {
			this.camera.y(this.camera.y() + 0.5 * delta_time);
		}
		if (this.input.down) {
			this.camera.y(this.camera.y() - 0.5 * delta_time);
		}
	}
	render() {
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

		for (const gameobject of this.gameobjects) {
			gameobject.render(this.ctx, this.camera, FOV);
		}
	}
}

async function main() {
	resize();
	window.addEventListener("resize", resize);
	document.body.appendChild(canvas);

	const input = Object.seal({
		forward: false,
		backward: false,
		left: false,
		right: false,
		up: false,
		down: false
	});
	window.addEventListener("keydown", (event) => {
		switch (event.code) {
			case "KeyW":
				input.forward = true;
				break;
			case "KeyS":
				input.backward = true;
				break;
			case "KeyA":
				input.left = true;
				break;
			case "KeyD":
				input.right = true;
				break;
			case "KeyE":
			case "Space":
				input.up = true;
				break;
			case "KeyQ":
			case "ShiftLeft":
				input.down = true;
				break;
		}
	});
	window.addEventListener("keyup", (event) => {
		switch (event.code) {
			case "KeyW":
				input.forward = false;
				break;
			case "KeyS":
				input.backward = false;
				break;
			case "KeyA":
				input.left = false;
				break;
			case "KeyD":
				input.right = false;
				break;
			case "KeyE":
			case "Space":
				input.up = false;
				break;
			case "KeyQ":
			case "ShiftLeft":
				input.down = false;
				break;
		}
	});
	
	const camera = new GameObject(new Point(0, 0, 0), [], []);
	const gameobjects = [];
	
	const cube = new GameObject(new Point(0, 0, 5), [
		new Point(-1, -1, -1),
		new Point(-1, -1, 1),
		new Point(1, -1, 1),
		new Point(1, -1, -1),
		new Point(-1, 1, -1),
		new Point(-1, 1, 1),
		new Point(1, 1, 1),
		new Point(1, 1, -1)
	], [
		// top square
		[0, 1],
		[1, 2],
		[2, 3],
		[3, 0],
		// bottom square
		[4, 5],
		[5, 6],
		[6, 7],
		[7, 4],
		// connections
		[0, 4],
		[1, 5],
		[2, 6],
		[3, 7]
	]);
	gameobjects.push(cube);

	const ctx = canvas.getContext("2d");

	const game = new Game(input, camera, gameobjects, ctx);

	game.start();
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", main, { once: true });
} else {
	main();
}
