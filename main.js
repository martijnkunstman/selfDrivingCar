//setSeed(101);

const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 400;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 400;
const nCars = document.getElementById("Ncars");

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, 5);

let trainedBrain = '{"levels":[{"inputs":[0,0,0,0,0.4424138007132393],"outputs":[1,0,0,0,1,0],"biases":[-0.10323718870917514,0.13869958656803505,0.020137457827968754,0.05582590044552364,-0.0698500224606252,0.03627415100332873],"weights":[[-0.031689617048123765,0.10251784129285409,0.0543909553134054,0.039077804665946694,0.009267703342073413,-0.14954926685635203],[0.06143178333969379,0.015296805691306852,0.1311153488959643,-0.10808523194871271,-0.0525477527765051,-0.1164354991477944],[0.05393508200421407,-0.06922102708358191,0.04132490691151257,0.09822082441487338,0.026208568704201744,0.11232072191309166],[-0.051190888428326566,0.11645951477208366,-0.08709999792647419,-0.135534124932656,0.10585328865378309,0.022942391426782102],[0.03739903541387575,0.11731903417773154,-0.09988809241386737,-0.11466510213184479,-0.01780476209273995,0.07574893559719903]]},{"inputs":[1,0,0,0,1,0],"outputs":[1,0,0,0],"biases":[-0.0489988695227293,-0.040498635557752405,-0.012763178507615876,0.05101095867439869],"weights":[[0.09507482670954648,-0.07504404405320632,-0.05999023932731518,-0.05761804784238198],[0.06362209937841488,0.21529863419032452,0.09042730426016518,-0.027785942704225887],[-0.047672153746403365,-0.12059285975002978,0.0852843440704707,0.005140713322235157],[-0.11168606919735341,0.05755778957722201,-0.06450171416398681,-0.047094672319307744],[0.21305779512411713,0.007788468010526368,0.0236826910640438,0.010047074126395016],[0.02324199119785552,0.1402423227287216,-0.06620865406835419,0.06695714336444544]]}]}';
const N = 100;
const cars = generateCars(N);
let bestCar = cars[0];


if (trainedBrain) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(trainedBrain);
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.05);
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
