import { random } from "./random.mjs";

const canvas = document.getElementById("bsp-canvas");
const ctx = canvas.getContext("2d");

const inputSeed = document.getElementById("bsp-seed");
const inputDepth = document.getElementById("max-depth");
const btnGenerate = document.getElementById("btn-generate");
const treeContainer = document.getElementById("tree-container");

let rd;
const MIN_SIZE = 60; // Tamanho mínimo da partição para permitir divisão

class Leaf {
    constructor(x, y, width, height, id) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.id = id;
        this.leftChild = null;
        this.rightChild = null;
        this.room = null;
    }

    split() {
        if (this.leftChild || this.rightChild) return false;

        // Determina direção da divisão (horizontal ou vertical)
        let splitH;
        if (this.width / this.height >= 1.25) {
            splitH = false; // Vertical
        } else if (this.height / this.width >= 1.25) {
            splitH = true; // Horizontal
        } else {
            splitH = rd.Num(0, 1) === 0;
        }

        const max = (splitH ? this.height : this.width) - MIN_SIZE;
        if (max < MIN_SIZE) return false; // Área muito pequena para dividir

        // Ponto de corte determinado aleatoriamente via random.mjs
        const splitPos = rd.Num(MIN_SIZE, max);

        if (splitH) {
            this.leftChild = new Leaf(this.x, this.y, this.width, splitPos, `${this.id}L`);
            this.rightChild = new Leaf(this.x, this.y + splitPos, this.width, this.height - splitPos, `${this.id}R`);
        } else {
            this.leftChild = new Leaf(this.x, this.y, splitPos, this.height, `${this.id}L`);
            this.rightChild = new Leaf(this.x + splitPos, this.y, this.width - splitPos, this.height, `${this.id}R`);
        }

        return true;
    }

    createRooms() {
        if (this.leftChild || this.rightChild) {
            if (this.leftChild) this.leftChild.createRooms();
            if (this.rightChild) this.rightChild.createRooms();
        } else {
            // Gera sala com tamanho e margens aleatórias dentro do nó folha
            const roomW = rd.Num(Math.floor(this.width * 0.5), this.width - 10);
            const roomH = rd.Num(Math.floor(this.height * 0.5), this.height - 10);
            const roomX = rd.Num(this.x + 5, this.x + this.width - roomW - 5);
            const roomY = rd.Num(this.y + 5, this.y + this.height - roomH - 5);

            this.room = { x: roomX, y: roomY, width: roomW, height: roomH };
        }
    }
}

function generateBSP() {
    const seed = parseInt(inputSeed.value, 10) || 42;
    const maxDepth = parseInt(inputDepth.value, 10) || 4;
    rd = new random(seed);

    const root = new Leaf(0, 0, canvas.width, canvas.height, "N0");
    const leaves = [root];

    // Processo de divisão da árvore BSP
    for (let depth = 0; depth < maxDepth; depth++) {
        const currentLength = leaves.length;
        for (let i = 0; i < currentLength; i++) {
            const node = leaves.shift();
            if (!node.leftChild && !node.rightChild) {
                if (node.split()) {
                    leaves.push(node.leftChild);
                    leaves.push(node.rightChild);
                } else {
                    leaves.push(node);
                }
            }
        }
    }

    root.createRooms();
    renderCanvas(root);
    renderTreeHTML(root);
}

// Renderização no Canvas HTML5
function renderCanvas(node) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawNode(node);
}

function drawNode(node) {
    if (!node) return;

    // Desenha as bordas da partição BSP (Linhas azuis)
    ctx.strokeStyle = "rgba(33, 150, 243, 0.6)";
    ctx.lineWidth = 1;
    ctx.strokeRect(node.x, node.y, node.width, node.height);

    // Se for nó folha e tiver sala gerada
    if (node.room) {
        ctx.fillStyle = "rgba(76, 175, 80, 0.4)";
        ctx.strokeStyle = "#4caf50";
        ctx.lineWidth = 2;

        ctx.fillRect(node.room.x, node.room.y, node.room.width, node.room.height);
        ctx.strokeRect(node.room.x, node.room.y, node.room.width, node.room.height);
    }

    drawNode(node.leftChild);
    drawNode(node.rightChild);
}

// Construção dinâmica do HTML da Árvore Binária
function renderTreeHTML(rootNode) {
    treeContainer.innerHTML = "";
    const ul = document.createElement("ul");
    ul.appendChild(buildTreeNode(rootNode));
    treeContainer.appendChild(ul);
}

function buildTreeNode(node) {
    const li = document.createElement("li");
    const card = document.createElement("div");
    card.className = `node-card ${!node.leftChild && !node.rightChild ? "leaf" : ""}`;
    card.innerHTML = `<strong>${node.id}</strong><br>${Math.round(node.width)}x${Math.round(node.height)}`;
    li.appendChild(card);

    if (node.leftChild || node.rightChild) {
        const ul = document.createElement("ul");
        if (node.leftChild) ul.appendChild(buildTreeNode(node.leftChild));
        if (node.rightChild) ul.appendChild(buildTreeNode(node.rightChild));
        li.appendChild(ul);
    }

    return li;
}

btnGenerate.addEventListener("click", generateBSP);
generateBSP();