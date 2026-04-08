export class Matrix {
	constructor(rows, columns) {
		if (Array.isArray(rows)) {
			this.rows = rows.length;
			this.columns = rows[0].length;
			this.size = this.rows * this.columns;
			this.values = new Array(this.size).fill(0);
			for (let i = 0; i < this.rows; i++) {
				for (let j = 0; j < this.columns; j++) {
					this.set(i, j, rows[i][j]);
				}
			}
		} else {
			this.rows = rows;
			this.columns = columns;
			this.size = this.rows * this.columns;
			this.values = new Array(size).fill(0);
		}
	}

	at(row, column) {
		if (typeof row !== "number" || typeof column !== "number") {
			throw new TypeError("Invalid input type, only accepts numbers");
		}

		return this.values[row * this.columns + column];
	}
	set(row, column, value) {
		if (typeof row !== "number" || typeof column !== "number") {
			throw new TypeError("Invalid input type, only accepts numbers");
		}

		this.values[row * this.columns + column] = value;
	}

	add(other) {
		if (typeof other === "number") {
			for (let i = 0; i < this.size; i++) {
				this.values[i] += other;
			}
			return this;
		}

		if (other instanceof Matrix) {
			if (this.rows !== other.rows || this.columns !== other.columns) {
				throw new Error("These matrices' shapes are not able to be added");
			}

			for (let i = 0; i < this.rows; i++) {
				for (let j = 0; j < this.columns; j++) {
					this.set(i, j, this.at(i, j) + other.at(i, j));
				}
			}
			return this;
		}

		throw new TypeError("Unsupported type!");
	}
	subtract(other) {
		if (typeof other === "number") {
			for (let i = 0; i < size; i++) {
				this.values[i] -= other;
			}
			return this;
		}

		if (other instanceof Matrix) {
			if (this.rows !== other.rows || this.columns !== other.columns) {
				throw new Error("These matrices' shapes are not able to be added");
			}

			for (let i = 0; i < this.rows; i++) {
				for (let j = 0; j < this.columns; j++) {
					this.set(i, j, this.at(i, j) - other.at(i, j));
				}
			}
			return this;
		}

		throw new TypeError("Unsupported type!");
	}
	multiply(other) {
		if (typeof other === "number") {
			for (let i = 0; i < size; i++) {
				this.values[i] *= other;
			}
			return this;
		}

		if (other instanceof Matrix) {
			if (this.columns !== other.rows) {
				throw new Error("These matrices' shapes are not able to be multiplied");
			}

			let result = new Matrix(this.rows, other.columns);
			for (let i = 0; i < this.rows; i++) {
				for (let j = 0; j < other.columns; j++) {
					let accum = 0;
					for (let k = 0; k < this.columns; k++) {
						accum += this.at(i, k) * other.at(k, j);
					}
					result.set(i, j, accum);
				}
			}

			this.rows = result.rows;
			this.columns = result.columns;
			this.size = result.size;
			this.values = result.values.splice(0, result.values.length);
			return this;
		}

		throw new TypeError("Unsupported type!");
	}
}
