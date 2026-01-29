// 🔒 Защита: нельзя без Морзе
if (localStorage.getItem("morsePassed") !== "true") {
    document.body.innerHTML = "<h1 style='text-align:center;color:white;'>⛔ Сначала пройди Морзе</h1>";
    throw new Error("Access denied");
}

const puzzle = document.getElementById("puzzle");
const result = document.getElementById("result");
const timerEl = document.getElementById("timer");
const hintBtn = document.getElementById("hintBtn");
const hintOverlay = document.getElementById("hintOverlay");
const finalScreen = document.getElementById("final");

// 🧩 настройки
const rows = 4;
const cols = 4;
const totalPieces = rows * cols;
const TIME_LIMIT = 300; // ⏱ 5 минут

let timeLeft = TIME_LIMIT;
let dragged = null;

// ⏱ Таймер
const timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = "Время: " + timeLeft;

    if (timeLeft <= 0) {
        clearInterval(timer);
        result.textContent = "⛔ Время вышло!";
    }
}, 1000);

// 👁 Подсказка
hintBtn.addEventListener("click", () => {
    hintOverlay.classList.remove("hidden");

    setTimeout(() => {
        hintOverlay.classList.add("hidden");
    }, 3000); // 3 секунды
});

// 🧩 Создание пазлов
let pieces = [];

for (let i = 0; i < totalPieces; i++) {
    const piece = document.createElement("div");
    piece.className = "piece";
    piece.draggable = true;

    const x = i % cols;
    const y = Math.floor(i / cols);

    piece.style.backgroundPosition = `-${x * 150}px -${y * 100}px`;
    piece.dataset.correct = i;

    pieces.push(piece);
}

// 🔀 Перемешиваем
pieces.sort(() => Math.random() - 0.5);

// ➕ Добавляем
pieces.forEach(p => puzzle.appendChild(p));

// 🖱 Drag & Drop
puzzle.addEventListener("dragstart", e => {
    dragged = e.target;
});

puzzle.addEventListener("dragover", e => e.preventDefault());

puzzle.addEventListener("drop", e => {
    if (e.target.classList.contains("piece")) {
        const tempPos = dragged.style.backgroundPosition;
        dragged.style.backgroundPosition = e.target.style.backgroundPosition;
        e.target.style.backgroundPosition = tempPos;

        checkWin();
    }
});

// ✅ Проверка победы
function checkWin() {
    const pieces = document.querySelectorAll(".piece");
    let correct = 0;

    pieces.forEach((p, i) => {
        if (p.dataset.correct == i) correct++;
    });

    if (correct === totalPieces) {
        clearInterval(timer);
        puzzle.style.display = "none";
        hintBtn.style.display = "none";
        timerEl.style.display = "none";

        finalScreen.classList.remove("hidden");
    }
}
