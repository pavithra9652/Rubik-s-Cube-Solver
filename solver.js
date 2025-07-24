class Cube {
  constructor() {
    this.reset();
  }

  reset() {
    this.faces = {
      U: Array(9).fill('w'),
      D: Array(9).fill('y'),
      F: Array(9).fill('g'),
      B: Array(9).fill('b'),
      L: Array(9).fill('o'),
      R: Array(9).fill('r'),
    };
  }

  // Rotates one face clockwise or counter-clockwise
  rotateFace(face, clockwise = true) {
    const map = clockwise
      ? [6, 3, 0, 7, 4, 1, 8, 5, 2]
      : [2, 5, 8, 1, 4, 7, 0, 3, 6];

    const oldFace = [...this.faces[face]];
    this.faces[face] = map.map(i => oldFace[i]);
  }

  rotate(side, clockwise = true) {
    const adjacent = {
      U: [['B', 0,1,2], ['R', 0,1,2], ['F', 0,1,2], ['L', 0,1,2]],
      D: [['F', 6,7,8], ['R', 6,7,8], ['B', 6,7,8], ['L', 6,7,8]],
      F: [['U', 6,7,8], ['R', 0,3,6], ['D', 2,1,0], ['L', 8,5,2]],
      B: [['U', 2,1,0], ['L', 0,3,6], ['D', 6,7,8], ['R', 8,5,2]],
      L: [['U', 0,3,6], ['F', 0,3,6], ['D', 0,3,6], ['B', 8,5,2]],
      R: [['U', 8,5,2], ['B', 0,3,6], ['D', 8,5,2], ['F', 8,5,2]],
    };

    this.rotateFace(side, clockwise);

    let a = adjacent[side];
    if (!clockwise) a = [...a].reverse();

    const temp = a.map(([f, ...idxs]) => idxs.map(i => this.faces[f][i]));

    for (let i = 0; i < 4; i++) {
      const [f, ...idxs] = a[(i + (clockwise ? 1 : 3)) % 4];
      idxs.forEach((idx, j) => {
        this.faces[f][idx] = temp[i][j];
      });
    }
  }

  scramble(moves = 20) {
    const faces = ['U', 'D', 'F', 'B', 'L', 'R'];
    for (let i = 0; i < moves; i++) {
      const face = faces[Math.floor(Math.random() * 6)];
      const clockwise = Math.random() > 0.5;
      this.rotate(face, clockwise);
    }
  }

  display() {
    const colorMap = ['U', 'R', 'F', 'D', 'L', 'B']
      .map(face => this.faces[face].join(''))
      .join('');
    document.getElementById('cube-container').innerHTML = getCubeSvg(colorMap);
  }
}

const cube = new Cube();
cube.display();

function scrambleCube() {
  cube.scramble();
  cube.display();
}

// Simplified beginner solve for demonstration
function solveCube() {
  alert('Solving (simplified)...');
  cube.reset();  // Fake solve for now
  cube.display();
}

// Provided function for rendering cube
function getCubeSvg(cubeString) {
  const colorMap = { r: '#f00', g: '#0f0', b: '#00f', y: '#ff0', o: '#fa0', w: '#fff' };
  const cubeArray = cubeString.split('');
  const faceOffsets = {
    U: [3, 0], R: [6, 3], F: [3, 3], D: [3, 6], L: [0, 3], B: [9, 3]
  };
  let svg = '<svg width="360" height="360" xmlns="http://www.w3.org/2000/svg">';
  const size = 40;
  let i = 0;

  for (const face in faceOffsets) {
    const [xOff, yOff] = faceOffsets[face];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const color = colorMap[cubeArray[i++]];
        svg += `<rect x="${(xOff + col) * size}" y="${(yOff + row) * size}" width="${size}" height="${size}" fill="${color}" stroke="#000"/>`;
      }
    }
  }
  return svg + '</svg>';
}

