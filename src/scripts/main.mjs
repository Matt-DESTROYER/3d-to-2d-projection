import { Matrix } from "./matrix.mjs";
import { GameObject } from "./game-object.mjs"

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

const camera = new Matrix(3, 1);

function resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

//function update() {}

function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function game_loop() {
	//update();
	render();

	window.requestAnimationFrame(game_loop);
}

function main() {
	resize();
	window.addEventListener("resize", resize);
	document.body.appendChild(canvas);

	window.requestAnimationFrame(game_loop);
}

if (document.readyState === "loading") {
	main();
} else {
	document.addEventListener("DOMContentLoaded", main, { once: true });
}
