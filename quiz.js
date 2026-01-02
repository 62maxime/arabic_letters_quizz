const arabicLetters = [
    { arabic: ['ا', 'ﺎ'], name: 'alif' },
    { arabic: ['ب', 'ﺐ', 'ﺒ', 'ﺑ'], name: 'ba' },
    { arabic: ['ت', 'ﺖ', 'ﺘ', 'ﺗ'], name: 'ta' },
    { arabic: ['ث', 'ﺚ', 'ﺜ', 'ﺛ'], name: 'tha' },
    { arabic: ['ج', 'ﺞ', 'ﺠ', 'ﺟ'], name: 'jim' },
    { arabic: ['ح', 'ﺢ', 'ﺤ', 'ﺣ'], name: 'ha' },
    { arabic: ['خ', 'ﺦ', 'ﺨ', 'ﺧ'], name: 'kha' },
    { arabic: ['د', 'ﺪ'], name: 'dal' },
    { arabic: ['ذ', 'ﺬ'], name: 'dhal' },
    { arabic: ['ر', 'ﺮ'], name: 'ra' },
    { arabic: ['ز', 'ﺰ'], name: 'zay' },
    { arabic: ['س', 'ﺲ', 'ﺴ', 'ﺳ'], name: 'sin' },
    { arabic: ['ش', 'ﺶ', 'ﺸ', 'ﺷ'], name: 'shin' },
    { arabic: ['ص', 'ﺺ', 'ﺼ', 'ﺻ'], name: 'sad' },
    { arabic: ['ض', 'ﺾ', 'ﻀ', 'ﺿ'], name: 'dad' },
    { arabic: ['ط', 'ﻂ', 'ﻄ', 'ﻃ'], name: 'taa' },
    { arabic: ['ظ', 'ﻆ', 'ﻈ', 'ﻇ'], name: 'dhaa' },
    { arabic: ['ع', 'ﻊ', 'ﻌ', 'ﻋ'], name: 'ayn' },
    { arabic: ['غ', 'ﻎ', 'ﻐ', 'ﻏ'], name: 'ghayn' },
    { arabic: ['ف', 'ﻒ', 'ﻔ', 'ﻓ'], name: 'fa' },
    { arabic: ['ق', 'ﻖ', 'ﻘ', 'ﻗ'], name: 'qaf' },
    { arabic: ['ك', 'ﻚ', 'ﻜ', 'ﻛ'], name: 'kaf' },
    { arabic: ['ل', 'ﻞ', 'ﻠ', 'ﻟ'], name: 'lam' },
    { arabic: ['م', 'ﻢ', 'ﻤ', 'ﻣ'], name: 'mim' },
    { arabic: ['ن', 'ﻦ', 'ﻨ', 'ﻧ'], name: 'nun' },
    { arabic: ['ه', 'ﻪ', 'ﻬ', 'ﻫ'], name: 'haa' },
    { arabic: ['و', 'ﻮ'], name: 'waw' },
    { arabic: ['ي', 'ﻲ', 'ﻴ', 'ﻳ'], name: 'ya' }
];

let selectedLetters = [];
let currentLetter = null;
let score = 0;
let questionsAnswered = 0;
let quizMode = 'continuous';
let remainingLetters = [];

function initLetterGrid() {
    const grid = document.getElementById('letterGrid');
    arabicLetters.forEach((letter, index) => {
        const div = document.createElement('div');
        div.innerHTML = `
            <input type="checkbox" class="letter-checkbox" id="letter${index}" value="${index}" checked>
            <label for="letter${index}" class="letter-label">
                <span class="arabic-char">${letter.arabic[0]}</span>
                <span class="letter-name">${letter.name}</span>
            </label>
        `;
        grid.appendChild(div);
    });
}

function selectAll() {
    document.querySelectorAll('.letter-checkbox').forEach(cb => cb.checked = true);
}

function deselectAll() {
    document.querySelectorAll('.letter-checkbox').forEach(cb => cb.checked = false);
}

function startQuiz() {
    selectedLetters = [];
    document.querySelectorAll('.letter-checkbox:checked').forEach(cb => {
        selectedLetters.push(arabicLetters[parseInt(cb.value)]);
    });

    if (selectedLetters.length < 2) {
        alert('Sélectionnez au moins 2 lettres pour commencer le quizz !');
        return;
    }

    quizMode = document.querySelector('input[name="quizMode"]:checked').value;
    score = 0;
    questionsAnswered = 0;
    remainingLetters = [...selectedLetters];

    document.getElementById('setupArea').classList.add('hidden');
    document.getElementById('quizArea').classList.add('active');
    nextQuestion();
}

function backToSetup() {
    document.getElementById('setupArea').classList.remove('hidden');
    document.getElementById('quizArea').classList.remove('active');
}

function nextQuestion() {
    if (quizMode === 'once' && remainingLetters.length === 0) {
        showFinalScore();
        return;
    }

    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';

    if (quizMode === 'once') {
        const randomIndex = Math.floor(Math.random() * remainingLetters.length);
        currentLetter = remainingLetters[randomIndex];
    } else {
        currentLetter = selectedLetters[Math.floor(Math.random() * selectedLetters.length)];
    }

    const randomIndex = Math.floor(Math.random() * currentLetter.arabic.length);
    const arabic = currentLetter.arabic[randomIndex]
    document.getElementById('arabicDisplay').textContent = arabic;

    const options = generateOptions(currentLetter);
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';

    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option.name;
        btn.addEventListener('click', function () {
            checkAnswer(option, btn);
        });
        optionsDiv.appendChild(btn);
    });

    updateScore();
}

function generateOptions(correct) {
    const options = [correct];
    const availableLetters = selectedLetters.filter(l => l !== correct);

    while (options.length < Math.min(4, selectedLetters.length)) {
        const random = availableLetters[Math.floor(Math.random() * availableLetters.length)];
        if (!options.includes(random)) {
            options.push(random);
        }
    }

    return shuffleArray(options);
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function checkAnswer(selected, btn) {
    questionsAnswered++;
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(b => {
        const newBtn = b.cloneNode(true);
        b.parentNode.replaceChild(newBtn, b);
    });

    const feedback = document.getElementById('feedback');

    if (selected === currentLetter) {
        score++;
        btn.classList.add('correct');
        feedback.textContent = '✓ Correct!';
        feedback.className = 'feedback correct';
    } else {
        btn.classList.add('incorrect');
        feedback.textContent = `✗ Faux! C'était ${currentLetter.name}`;
        feedback.className = 'feedback incorrect';

        const allButtons = document.querySelectorAll('.option-btn');
        allButtons.forEach(b => {
            if (b.textContent === currentLetter.name) {
                b.classList.add('correct');
            }
        });
    }

    if (quizMode === 'once') {
        remainingLetters = remainingLetters.filter(l => l !== currentLetter);
    }

    updateScore();
    setTimeout(nextQuestion, 1000);
}

function showFinalScore() {
    const percentage = Math.round((score / questionsAnswered) * 100);
    document.getElementById('arabicDisplay').textContent = '🎉';

    const feedbackDiv = document.getElementById('feedback');
    const scoreDiv = document.createElement('div');
    scoreDiv.textContent = `Quizz finit! Score final: ${score} / ${questionsAnswered} (${percentage}%)`;
    feedbackDiv.innerHTML = '';
    feedbackDiv.appendChild(scoreDiv);
    feedbackDiv.className = 'feedback';

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    const retakeBtn = document.createElement('button');
    retakeBtn.className = 'btn-primary retake-btn';
    retakeBtn.textContent = 'Refaire le Quizz';
    retakeBtn.addEventListener('click', startQuiz);
    optionsDiv.appendChild(retakeBtn);
}

function updateScore() {
    document.getElementById('score').textContent = `Score: ${score} / ${questionsAnswered}`;
}

// Initialize
initLetterGrid();

// Add event listeners
document.getElementById('selectAllBtn').addEventListener('click', selectAll);
document.getElementById('deselectAllBtn').addEventListener('click', deselectAll);
document.getElementById('startQuizBtn').addEventListener('click', startQuiz);
document.getElementById('backToSetupBtn').addEventListener('click', backToSetup);