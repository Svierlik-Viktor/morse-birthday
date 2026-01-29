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

// гарантированно скрываем финал
finalScreen.style.display = "none";

// 🧩 настройки
const rows = 4;
const cols = 4;
const totalPieces = rows * cols;
const TIME_LIMIT = 300; // ⏱ 5 минут

let timeLeft = TIME_LIMIT;
let dragged = null;

// ⏱ начальный вывод таймера
timerEl.textContent = "Время: " + timeLeft;

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
    hintOverlay.classList.add("active");

    setTimeout(() => {
        hintOverlay.classList.remove("active");
    }, 3000);
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
    piece.dataset.current = i;

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
    if (e.target.classList.contains("piece") && dragged) {
        // меняем фон
        const tempBg = dragged.style.backgroundPosition;
        dragged.style.backgroundPosition = e.target.style.backgroundPosition;
        e.target.style.backgroundPosition = tempBg;

// меняем текущие позиции
        const tempCurrent = dragged.dataset.current;
        dragged.dataset.current = e.target.dataset.current;
        e.target.dataset.current = tempCurrent;

        checkWin();

    }
});

// ✅ Проверка победы
function checkWin() {
    const pieces = document.querySelectorAll(".piece");
    let correct = 0;

    pieces.forEach(p => {
        if (Number(p.dataset.correct) === Number(p.dataset.current)) {
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


