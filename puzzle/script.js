// 🔒 Защита
if (localStorage.getItem("morsePassed") !== "true") {
    document.body.innerHTML =
        "<h1 style='text-align:center;color:white;'>⛔ Сначала пройди Морзе</h1>";
    throw new Error("Access denied");
}

const mainTitle = document.getElementById("mainTitle");
const puzzle = document.getElementById("puzzle");
const result = document.getElementById("result");
const timerEl = document.getElementById("timer");
const hintBtn = document.getElementById("hintBtn");
const hintOverlay = document.getElementById("hintOverlay");
const finalScreen = document.getElementById("final");

finalScreen.style.display = "none";

// ⚙ настройки
const rows = 4;
const cols = 4;
const totalPieces = rows * cols;
const TIME_LIMIT = 300;

const pieceWidth = 150;
const pieceHeight = 100;

let dragged = null;
let timeLeft = TIME_LIMIT;

// 🧠 МАССИВ "КАК ДОЛЖНО БЫТЬ"
const correctOrder = [...Array(totalPieces).keys()]; // [0,1,2,...15]

// 🧠 МАССИВ "КАК СЕЙЧАС"
let currentOrder = [];

// ⏱ Таймер
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

// 👁 Подсказка
hintBtn.addEventListener("click", () => {
    hintOverlay.classList.add("active");
    setTimeout(() => hintOverlay.classList.remove("active"), 3000);
});

// 🧩 Создание кусочков
let pieces = [];

for (let i = 0; i < totalPieces; i++) {
    const piece = document.createElement("div");
    piece.className = "piece";
    piece.draggable = true;

    const x = i % cols;
    const y = Math.floor(i / cols);

    piece.style.backgroundPosition = `-${x * pieceWidth}px -${y * pieceHeight}px`;
    piece.dataset.id = i; // ID фрагмента

    pieces.push(piece);
}

// 🔀 Перемешиваем ID
pieces.sort(() => Math.random() - 0.5);

// ➕ Добавляем и запоминаем порядок
pieces.forEach((p, index) => {
    puzzle.appendChild(p);
    currentOrder[index] = Number(p.dataset.id);
});

// 🖱 Drag & Drop
puzzle.addEventListener("dragstart", e => {
    if (e.target.classList.contains("piece")) {
        dragged = e.target;
    }
});

puzzle.addEventListener("dragover", e => e.preventDefault());

puzzle.addEventListener("drop", e => {
    if (e.target.classList.contains("piece") && dragged && dragged !== e.target) {

        const fromIndex = [...puzzle.children].indexOf(dragged);
        const toIndex = [...puzzle.children].indexOf(e.target);

        // меняем фон
        const tempBg = dragged.style.backgroundPosition;
        dragged.style.backgroundPosition = e.target.style.backgroundPosition;
        e.target.style.backgroundPosition = tempBg;

        // меняем ID
        const tempId = dragged.dataset.id;
        dragged.dataset.id = e.target.dataset.id;
        e.target.dataset.id = tempId;

        // меняем порядок в массиве
        const tempOrder = currentOrder[fromIndex];
        currentOrder[fromIndex] = currentOrder[toIndex];
        currentOrder[toIndex] = tempOrder;

        checkWin();
    }
});

// 🏆 Проверка
function checkWin() {
    for (let i = 0; i < totalPieces; i++) {
        if (currentOrder[i] !== correctOrder[i]) {
            return;
        }
    }

    clearInterval(timer);

    puzzle.style.display = "none";
    hintBtn.style.display = "none";
    timerEl.style.display = "none";
    mainTitle.style.display = "none";

    finalScreen.style.display = "block";
}

