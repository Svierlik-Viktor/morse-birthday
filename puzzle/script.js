// 🔒 Защита: нельзя войти без Морзе
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

finalScreen.style.display = "none";

// 🧩 настройки
const rows = 4;
const cols = 4;
const totalPieces = rows * cols;
const TIME_LIMIT = 300; // 5 минут

let timeLeft = TIME_LIMIT;
let dragged = null;

// размеры кусочков (должны совпадать с CSS)
const pieceWidth = 150;
const pieceHeight = 100;

// ⏱ Таймер старт
timerEl.textContent = "Время: " + timeLeft;

const timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = "Время: " + timeLeft;

    if (timeLeft <= 0) {
        clearInterval(timer);
        result.textContent = "⛔ Время вышло!";
        puzzle.style.pointerEvents = "none"; // 🔥 БОНУС: блокируем игру
    }
}, 1000);

// 👁 Подсказка
hintBtn.addEventListener("click", () => {
    hintOverlay.classList.add("active");
    setTimeout(() => hintOverlay.classList.remove("active"), 3000);
});

// 🧩 Создание пазлов
let pieces = [];

for (let i = 0; i < totalPieces; i++) {
    const piece = document.createElement("div");
    piece.className = "piece";
    piece.draggable = true;

    const x = i % cols;
    const y = Math.floor(i / cols);

    piece.style.backgroundPosition = `-${x * pieceWidth}px -${y * pieceHeight}px`;
    piece.dataset.correct = i; // только правильная позиция

    pieces.push(piece);
}

// 🔀 Перемешиваем
pieces.sort(() => Math.random() - 0.5);

// ➕ Добавляем на поле
pieces.forEach(p => puzzle.appendChild(p));

// 🖱 Drag & Drop
puzzle.addEventListener("dragstart", e => {
    if (e.target.classList.contains("piece")) {
        dragged = e.target;
    }
});

puzzle.addEventListener("dragover", e => e.preventDefault());

puzzle.addEventListener("drop", e => {
    if (e.target.classList.contains("piece") && dragged && dragged !== e.target) {

        const draggedBg = dragged.style.backgroundPosition;
        const targetBg = e.target.style.backgroundPosition;

        // меняем картинку местами
        dragged.style.backgroundPosition = targetBg;
        e.target.style.backgroundPosition = draggedBg;

        checkWin();
    }
});

// ✅ Проверка победы (ПРАВИЛЬНАЯ)
function checkWin() {
    const pieces = document.querySelectorAll(".piece");
    let correct = 0;

    pieces.forEach((piece, index) => {

        const correctX = (index % cols) * pieceWidth;
        const correctY = Math.floor(index / cols) * pieceHeight;

        const expectedPosition = `-${correctX}px -${correctY}px`;

        if (piece.style.backgroundPosition === expectedPosition) {
            correct++;
        }
    });

    if (correct === totalPieces) {
        clearInterval(timer);

        puzzle.style.display = "none";
        hintBtn.style.display = "none";
        timerEl.style.display = "none";

        finalScreen.style.display = "block";
    }
}
