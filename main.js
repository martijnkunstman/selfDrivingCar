//setSeed(101);

const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 400;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 400;
const nCars = document.getElementById("Ncars");

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, 5);

let trainedBrain = '{"levels":[{"inputs":[0,0,0,0,0.11762060480038095],"outputs":[1,1,1,1,1,0],"biases":[-0.042727629891392394,0.006109801372665273,-0.07982592337423738,-0.09131447082718386,-0.26092452868736105,0.18981664637722867],"weights":[[-0.037549632879743694,0.15840625960450525,-0.10666190327277592,-0.040340435130726354,0.11916346663563596,-0.1638439407898014],[-0.009167183590433288,-0.04678435934645772,0.109950595605159,0.09162171473211672,-0.04673640173717303,-0.13164471269463235],[0.07583822035495386,-0.03173066012918517,-0.07597011752066846,0.2381721777991924,-0.09343551628697831,0.043160120812068936],[0.07303175678693952,-0.04070244364966731,-0.11030442810658758,-0.14911723896572734,0.18529269781941035,0.02551404905372326],[-0.08532059959407422,0.08809479014499523,-0.15558914209335348,-0.29721426880689195,-0.08563742503231152,-0.0582699774043207]]},{"inputs":[1,1,1,1,1,0],"outputs":[1,1,1,0],"biases":[-0.1128891856942698,0.025004851922557712,-0.046204018371235875,-0.048468038527501575],"weights":[[0.00960672962295013,0.054987434510237895,-0.10135011480675603,-0.040715183945961325],[-0.0283593741057292,0.11271286938445263,0.12784325259883464,0.03268105496426264],[0.1186232584767859,-0.08074019942361586,0.12419604508372621,-0.07993792034871053],[-0.09289290955076923,0.01856168928381445,0.10312100424915635,-0.19095989966392782],[0.0010975382959302685,0.02357662025605978,-0.16077901672732475,-0.10714399445857062],[-0.0668509830042842,-0.08862446038410413,0.024308354833580497,-0.003271549988026314]]}]}';

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
    cars.push(new Car(road.getLaneCenter(2), 100, 30, 50, "AI"));
  }
  return cars;
}

function getNotDamagedCars() {
  return cars.filter((car) => !car.damaged).length;
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

  nCars.innerHTML = getNotDamagedCars();


  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  requestAnimationFrame(animate);
}
