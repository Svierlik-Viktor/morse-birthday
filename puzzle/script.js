if (localStorage.getItem("morsePassed") !== "true") {
    document.body.innerHTML =
        "<h1 style='text-align:center;color:white;'>⛔ Сначала пройди Морзе</h1>";
    throw new Error("Access denied");
}

const puzzle = document.getElementById("puzzle");
const result = document.getElementById("result");
const timerEl = document.getElementById("timer");
const hintBtn = document.getElementById("hintBtn");
const hintOverlay = document.getElementById("hintOverlay");
const finalScreen = document.getElementById("final");
const mainTitle = document.getElementById("mainTitle");

const rows = 4;
const cols = 4;
const totalPieces = rows * cols;
const TIME_LIMIT = 300;

let timeLeft = TIME_LIMIT;
let dragged = null;
let selectedPiece = null;

const correctOrder = [...Array(totalPieces).keys()];
let currentOrder = [];

// Таймер
timerEl.textContent = "Время: " + timeLeft;
const timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = "Время: " + timeLeft;

    if (timeLeft <= 0) {
        clearInterval(timer);
        result.textContent = "⛔ Время вышло!";
        puzzle.style.pointerEvents = "none";
    }
}, 1000);

// Подсказка
hintBtn.addEventListener("click", () => {
    hintOverlay.classList.add("active");
    setTimeout(() => hintOverlay.classList.remove("active"), 3000);
});

// Создание пазлов
let pieces = [];
for (let i = 0; i < totalPieces; i++) {
    const piece = document.createElement("div");
    piece.className = "piece";
    piece.draggable = true;

    const x = i % cols;
    const y = Math.floor(i / cols);
    const posX = (x / (cols - 1)) * 100;
    const posY = (y / (rows - 1)) * 100;

    piece.style.backgroundPosition = `${posX}% ${posY}%`;
    piece.dataset.id = i;

    pieces.push(piece);
}

pieces.sort(() => Math.random() - 0.5);

pieces.forEach((p, index) => {
    puzzle.appendChild(p);
    currentOrder[index] = Number(p.dataset.id);
});

// ПК Drag
puzzle.addEventListener("dragstart", e => {
    if (e.target.classList.contains("piece")) dragged = e.target;
});
puzzle.addEventListener("dragover", e => e.preventDefault());
puzzle.addEventListener("drop", e => {
    if (e.target.classList.contains("piece") && dragged && dragged !== e.target) {
        swapPieces(dragged, e.target);
    }
});

// 📱 Тап управление
puzzle.addEventListener("click", e => {
    const piece = e.target.closest(".piece");
    if (!piece || puzzle.style.pointerEvents === "none") return;

    if (!selectedPiece) {
        selectedPiece = piece;
        piece.classList.add("selected");
        return;
    }

    if (selectedPiece === piece) {
        selectedPiece.classList.remove("selected");
        selectedPiece = null;
        return;
    }

    swapPieces(selectedPiece, piece);
    selectedPiece.classList.remove("selected");
    selectedPiece = null;
});

function swapPieces(a, b) {
    const fromIndex = [...puzzle.children].indexOf(a);
    const toIndex = [...puzzle.children].indexOf(b);

    const tempBg = a.style.backgroundPosition;
    a.style.backgroundPosition = b.style.backgroundPosition;
    b.style.backgroundPosition = tempBg;

    const tempId = a.dataset.id;
    a.dataset.id = b.dataset.id;
    b.dataset.id = tempId;

    const tempOrder = currentOrder[fromIndex];
    currentOrder[fromIndex] = currentOrder[toIndex];
    currentOrder[toIndex] = tempOrder;

    checkWin();
}

function checkWin() {
    for (let i = 0; i < totalPieces; i++) {
        if (currentOrder[i] !== correctOrder[i]) return;
    }

    clearInterval(timer);

    puzzle.style.display = "none";
    hintBtn.style.display = "none";
    timerEl.style.display = "none";
    mainTitle.style.display = "none";

    finalScreen.style.display = "block";
}
