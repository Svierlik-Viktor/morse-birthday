// 🔐 Проверка прохождения Морзе
if (localStorage.getItem("morsePassed") !== "true") {
    document.body.innerHTML = `
        <h1 style="text-align:center;margin-top:40vh;">
            ⛔ Сначала пройди предыдущее испытание
        </h1>
    `;
    throw new Error("Access denied");
}

const puzzle = document.getElementById("puzzle");
const result = document.getElementById("result");
const timerEl = document.getElementById("timer");

const rows = 4;
const cols = 4;
const totalPieces = rows * cols;

let timeLeft = 60;
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

// ➕ Добавляем на поле
pieces.forEach(p => puzzle.appendChild(p));

// 🖱 Drag & Drop
puzzle.addEventListener("dragstart", e => {
    dragged = e.target;
});

puzzle.addEventListener("dragover", e => e.preventDefault());

puzzle.addEventListener("drop", e => {
    if (e.target.className === "piece") {
        const temp = dragged.style.backgroundPosition;
        dragged.style.backgroundPosition = e.target.style.backgroundPosition;
        e.target.style.backgroundPosition = temp;

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
        result.textContent = "🎉 Пазл собран! Ты справилась!";
    }
}
