class Car {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.angle = 0;

    this.controls = new Controls();
  }

  update() {    
    if (this.controls.up) {
      this.y += 0.1;
    }
    if (this.controls.down) {
      this.y -= 0.1;
    }
    if (this.controls.left) {
      this.x -= 0.1;
    }
    if (this.controls.right) {
      this.x += 0.1;
    }

    this.x += this.speed * Math.cos(this.angle);
    this.y += this.speed * Math.sin(this.angle);
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.rect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    ctx.fill();
  }
}
