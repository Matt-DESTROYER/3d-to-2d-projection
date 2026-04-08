import { Point, GameObject } from "./game-object.mjs"

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

function resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

//function update() {}

function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function game_loop(camera, gameobjects) {
	//update();
	render();

	window.requestAnimationFrame(() => game_loop(camera, gameobjects));
}

async function main() {
	resize();
	window.addEventListener("resize", resize);
	document.body.appendChild(canvas);
	
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
		[7, 5],
		// connections
		[0, 4],
		[1, 5],
		[2, 6],
		[3, 7]
	]);
	gameobjects.push(cube);

	window.requestAnimationFrame(() => game_loop(camera, gameobjects));
}

if (document.readyState === "loading") {
	main();
} else {
	document.addEventListener("DOMContentLoaded", main, { once: true });
}
