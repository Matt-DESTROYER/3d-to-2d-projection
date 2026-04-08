import { Point, GameObject } from "./game-object.mjs";

export function wavefront_to_gameobject(data) {
	const lines = data.trim().split("\n");

	const vertices = [];
	const edges = [];

	for (let i = 0; i < lines.length; i++) {
		lines[i] = lines[i].trim();

		const parts = lines[i].split(/\s+/);
		if (parts.length === 0)
			continue;

		if (parts[0] === "v") {
			let x = Number(parts[1]);
			let y = Number(parts[2]);
			let z = Number(parts[3]);

			vertices.push(new Point(x, y, z));
		} else if (parts[0] === "f" || parts[0] === "l") {
			// check for vertex normal indices ('/')
			// or vertex normal indicies without texture coordinate indices ("//")
			for (let i = 1; i < parts.length; i++) {
				if (parts[i].includes("/")) {
					const sub_parts = parts[i].split(/\/+/);
					parts[i] = sub_parts[0];
				}
			}
			
			for (let i = 1; i < parts.length - 1; i++) {
				edges.push([
					Number(parts[i]) - 1,
					Number(parts[i + 1]) - 1
				]);
			}
			edges.push([ Number(parts[1]) - 1, Number(parts[parts.length - 1]) - 1 ])
		}
	}

	return new GameObject(new Point(0, 0, 0), vertices, edges);
}
