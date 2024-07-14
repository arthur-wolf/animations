const SHOW_VECTORS = true;

let scale = 8;
let flowfield;
let cols, rows;

let noiseScale = 0.01;

function setup() {
  createCanvas(windowWidth, windowHeight);

  cols = floor(width / scale);
  rows = floor(height / scale);

  flowfield = new Array(cols * rows);
}

function draw() {
  background(0, 10);
  updateFlowfield();
}

function updateFlowfield() {
  let time = millis() / 10000;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;
      let angle = noise(x * noiseScale + time, y * noiseScale + time) * TWO_PI;
      let v = p5.Vector.fromAngle(angle);
      v.normalize();
      flowfield[index] = v;

      
      // Get a noise value between 0 and 255 and draw it as a color for each vector
      let n = noise(x * noiseScale + time, y * noiseScale + time);
      let h  = map(n, 0, 1, 0, 255);
      let c = inferColor(h);
      strokeWeight(scale);
      stroke(c, 50);
      square(x * scale, y * scale, scale);

      if (SHOW_VECTORS) {
        /**
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

function inferColor(h) {
    let r, g, b;

    if (h < 85) {
        r = 255 - h * 3;
        g = 0;
        b = h * 3;
    } else if (h < 170) {
        h -= 85;
        r = 0;
        g = h * 3;
        b = 255 - h * 3;
    } else {
        h -= 170;
        r = h * 3;
        g = 255 - h * 3;
        b = 0;
    }

    return color(r, g, b);
}
