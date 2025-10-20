const arabicLetters = [
    { arabic: 'ا', name: 'alif' },
    { arabic: 'ب', name: 'ba' },
    { arabic: 'ت', name: 'ta' },
    { arabic: 'ث', name: 'tha' },
    { arabic: 'ج', name: 'jim' },
    { arabic: 'ح', name: 'ha' },
    { arabic: 'خ', name: 'kha' },
    { arabic: 'د', name: 'dal' },
    { arabic: 'ذ', name: 'dhal' },
    { arabic: 'ر', name: 'ra' },
    { arabic: 'ز', name: 'zay' },
    { arabic: 'س', name: 'sin' },
    { arabic: 'ش', name: 'shin' },
    { arabic: 'ص', name: 'sad' },
    { arabic: 'ض', name: 'dad' },
    { arabic: 'ط', name: 'Tta' },
    { arabic: 'ظ', name: 'dha' },
    { arabic: 'ع', name: 'ain' },
    { arabic: 'غ', name: 'ghain' },
    { arabic: 'ف', name: 'fa' },
    { arabic: 'ق', name: 'qaf' },
    { arabic: 'ك', name: 'kaf' },
    { arabic: 'ل', name: 'lam' },
    { arabic: 'م', name: 'mim' },
    { arabic: 'ن', name: 'nun' },
    { arabic: 'ه', name: 'haa' },
    { arabic: 'و', name: 'waw' },
    { arabic: 'ي', name: 'ya' }
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
                <span class="arabic-char">${letter.arabic}</span>
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
    
    document.getElementById('arabicDisplay').textContent = currentLetter.arabic;

    const options = generateOptions(currentLetter);
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';

    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option.name;
        btn.addEventListener('click', function() {
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
    setTimeout(nextQuestion, 2000);
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