//setSeed(101);

const roadlanes = 7;

const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 600;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 400;
const nCars = document.getElementById("Ncars");

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, roadlanes);

let trainedBrain = '{"levels":[{"inputs":[0,0,0,0,0],"outputs":[1,0,0,0,1,0],"biases":[-0.08559820345679023,0.10234097150848827,0.03989089965638125,0.08099242613650062,-0.0752137207847635,0.023089025089684197],"weights":[[-0.04447829929819907,0.19729858008908707,0.08441435760373761,0.09258845223800716,-0.0015675084702905864,-0.11327604838467044],[0.15151300289096473,0.026459773574568017,0.0984084855887481,-0.01790998577932701,-0.11148831191018137,-0.08196144010960325],[0.08165206441657494,-0.021586446304257118,0.005240038128129103,0.1416883748128034,0.11964491639212374,0.11114928554909867],[0.01491397265221878,0.015533833727372185,-0.15512207471143252,-0.10596870059767284,0.0626488031525489,0.08424266324176902],[0.07765449410776354,-0.009035410295496232,-0.07585946148281818,-0.12074347789831637,-0.04271362946933818,0.05918259191028783]]},{"inputs":[1,0,0,0,1,0],"outputs":[1,1,1,0],"biases":[-0.03180669517398389,-0.0734665668997256,-0.03758086327816308,-0.033328226500485704],"weights":[[0.0037786347239029843,-0.039981369475265566,-0.02140461364749391,-0.04488884224465793],[0.09491764102946793,0.14914281476723462,0.05894338682810478,-0.09784239154846681],[0.02914745907746666,-0.1483120046498186,0.10280967806457246,0.05552755305963864],[-0.03480830514140179,0.1071012592052488,-0.010533282362401288,-0.02841574370989141],[0.1768957240788589,0.02136145166113612,0.021340881595308912,0.010418153718678377],[-0.052265939067847315,0.18705909848094204,-0.12470431565546672,0.0796494053760503]]}]}';
const N = 100;
const cars = generateCars(N);
let bestCar = cars[0];


if (trainedBrain) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(trainedBrain);
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.01);
    }
  }
}


if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.01);
    }
  }
}


let traffic = [];

for (let i = 0; i < 18; i++) {
  traffic.push(
    new Car(
      road.getLaneCenter(getRandomInt(1, roadlanes-2)),
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
    cars.push(new Car(road.getLaneCenter(3), 100, 30, 50, "AI",4,"blue",i));
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
       traffic[i].x=road.getLaneCenter(getRandomInt(0, roadlanes-1))
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
