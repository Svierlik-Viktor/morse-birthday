// 🔒 Защита
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

    const x = (i % cols) * pieceWidth;  // ИСПРАВЛЕНО: умножаем на ширину
    const y = Math.floor(i / cols) * pieceHeight; // ИСПРАВЛЕНО: умножаем на высоту

    piece.style.backgroundPosition = `-${x}px -${y}px`;
    piece.dataset.id = i; // ID фрагмента (правильная позиция)

    pieces.push(piece);
}

// 🔀 Перемешиваем кусочки в DOM (физически меняем порядок)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Перемешиваем и добавляем в DOM
pieces = shuffleArray(pieces);
pieces.forEach((piece, index) => {
    puzzle.appendChild(piece);
    currentOrder[index] = parseInt(piece.dataset.id); // Запоминаем текущий порядок
});

// 🖱 Drag & Drop (оригинальная логика)
puzzle.addEventListener("dragstart", e => {
    if (e.target.classList.contains("piece")) {
        dragged = e.target;
        // Добавляем класс для визуального эффекта
        dragged.classList.add("dragging");
    }
});

puzzle.addEventListener("dragend", e => {
    if (e.target.classList.contains("piece")) {
        e.target.classList.remove("dragging");
    }
    dragged = null;
});

puzzle.addEventListener("dragover", e => {
    e.preventDefault();
});

puzzle.addEventListener("drop", e => {
    e.preventDefault();

    if (!dragged || !e.target.classList.contains("piece") || dragged === e.target) {
        return;
    }

    // Получаем индексы элементов
    const draggedIndex = Array.from(puzzle.children).indexOf(dragged);
    const targetIndex = Array.from(puzzle.children).indexOf(e.target);

    // Меняем элементы местами в DOM
    if (draggedIndex < targetIndex) {
        e.target.after(dragged);
    } else {
        e.target.before(dragged);
    }

    // Обновляем currentOrder после перестановки
    updateCurrentOrder();

    // Проверяем, выиграл ли игрок
    checkWin();
});

// Функция для обновления currentOrder
function updateCurrentOrder() {
    currentOrder = [];
    Array.from(puzzle.children).forEach((piece, index) => {
        currentOrder[index] = parseInt(piece.dataset.id);
    });
}

// 🏆 Проверка (оригинальная логика)
function checkWin() {
    // Проверяем, совпадает ли currentOrder с correctOrder
    let isWin = true;
    for (let i = 0; i < totalPieces; i++) {
        if (currentOrder[i] !== correctOrder[i]) {
            isWin = false;
            break;
        }
    }

    if (isWin) {
        clearInterval(timer);

        puzzle.style.display = "none";
        hintBtn.style.display = "none";
        timerEl.style.display = "none";
        result.style.display = "none";

        finalScreen.style.display = "block";

        // Сохраняем прогресс
        localStorage.setItem("puzzlePassed", "true");
    }
}

// Добавим в CSS стиль для перетаскиваемого элемента
const style = document.createElement('style');
style.textContent = `
    .piece.dragging {
        opacity: 0.5;
        cursor: grabbing;
    }
`;
document.head.appendChild(style);