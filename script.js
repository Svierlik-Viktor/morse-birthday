// ================= НАСТРОЙКИ =================
const SECRET_KEY = "BD2026";               // 🔑 ключ в URL
const CORRECT_ANSWER = "HAPPY BIRTHDAY";   // ✅ правильный ответ
const LIFE_TIME = 10 * 60 * 1000; // ⏳ 10 минут
// ============================================

// Проверка ключа
const params = new URLSearchParams(window.location.search);
const key = params.get("key");

if (key === SECRET_KEY) {
    document.getElementById("app").classList.remove("hidden");

    // Скрываем ?key= из адресной строки
    history.replaceState({}, document.title, window.location.pathname);

    // Таймер самоуничтожения
    setTimeout(destroyPage, LIFE_TIME);
} else {
    document.getElementById("denied").classList.remove("hidden");
}

function checkAnswer() {
    const input = document.getElementById("answer").value.trim().toUpperCase();
    const result = document.getElementById("result");
    const toPuzzleBtn = document.getElementById("toPuzzleBtn");

    if (input === CORRECT_ANSWER) {
        localStorage.setItem("morsePassed", "true");

        result.textContent = "✅ Верно! Ты справился с первым испытанием.";
        toPuzzleBtn.classList.remove("hidden");
    } else {
        result.textContent = "❌ Неверно. Подсказка: это поздравление 😉";
    }
}

// Самоуничтожение страницы
function destroyPage() {
    document.body.innerHTML = `
    <div style="text-align:center; margin-top:20vh; color:white;">
      <h1>⏳ Время вышло</h1>
      <p>Сюрприз был доступен ограниченное время 😉</p>
    </div>
  `;
}

// ================= МОРЗЕ ЗВУК =================
function playMorse() {
    const morse = ".... .- .--. .--. -.--  -... .. .-. - .... -.. .- -.--";
    const context = new (window.AudioContext || window.webkitAudioContext)();

    const dot = 0.1;
    const dash = 0.3;
    let time = context.currentTime;

    for (let char of morse) {
        if (char === ".") {
            beep(time, dot);
            time += dot + 0.05;
        } else if (char === "-") {
            beep(time, dash);
            time += dash + 0.05;
        } else {
            time += 0.2;
        }
    }

    function beep(start, duration) {
        const osc = context.createOscillator();
        osc.frequency.value = 600;
        osc.connect(context.destination);
        osc.start(start);
        osc.stop(start + duration);
    }
    document.getElementById("toPuzzleBtn").addEventListener("click", () => {
        window.location.href = "puzzle/index.html";
    });

}
