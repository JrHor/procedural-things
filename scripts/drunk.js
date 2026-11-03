import { random } from "./random.mjs";

const canvas = document.getElementById("drunk-canvas");
const ctx = canvas.getContext("2d");

const btnStep = document.getElementById("btn-step");
const btnReset = document.getElementById("btn-reset");
const spanCount = document.getElementById("step-count");
const inputSeed = document.getElementById("drunk-seed");

// Inicializa o gerador com o valor padrão do input
let seed = parseInt(inputSeed.value, 10) || 42;
let rd = new random(seed);

// Configuração inicial do agente no centro do canvas
let posX = canvas.width / 2;
let posY = canvas.height / 2;
let steps = 0;
const stepSize = 10;     // Tamanho do passo
const rectSize = 10;    // Tamanho do quadrado desenhado

// Limpa o canvas e desenha o ponto inicial
function initCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenha o quadrado inicial (origem)
    ctx.fillStyle = "rgba(255, 87, 34, 0.8)";
    ctx.fillRect(posX - rectSize / 2, posY - rectSize / 2, rectSize, rectSize);
}

// Atualiza a seed com base no input do usuário
function updateSeed() {
    rd.resetSeq();
    const newSeed = parseInt(inputSeed.value, 10);
    if (!isNaN(newSeed)) {
        seed = newSeed;
        rd.setSeed(seed);
    }
}

// Função que executa um passo aleatório
function makeStep() {
    // Garante que a seed está atualizada caso o usuário tenha mudado
    //updateSeed();

    // Salva a posição anterior
    const prevX = posX;
    const prevY = posY;

    // Escolhe a direção: 0 (cima), 1 (baixo), 2 (esquerda), 3 (direita)
    let direction = rd.Num(0, 3);

    switch (direction) {
        case 0: posY -= stepSize; break;
        case 1: posY += stepSize; break;
        case 2: posX -= stepSize; break;
        case 3: posX += stepSize; break;
    }

    // Limites do canvas
    posX = Math.max(0, Math.min(canvas.width, posX));
    posY = Math.max(0, Math.min(canvas.height, posY));

    // Configura baixa opacidade (alpha = 0.15) para visualizar repetições
    ctx.fillStyle = "rgba(33, 150, 243, 0.15)";
    ctx.strokeStyle = "rgba(63, 81, 181, 0.15)";

    // // Desenha uma linha suave entre o passo anterior e o atual
    // ctx.lineWidth = rectSize;
    // ctx.beginPath();
    // ctx.moveTo(prevX, prevY);
    // ctx.lineTo(posX, posY);
    // ctx.stroke();

    // Desenha o agente como um QUADRADO na nova posição com opacidade acumulativa
    ctx.fillRect(posX - rectSize / 2, posY - rectSize / 2, rectSize, rectSize);

    // Atualiza contador
    steps++;
    spanCount.textContent = steps;
}

// Reseta a simulação
function resetSimulation() {
    updateSeed();
    posX = canvas.width / 2;
    posY = canvas.height / 2;
    steps = 0;
    spanCount.textContent = steps;
    initCanvas();
}

// Event Listeners
btnStep.addEventListener("click", makeStep);
btnReset.addEventListener("click", resetSimulation);
inputSeed.addEventListener("change", resetSimulation); // Reseta ao alterar a seed

// Inicialização
initCanvas();