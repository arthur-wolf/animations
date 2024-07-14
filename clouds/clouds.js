const PARTICLE_NUMBER = 1000;
const SHOW_VECTORS = true;

let particles = [];
let scale = 10;
let flowfield;
let cols, rows;

let noiseScale = 0.05;

function setup() {
  createCanvas(windowWidth, windowHeight);

  cols = floor(width / scale);
  rows = floor(height / scale);

  flowfield = new Array(cols * rows);
}

function draw() {
  background(0, scale);
  updateFlowfield();
}

function updateFlowfield() {
  let time = millis() / 5000;
  for (let y = 0; y <= rows; y++) {
    for (let x = 0; x <= cols; x++) {
      let index = x + y * cols;
      let angle = noise(x * noiseScale + time, y * noiseScale + time) * TWO_PI;
      let v = p5.Vector.fromAngle(angle);
      v.normalize();
      flowfield[index] = v;

      if (SHOW_VECTORS) {
        let n = noise(x * noiseScale + time, y * noiseScale + time);
        strokeWeight(15);
        stroke(255 * n, 255 * n, 255 * n, 50);
        point(x * scale, y * scale);

        // Uncomment to show vectors
        /*
        stroke(255, 50);
        push();
        translate(x * scale + scale / 2, y * scale + scale / 2);
        rotate(v.heading());
        strokeWeight(1);
        line(0, 0, scale / 2, 0);
        pop();
        */
      }
    }
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = floor(windowWidth / scale);
  rows = floor(windowHeight / scale);
  flowfield = new Array(cols * rows);
}
