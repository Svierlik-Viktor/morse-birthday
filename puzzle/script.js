// ================= НАСТРОЙКИ =================
const TIME_LIMIT = 180; // ⏳ время на сборку (сек)
const PUZZLE_SIZE = 3; // 3x3
const FINAL_IMAGE = "image.jpg"; // картинка пазла
// ============================================

// Элементы
const board = document.getElementById("puzzle");
const timerEl = document.getElementById("timer");
const hintBtn = document.getElementById("hintBtn");
const hintOverlay = document.getElementById("hintOverlay");
const resultEl = document.getElementById("result");
const finalScreen = document.getElementById("final");

// 🔒 ЖЁСТКО скрываем подсказку при загрузке
hintOverlay.classList.add("hidden");

// ================= ТАЙМЕР =================
let timeLeft = TIME_LIMIT;
const timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `⏱ Осталось: ${timeLeft} сек`;

    if (timeLeft <= 0) {
        clearInterval(timer);
        failPuzzle();
    }
}, 1000);

// ================= ПАЗЛ =================
let pieces = [];
let emptyIndex = PUZZLE_SIZE * PUZZLE_SIZE - 1;

// создаём пазл
function initPuzzle() {
    pieces = [];
    board.innerHTML = "";

    for (let i = 0; i < PUZZLE_SIZE * PUZZLE_SIZE; i++) {
        const tile = document.createElement("div");
        tile.className = "tile";

        if (i === emptyIndex) {
            tile.classList.add("empty");
        } else {
            const x = (i % PUZZLE_SIZE) * -100;
            const y = Math.floor(i / PUZZLE_SIZE) * -100;
            tile.style.backgroundImage = `url(${FINAL_IMAGE})`;
            tile.style.backgroundPosition = `${x}% ${y}%`;
        }

        tile.dataset.index = i;
        tile.addEventListener("click", () => moveTile(i));

        pieces.push(tile);
        board.appendChild(tile);
    }

    shufflePuzzle();
}

// перемешивание
function shufflePuzzle() {
    for (let i = 0; i < 200; i++) {
        const neighbors = getNeighbors(emptyIndex);
        const rand = neighbors[Math.floor(Math.random() * neighbors.length)];
        swap(rand, emptyIndex);
        emptyIndex = rand;
    }
}

// соседние клетки
function getNeighbors(index) {
    const neighbors = [];
    const row = Math.floor(index / PUZZLE_SIZE);
    const col = index % PUZZLE_SIZE;

    if (row > 0) neighbors.push(index - PUZZLE_SIZE);
    if (row < PUZZLE_SIZE - 1) neighbors.push(index + PUZZLE_SIZE);
    if (col > 0) neighbors.push(index - 1);
    if (col < PUZZLE_SIZE - 1) neighbors.push(index + 1);

    return neighbors;
}

// ход
function moveTile(index) {
    if (!getNeighbors(emptyIndex).includes(index)) return;

    swap(index, emptyIndex);
    emptyIndex = index;

    if (checkWin()) winPuzzle();
}

// swap
function swap(i, j) {
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    board.insertBefore(pieces[i], board.children[i]);
    board.insertBefore(pieces[j], board.children[j]);
}

// ================= ПРОВЕРКА =================
function checkWin() {
    return pieces.every((tile, index) => {
        if (tile.classList.contains("empty")) return index === emptyIndex;
        return parseInt(tile.dataset.index) === index;
    });
}

// ================= ПОДСКАЗКА =================
hintBtn.addEventListener("click", () => {
    hintOverlay.classList.remove("hidden");

    setTimeout(() => {
        hintOverlay.classList.add("hidden");
    }, 3000);
});

// ================= ФИНАЛ =================
function winPuzzle() {
    clearInterval(timer);
    resultEl.textContent = "🎉 Пазл собран правильно!";
    setTimeout(showFinal, 1200);
}

function failPuzzle() {
    resultEl.textContent = "⛔ Время вышло. Попробуй ещё раз 😉";
}

function showFinal() {
    document.getElementById("game").classList.add("hidden");
    finalScreen.classList.remove("hidden");
}

// старт
initPuzzle();
