import { Matrix } from "./matrix.mjs";
import { GameObject } from "./game-object.mjs"

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

const camera = new Matrix(3, 1);

function resize() {
	canvas.width = document.body.width;
	canvas.height = document.body.height;
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
	document.addEventListener("resize", resize);
	document.appendChild(canvas);

	window.requestAnimationFrame(game_loop);
}

if (document.readyState === "complete") {
	main();
} else {
	document.addEventListener("readystatechange", (event) => {
		if (event.readyState === "complete") {
			main();
		}
	});
}
