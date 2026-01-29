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

    // УКАЗЫВАЕМ ПРАВИЛЬНУЮ ПОЗИЦИЮ ФОНА ДЛЯ КАЖДОЙ ЧАСТИ
    // Это позиция в исходном неразрезанном изображении
    const x = (i % cols) * pieceWidth;  // исправлено: умножаем на ширину
    const y = Math.floor(i / cols) * pieceHeight; // исправлено: умножаем на высоту

    piece.style.backgroundPosition = `-${x}px -${y}px`;
    piece.dataset.correctId = i; // ИСПРАВЛЕНО: сохраняем правильный ID
    piece.dataset.currentId = i; // и текущий ID

    pieces.push(piece);
}

// 🔀 Перемешиваем физически, меняя их местами в DOM
function shufflePieces() {
    // Создаем массив индексов и перемешиваем его
    const shuffledIndices = [...Array(totalPieces).keys()];
    for (let i = shuffledIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
    }

    // Очищаем контейнер
    puzzle.innerHTML = '';

    // Добавляем части в перемешанном порядке
    shuffledIndices.forEach(index => {
        puzzle.appendChild(pieces[index]);
        // Обновляем currentId на тот, который сейчас в этой позиции
        pieces[index].dataset.currentId = index;
    });

    // Обновляем currentOrder
    updateCurrentOrder();
}

// Обновляем массив текущего порядка
function updateCurrentOrder() {
    currentOrder = [];
    Array.from(puzzle.children).forEach((piece, index) => {
        currentOrder[index] = parseInt(piece.dataset.correctId);
    });
}

// Инициализируем пазл
shufflePieces();

// 🖱 Drag & Drop - УПРОЩЕННАЯ ВЕРСИЯ
puzzle.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('piece')) {
        dragged = e.target;
        // Добавляем небольшой таймаут для корректной работы
        setTimeout(() => {
            e.target.style.opacity = '0.4';
        }, 0);
    }
});

puzzle.addEventListener('dragend', (e) => {
    if (e.target.classList.contains('piece')) {
        e.target.style.opacity = '1';
    }
});

puzzle.addEventListener('dragover', (e) => {
    e.preventDefault();
    // Добавляем визуальную подсказку
    const afterElement = getDragAfterElement(puzzle, e.clientY);
    const draggable = dragged;

    if (afterElement == null) {
        puzzle.appendChild(draggable);
    } else {
        puzzle.insertBefore(draggable, afterElement);
    }

    // Обновляем порядок после перетаскивания
    updateCurrentOrder();
    checkWin();
});

// Вспомогательная функция для определения позиции вставки
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.piece:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// 🏆 Проверка - УПРОЩЕННАЯ ВЕРСИЯ
function checkWin() {
    const children = Array.from(puzzle.children);
    let allCorrect = true;

    for (let i = 0; i < children.length; i++) {
        const correctId = parseInt(children[i].dataset.correctId);
        if (correctId !== i) {
            allCorrect = false;
            break;
        }
    }

    if (allCorrect) {
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

// Альтернативный вариант проверки (можно выбрать любой)
function checkWinAlternative() {
    let isCorrect = true;

    for (let i = 0; i < totalPieces; i++) {
        const piece = puzzle.children[i];
        const correctId = parseInt(piece.dataset.correctId);

        if (correctId !== i) {
            isCorrect = false;
            break;
        }
    }

    if (isCorrect) {
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