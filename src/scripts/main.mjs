import { Point, GameObject } from "./game-object.mjs"
import { wavefront_to_gameobject } from "./wavefront-object.mjs"

const canvas = document.createElement("canvas");

const FOV = 90;
const CAM_SPEED = 2;

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
		const delta_time = (current_frame - this.previous_frame) / 1000;

		this.update(delta_time);
		this.render();

		this.previous_frame = current_frame;
		window.requestAnimationFrame(() => this.#loop());
	}
	start() {
		window.requestAnimationFrame(() => this.#loop());
	}

	update(delta_time) {
		// input
		const movement_distance = CAM_SPEED * delta_time;

		if (this.input.move_forward) {
			this.camera.move(0, 0, movement_distance);
		}
		if (this.input.move_backward) {
			this.camera.move(0, 0, -movement_distance);
		}
		if (this.input.move_right) {
			this.camera.move(movement_distance, 0, 0);
		}
		if (this.input.move_left) {
			this.camera.move(-movement_distance, 0, 0);
		}
		if (this.input.move_down) {
			this.camera.y(this.camera.y() + movement_distance);
		}
		if (this.input.move_up) {
			this.camera.y(this.camera.y() - movement_distance);
		}

		if (this.input.rotate_up) {
			this.camera.rotate(movement_distance, 0, 0);
		}
		if (this.input.rotate_down) {
			this.camera.rotate(-movement_distance, 0, 0);
		}
		if (this.input.rotate_left) {
			this.camera.rotate(0, movement_distance, 0);
		}
		if (this.input.rotate_right) {
			this.camera.rotate(0, -movement_distance, 0);
		}

		// rotate cube
		this.gameobjects[0].rotate(0, delta_time, 0);
	}
	render() {
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

		const fov_radians = FOV * (Math.PI / 180);
		const half_lens = Math.min(this.ctx.canvas.height, this.ctx.canvas.width) / 2;
		const focal_length = half_lens / Math.tan(fov_radians / 2);

		for (const gameobject of this.gameobjects) {
			gameobject.render(this.ctx, this.camera, focal_length);
		}
	}
}

async function main() {
	resize();
	window.addEventListener("resize", resize);
	document.body.appendChild(canvas);

	const input = Object.seal({
		move_forward: false,
		move_backward: false,
		move_left: false,
		move_right: false,
		move_up: false,
		move_down: false,
		rotate_left: false,
		rotate_right: false,
		rotate_up: false,
		rotate_down: false
	});
	window.addEventListener("keydown", (event) => {
		switch (event.code) {
			case "KeyW":
				input.move_forward = true;
				break;
			case "KeyS":
				input.move_backward = true;
				break;
			case "KeyA":
				input.move_left = true;
				break;
			case "KeyD":
				input.move_right = true;
				break;
			case "KeyE":
			case "Space":
				input.move_up = true;
				break;
			case "KeyQ":
			case "ShiftLeft":
				input.move_down = true;
				break;
			case "ArrowUp":
				input.rotate_up = true;
				break;
			case "ArrowDown":
				input.rotate_down = true;
				break;
			case "ArrowLeft":
				input.rotate_left = true;
				break;
			case "ArrowRight":
				input.rotate_right = true;
				break;
		}
	});
	window.addEventListener("keyup", (event) => {
		switch (event.code) {
			case "KeyW":
				input.move_forward = false;
				break;
			case "KeyS":
				input.move_backward = false;
				break;
			case "KeyA":
				input.move_left = false;
				break;
			case "KeyD":
				input.move_right = false;
				break;
			case "KeyE":
			case "Space":
				input.move_up = false;
				break;
			case "KeyQ":
			case "ShiftLeft":
				input.move_down = false;
				break;
			case "ArrowUp":
				input.rotate_up = false;
				break;
			case "ArrowDown":
				input.rotate_down = false;
				break;
			case "ArrowLeft":
				input.rotate_left = false;
				break;
			case "ArrowRight":
				input.rotate_right = false;
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

	fetch("./objects/suzanne.obj")
		.then((res) => res.ok ? res : Promise.reject("Request was not ok..."))
		.then((res) => res.text())
		.then((data) => {
			const suzanne = wavefront_to_gameobject(data);
			suzanne.move(5, 5, 0);
			gameobjects.push(suzanne);
		})
		.catch((err) => console.error("Could not load wavefront object:", err));

	const ctx = canvas.getContext("2d");

	const game = new Game(input, camera, gameobjects, ctx);

	game.start();
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", main, { once: true });
} else {
	main();
}
