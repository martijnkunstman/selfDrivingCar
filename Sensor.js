class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 4;
    this.rayLenght = 100;
    this.raySpread = Math.PI / 2;

    this.rays = [];
    this.readings = [];
  }

  update() {
    this.#castRays();
    this.readings = [];
    for (let i = 0; i < this.rays.length; i++) {}
  }

  #getReading(ray, roadBorders) {}

  #castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle;

      const start = {
        x: this.car.x,
        y: this.car.y,
      };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLenght,
        y: this.car.y - Math.cos(rayAngle) * this.rayLenght,
      };
      this.rays.push([start, end]);
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.rayCount; i++) {
      ctx.beginPath();
      ctx.lineWIdth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.stroke();
    }
  }
}
