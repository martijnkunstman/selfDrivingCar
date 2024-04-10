/*
car physics
road generation
sensors
collisions
neural networks
genetic algorithms
*/

const canvas = document.getElementById("myCanvas");
canvas.width = 200;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width/2, canvas.width*0.9);
const car = new Car(road.getLaneCenter(3),100,30,50);

animate();

function animate() {
  car.update(road.borders);
  canvas.height = window.innerHeight;
  //ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(0, -car.y+canvas.height*0.7);

  road.draw(ctx);
  car.draw(ctx);

  ctx.restore();
  requestAnimationFrame(animate);
}



