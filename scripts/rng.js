import { random } from "./random.mjs";

let seed = 0;
const rd = new random(seed);

const rngBtnSend = document.getElementById("rng-generate");
const rngIptSeed = document.getElementById("rng-seed");
const rngLstList = document.getElementById("rng-list");
const rngParConsole = document.getElementById("rng-console");

rngBtnSend.addEventListener("click", rngNum);
rngIptSeed.addEventListener("keypress", function(key) {
    if (key.key === "Enter") {
        rngNum();
    }
});

function rngNum() {
    const rawInput = rngIptSeed.value.trim();
    
    // Se o input estiver vazio, assume 0 como padrão
    const parsedSeed = rawInput === "" ? 0 : toInt(rawInput);

    if (parsedSeed < 0) {
        alert("Insira um valor numérico válido (maior ou igual a 0).");
        return;
    }

    // Atualiza a semente se houver alteração
    if (parsedSeed !== seed) {
        seed = parsedSeed;
        rd.setSeed(seed);
    }

    if (rngParConsole) {
        rngParConsole.textContent = `Seed atual: ${seed}`;
    }

    generate();
}

function toInt(input) {
    const temp = parseInt(input, 10);
    if (isNaN(temp)) {
        return -1;
    }
    return temp;
}

function generate() {
    let num = rd.Num(0, 100);
    
    const li = document.createElement("li");
    li.textContent = `${num} : (seed: ${rd.seed})`;
    rngLstList.appendChild(li);
}