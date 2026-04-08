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
			let x = Number(lines[1]);
			let y = Number(lines[2]);
			let z = Number(lines[3]);

			vertices.push(new Point(x, y, z));
		} else if (parts[0] === "f" || parts[0] === "l") {
			// check for vertex normal indices ('/')
			// or vertex normal indicies without texture coordinate indices ("//")
			if (parts[1].includes("/"))
				continue;
			
			for (let i = 1; i < parts.length - 1; i++) {
				edges.push([
					Number(parts[i]),
					Number(parts[i + 1])
				]);
			}
			edges.push([ Number(parts[1]), Number(parts[parts.length - 1]) ])
		}
	}

	return new GameObject(new Point(0, 0, 0), vertices, edges);
}
