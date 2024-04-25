//setSeed(101);

const roadlanes = 5;

const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 400;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 400;
const nCars = document.getElementById("Ncars");

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, roadlanes);

let trainedBrain = '{"levels":[{"inputs":[0,0,0,0,0.22710285094027072,0.5999189958358004,0.7171000089315711],"outputs":[0,0,1,1,1,0],"biases":[-0.25325376901002694,0.6117914572406605,-0.4037479253870129,-0.08995561177283229,-0.42136147567613425,-0.029099205839771852],"weights":[[0.22443774017577378,0.5709414165948665,0.4570356873984575,0.3142199914934025,-0.26380721862685347,0.29277810138737864],[0.2178921318934712,0.13176457260420704,0.23779750372314473,0.3541398589768639,-0.2733401795165709,0.2000410576491945],[-0.473945040531199,0.06276157547664357,0.2624403904010287,-0.34600725627877515,-0.06177615335098805,0.022954425434033903],[-0.01875025036202701,0.22017445969667934,0.16535293184165817,-0.2652747418753968,-0.4697475116634777,0.21471818049060812],[-0.05191923929442599,-0.1778134686708835,-0.017240699836003306,-0.28284282780647896,0.19535084642655598,-0.16151275739218682],[-0.13608143653971883,-0.6261514086451961,0.3100473139045755,-0.19213774530414848,-0.25807123803973936,0.06030667959422742],[-0.3836331593152756,0.30694369162178997,0.05515797548554252,0.158274533055584,0.6086467174676873,-0.26578672901667516]]},{"inputs":[0,0,1,1,1,0],"outputs":[1,0,0,0],"biases":[0.26127015648783086,-0.16302065568305074,-0.24166816957553935,0.25251091895591676],"weights":[[0.09802834516429934,0.22800914498585434,0.06218940083067666,0.3738343369297444],[-0.039025322116219036,0.1960921190231383,-0.19914938478486505,0.534026147928617],[0.22741665178606751,0.1793873659285439,-0.2822354624597215,0.34865950879398483],[0.22697940318231125,-0.2578190777300181,-0.013749786458493417,-0.08962916009826766],[0.20392725430234254,-0.1514483320210247,-0.020815244987857816,-0.5485685903287415],[0.25633584730576026,-0.5704667326008984,0.19681256068888484,-0.09092516100699027]]}]}';
//trainedBrain = false;
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
      NeuralNetwork.mutate(cars[i].brain, 0.02);
    }
  }
}



let traffic = [];

let laneArray = [1,2,3,4,3,2,1,0,1,2,3,4,3,2,1,0,1,2,3];
let speedArray = [1.1,1.2,1.1,1.2,1.1,1.2,1.1,1.2,1.1,1.2,1.1,1.2,1.1,1.2,1.1,1.2,1.1,1.2,1.1];

for (let i = 0; i < 18; i++) {
  traffic.push(
    new Car(
      road.getLaneCenter(laneArray[i]),
      -150*i-300,
      30,
      50,
      "DUMMY",
      getRandomFloat(1, 3),
      //2,
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
       //traffic[i].x=road.getLaneCenter(getRandomInt(0, roadlanes-1))
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
