import { random } from "./random.mjs";

const canvas = document.getElementById("perlin-canvas");
const ctx = canvas.getContext("2d");

const inputSeed = document.getElementById("perlin-seed");
const inputFreq = document.getElementById("perlin-freq");
const btnGenerate = document.getElementById("btn-generate");

const GRID_SIZE = 32; // Grid fixo em 32x32 para simplicidade e velocidade
let rd;
let gradients = {};

// Função de interpolação suave (Fade function: 6t^5 - 15t^4 + 10t^3)
function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
}

// Interpolação linear
function lerp(a, b, t) {
    return a + t * (b - a);
}

// Produto escalar entre o vetor gradiente e a distância
function dotGridGradient(ix, iy, x, y) {
    const key = `${ix},${iy}`;
    if (!gradients[key]) {
        // Cria um vetor gradiente direcional aleatório normalizado
        const angle = rd.Num(0, 360) * (Math.PI / 180);
        gradients[key] = { x: Math.cos(angle), y: Math.sin(angle) };
    }

    const g = gradients[key];
    const dx = x - ix;
    const dy = y - iy;

    return (dx * g.x + dy * g.y);
}

// Função principal do Perlin Noise em um ponto (x, y)
function perlin(x, y) {
    const x0 = Math.floor(x);
    const x1 = x0 + 1;
    const y0 = Math.floor(y);
    const y1 = y0 + 1;

    const sx = x - x0;
    const sy = y - y0;

    // Gradientes nos cantos
    const n0 = dotGridGradient(x0, y0, x, y);
    const n1 = dotGridGradient(x1, y0, x, y);
    const ix0 = lerp(n0, n1, fade(sx));

    const n2 = dotGridGradient(x0, y1, x, y);
    const n3 = dotGridGradient(x1, y1, x, y);
    const ix1 = lerp(n2, n3, fade(sx));

    // Valor final normalizado entre 0 e 1
    const value = lerp(ix0, ix1, fade(sy));
    return (value + 1) / 2; 
}

function generatePerlinMap() {
    const seed = parseInt(inputSeed.value, 10) || 42;
    const frequency = parseFloat(inputFreq.value) || 4;
    
    rd = new random(seed);
    gradients = {}; // Limpa os gradientes anteriores ao trocar a seed

    const imgData = ctx.createImageData(GRID_SIZE, GRID_SIZE);
    
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            // Mapeia as coordenadas para a frequência desejada
            const nx = (x / GRID_SIZE) * frequency;
            const ny = (y / GRID_SIZE) * frequency;

            let n = perlin(nx, ny);
            
            // Limita entre 0 e 1
            n = Math.max(0, Math.min(1, n));

            const color = Math.floor(n * 255);
            const index = (y * GRID_SIZE + x) * 4;

            // Define os pixels em escala de cinza (RGBA)
            imgData.data[index]     = color; // R
            imgData.data[index + 1] = color*1.2; // G
            imgData.data[index + 2] = color*3; // B
            imgData.data[index + 3] = 255;   // A (Opaco)
        }
    }

    ctx.putImageData(imgData, 0, 0);
}

btnGenerate.addEventListener("click", generatePerlinMap);
inputSeed.addEventListener("change", generatePerlinMap);
inputFreq.addEventListener("change", generatePerlinMap);

// Executa na inicialização
generatePerlinMap();