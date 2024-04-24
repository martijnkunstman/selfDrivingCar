//setSeed(101);

const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 400;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 400;
const nCars = document.getElementById("Ncars");

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, 6);

let trainedBrain = '{"levels":[{"inputs":[0,0,0,0,0],"outputs":[1,0,0,0,1,0],"biases":[-0.08622684324382987,0.11892526549089305,0.04190206329358162,0.08325533069684106,-0.0760129080158353,0.014007713542405376],"weights":[[-0.050602697179778625,0.18278187767076598,0.09979484065425534,0.07972583814005968,0.003025963303956332,-0.1218874948875737],[0.15421596687339081,0.012070535014228875,0.0987388573221405,-0.02801874296824146,-0.11240159776276426,-0.07882966023309965],[0.0753453378495886,-0.032788275555394444,-0.00801306634781385,0.13710513607020955,0.12502732228864424,0.10478984339227859],[0.008580066574932703,0.009018587008528464,-0.1582418864745046,-0.0967640814465698,0.05323232835900782,0.07555602785267118],[0.08177993721512856,-0.01141005499685668,-0.0808205785327703,-0.12451011005265673,-0.03846748986128875,0.06010327743554254]]},{"inputs":[1,0,0,0,1,0],"outputs":[1,1,1,0],"biases":[-0.03694134936929599,-0.07403712872987968,-0.03067087809591667,-0.01910889052731087],"weights":[[-0.003632223935897745,-0.03277059021091504,-0.031648864016804015,-0.03817581974159955],[0.09924303181446861,0.1506055232446473,0.05129450118238152,-0.09403017488601753],[0.040483102376214844,-0.14958028333544582,0.09817509259616584,0.05566008762129653],[-0.04146920917365031,0.10229425501849211,-0.01771334710960112,-0.030843793851434823],[0.17858611155936557,0.02388420719879348,0.01972968536269249,0.004112594190140097],[-0.04740179509980991,0.17595230425080394,-0.118393302072262,0.0690173401176178]]}]}';

const N = 100;
const cars = generateCars(N);
let bestCar = cars[0];


if (trainedBrain) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(trainedBrain);
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.02);
    }
  }
}


if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.05);
    }
  }
}


let traffic = [];

for (let i = 0; i < 12; i++) {
  traffic.push(
    new Car(
      road.getLaneCenter(getRandomInt(1, 3)),
      Math.random() * -1500,
      30,
      50,
      "DUMMY",
      getRandomFloat(1.0, 2.5),
      getRandomColor()
    )
  );
}

animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(N) {
  const cars = [];
  for (let i = 1; i <= N; i++) {
    cars.push(new Car(road.getLaneCenter(2), 100, 30, 50, "AI",4,"blue",i));
  }
  return cars;
}




function removeCar(id) {
  const index = cars.findIndex((c) => c.id == id);
  cars.splice(index, 1);  
}

function animate(time) {

  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }
  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));

  
  for (let i = 0; i < traffic.length; i++) {
    if (-traffic[i].y+bestCar.y<-1000)
    {
       traffic[i].y=bestCar.y-1000;
       traffic[i].x=road.getLaneCenter(getRandomInt(0, 4))
    }
  }

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx);
  }
  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx);
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, true);

  carCtx.restore();

  nCars.innerHTML = cars.length;


  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  requestAnimationFrame(animate);
}
