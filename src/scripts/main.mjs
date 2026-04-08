import { GameObject } from "./game-object.mjs"

function resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

//function update() {}

function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function game_loop(ctx, camera, gameobjects) {
	//update();
	render();

	window.requestAnimationFrame(() => game_loop(ctx, camera, gameobjects));
}

async function main() {
	const canvas = document.createElement("canvas");

	resize();
	window.addEventListener("resize", resize);
	document.body.appendChild(canvas);

	const ctx = canvas.getContext("2d");
	
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
		[1, 2],
		[2, 3],
		[3, 4],
		[4, 1],
		// bottom square
		[5, 6],
		[6, 7],
		[7, 8],
		[8, 5],
		// connections
		[1, 5],
		[2, 6],
		[3, 7],
		[4, 8]
	]);
	gameobjects.push(cube);

	window.requestAnimationFrame(() => game_loop(ctx, camera, gameobjects));
}

if (document.readyState === "loading") {
	main();
} else {
	document.addEventListener("DOMContentLoaded", main, { once: true });
}
