const arabicWords = {
    'Cours 1': [
        { arabic: 'رَأْسٌ', phonetic: 'ra\'soun', french: 'tête' },
        { arabic: 'وَجْهٌ', phonetic: 'wajhoun', french: 'visage' },
        { arabic: 'عَيْنٌ', phonetic: '\'aynoun', french: 'œil' },
        { arabic: 'أُذُنٌ', phonetic: 'oudhounoun', french: 'oreille' },
        { arabic: 'أَنْفٌ', phonetic: 'anfoun', french: 'nez' },
        { arabic: 'فَمٌ', phonetic: 'famoun', french: 'bouche' },
    ],
    'Cours 2': [
        { arabic: 'بَيْتٌ', phonetic: 'baytoun', french: 'maison' },
        { arabic: 'قَلَمٌ', phonetic: 'qalamoun', french: 'crayon' },
        { arabic: 'دَفْتَرٌ', phonetic: 'daftaroun', french: 'cahier' },
        { arabic: 'مِسْطَرَةٌ', phonetic: 'mistaratoun', french: 'règle' },
        { arabic: 'مَكْتَبٌ', phonetic: 'maktaboun', french: 'bureau' },
        { arabic: 'فَصْلٌ', phonetic: 'fassloun', french: 'classe' },
    ],
    'Cours 3': [
        { arabic: 'مِفْتَاحٌ', phonetic: 'miftaahoun', french: 'clé' },
        { arabic: 'سَاعَةٌ', phonetic: 'saa\'atoun', french: 'montre' },
        { arabic: 'مِنْدِيلٌ', phonetic: 'mindiiloun', french: 'mouchoir' },
        { arabic: 'قَمِيصٌ', phonetic: 'qamiissoun', french: 'chemise' },
        { arabic: 'كُوبٌ', phonetic: 'kouboun', french: 'coupe' },
        { arabic: 'صُورَةٌ جَمِيلَةٌ', phonetic: 'souratoun jamilatoun', french: 'belle image' },
        { arabic: 'كِتَابٌ', phonetic: 'kitaaboun', french: 'livre' },
        { arabic: 'طَاوِلَةٌ', phonetic: 'taawilatoun', french: 'table' },
        { arabic: 'حَقِيبَةٌ', phonetic: 'haqiibatoun', french: 'cartable' },
        { arabic: 'نَافِذَةٌ', phonetic: 'naafidzatoun', french: 'fenêtre' },
        { arabic: 'قَلَمٌ مَكْسُورٌ', phonetic: 'qalamoun maksouroun', french: 'crayon cassé' },
        { arabic: 'بَابٌ مَفْتُوحٌ', phonetic: 'baaboun maftouhoun', french: 'porte ouverte' },
    ],
    'Cours 4': [
        { arabic: 'مَدِينَةٌ', phonetic: 'madiinatoun', french: 'ville' },
        { arabic: 'جَامِعَةٌ', phonetic: 'jaami\'atoun', french: 'université' },
        { arabic: 'مَكْتَبَةٌ', phonetic: 'maktabatoun', french: 'bibliothèque' },
        { arabic: 'حَدِيقَةٌ', phonetic: 'hadiiقatoun', french: 'jardin' },
        { arabic: 'شَارِعٌ', phonetic: 'shaari\'oun', french: 'rue' },
        { arabic: 'مَتْجَرٌ', phonetic: 'matjaroun', french: 'supermarché' },
        { arabic: 'قَرْيَةٌ', phonetic: 'qaryatoun', french: 'village' },
        { arabic: 'حَقْلٌ', phonetic: 'haqloun', french: 'champs' },
        { arabic: 'مَزْرَعَةٌ', phonetic: 'mazra\'atoun', french: 'ferme' },
        { arabic: 'مَسْجِدٌ', phonetic: 'masjidoun', french: 'mosquée' },
        { arabic: 'سُوقٌ', phonetic: 'souqoun', french: 'marché' },
        { arabic: 'مَدْرَسَةٌ', phonetic: 'madrasatoun', french: 'école' },
    ],
    'Cours 5': [
        { arabic: 'كِتَابٌ قَدِيمٌ', phonetic: 'kitaaboun qadiimoun', french: 'un livre ancien' },
        { arabic: 'دَفْتَرٌ جَدِيدٌ', phonetic: 'daftaroun jadiidoun', french: 'un cahier neuf' },
        { arabic: 'بَيْتٌ صَغِيرٌ', phonetic: 'baytoun saghiiroun', french: 'une petite maison' },
        { arabic: 'مَتْجَرٌ كَبِيرٌ', phonetic: 'matjaroun kabiiroun', french: 'un grand magasin' },
        { arabic: 'مَسْجِدٌ جَمِيلٌ', phonetic: 'masjidoun jamiiloun', french: 'une belle mosquée' },
        { arabic: 'حَقْلٌ وَاسِعٌ', phonetic: 'haqloun waasi\'oun', french: 'un champs vaste' },
    ],
};

let selectedCategories = [];
let selectedWords = [];
let currentWord = null;
let score = 0;
let questionsAnswered = 0;
let quizMode = 'continuous';
let remainingWords = [];
let isAnswered = false;
let appMode = 'learn'; // 'learn' or 'quiz'

function initCategoryGrid() {
    const grid = document.getElementById('categoryGrid');
    Object.keys(arabicWords).forEach((category, index) => {
        const div = document.createElement('div');
        div.innerHTML = `
            <input type="checkbox" class="category-checkbox" id="category${index}" value="${category}" checked>
            <label for="category${index}" class="category-label">
                <span class="category-name">${category}</span>
                <span class="word-count">(${arabicWords[category].length} mots)</span>
            </label>
        `;
        grid.appendChild(div);
    });
}

function selectAll() {
    document.querySelectorAll('.category-checkbox').forEach(cb => cb.checked = true);
}

function deselectAll() {
    document.querySelectorAll('.category-checkbox').forEach(cb => cb.checked = false);
}

function startQuiz() {
    selectedCategories = [];
    selectedWords = [];

    document.querySelectorAll('.category-checkbox:checked').forEach(cb => {
        const category = cb.value;
        selectedCategories.push(category);
        selectedWords = selectedWords.concat(arabicWords[category]);
    });

    if (selectedWords.length === 0) {
        alert('Sélectionnez au moins une catégorie pour commencer !');
        return;
    }

    document.getElementById('setupArea').classList.add('hidden');

    if (appMode === 'learn') {
        startLearnMode();
    } else {
        startQuizMode();
    }
}

function startLearnMode() {
    document.getElementById('learnArea').classList.add('active');

    const vocabList = document.getElementById('vocabularyList');
    vocabList.innerHTML = '';

    selectedCategories.forEach(category => {
        const categorySection = document.createElement('div');
        categorySection.className = 'vocab-category';

        const categoryTitle = document.createElement('h3');
        categoryTitle.className = 'vocab-category-title';
        categoryTitle.textContent = category;
        categorySection.appendChild(categoryTitle);

        arabicWords[category].forEach(word => {
            const wordCard = document.createElement('div');
            wordCard.className = 'vocab-card';
            wordCard.innerHTML = `
                <div class="vocab-arabic">${word.arabic}</div>
                <div class="vocab-phonetic">${word.phonetic}</div>
                <div class="vocab-french">${word.french}</div>
            `;
            categorySection.appendChild(wordCard);
        });

        vocabList.appendChild(categorySection);
    });

    const totalWords = selectedWords.length;
    document.getElementById('learnProgress').textContent = `${totalWords} mot${totalWords > 1 ? 's' : ''} au total`;
}

function startQuizMode() {
    quizMode = document.querySelector('input[name="quizMode"]:checked').value;
    score = 0;
    questionsAnswered = 0;
    remainingWords = [...selectedWords];

    document.getElementById('quizArea').classList.add('active');
    nextQuestion();
}

function backToSetup() {
    document.getElementById('setupArea').classList.remove('hidden');
    document.getElementById('quizArea').classList.remove('active');
    document.getElementById('learnArea').classList.remove('active');
}

function nextQuestion() {
    if (quizMode === 'once' && remainingWords.length === 0) {
        showFinalScore();
        return;
    }

    isAnswered = false;
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';
    document.getElementById('answerInput').value = '';
    document.getElementById('answerInput').disabled = false;
    document.getElementById('answerInput').classList.remove('correct', 'incorrect');
    document.getElementById('submitBtn').textContent = 'Valider';
    document.getElementById('submitBtn').disabled = false;

    if (quizMode === 'once') {
        const randomIndex = Math.floor(Math.random() * remainingWords.length);
        currentWord = remainingWords[randomIndex];
    } else {
        currentWord = selectedWords[Math.floor(Math.random() * selectedWords.length)];
    }

    document.getElementById('arabicDisplay').textContent = currentWord.arabic;
    document.getElementById('answerInput').focus();
    updateScore();
}

function normalizeText(text) {
    return text
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9\s-]/g, '');
}

function checkAnswer() {
    if (isAnswered) {
        nextQuestion();
        return;
    }

    const userAnswer = document.getElementById('answerInput').value;
    const normalizedUserAnswer = normalizeText(userAnswer);
    const normalizedCorrectAnswer = normalizeText(currentWord.french);

    questionsAnswered++;
    isAnswered = true;

    const answerInput = document.getElementById('answerInput');
    const feedback = document.getElementById('feedback');
    const submitBtn = document.getElementById('submitBtn');

    answerInput.disabled = true;

    if (normalizedUserAnswer === normalizedCorrectAnswer) {
        score++;
        answerInput.classList.add('correct');
        feedback.innerHTML = `✓ Correct! <span class="phonetic-display">(${currentWord.phonetic})</span>`;
        feedback.className = 'feedback correct';
    } else {
        answerInput.classList.add('incorrect');
        feedback.innerHTML = `✗ Faux! La bonne réponse est: <strong>${currentWord.french}</strong> <span class="phonetic-display">(${currentWord.phonetic})</span>`;
        feedback.className = 'feedback incorrect';
    }

    if (quizMode === 'once') {
        remainingWords = remainingWords.filter(w => w !== currentWord);
    }

    updateScore();
    submitBtn.textContent = 'Continuer';
}

function showFinalScore() {
    const percentage = Math.round((score / questionsAnswered) * 100);
    document.getElementById('arabicDisplay').textContent = '🎉';

    const feedbackDiv = document.getElementById('feedback');
    feedbackDiv.innerHTML = `
        <div style="font-size: 1.5em; margin: 20px 0;">
            Quiz terminé!<br>
            Score final: ${score} / ${questionsAnswered} (${percentage}%)
        </div>
    `;
    feedbackDiv.className = 'feedback';

    const inputSection = document.querySelector('.input-section');
    inputSection.innerHTML = `
        <button class="btn-primary retake-btn" id="retakeBtn">Refaire le Quiz</button>
    `;

    document.getElementById('retakeBtn').addEventListener('click', startQuiz);
}

function updateScore() {
    document.getElementById('score').textContent = `Score: ${score} / ${questionsAnswered}`;
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && !document.getElementById('answerInput').disabled) {
        checkAnswer();
    }
}

// Initialize
initCategoryGrid();

// Add event listeners
document.getElementById('selectAllBtn').addEventListener('click', selectAll);
document.getElementById('deselectAllBtn').addEventListener('click', deselectAll);
document.getElementById('startQuizBtn').addEventListener('click', startQuiz);
document.getElementById('backToSetupBtn').addEventListener('click', backToSetup);
document.getElementById('backToSetupFromLearnBtn').addEventListener('click', backToSetup);
document.getElementById('submitBtn').addEventListener('click', checkAnswer);
document.getElementById('answerInput').addEventListener('keypress', handleKeyPress);

// Mode selection
document.getElementById('learnModeBtn').addEventListener('click', function () {
    appMode = 'learn';
    document.getElementById('learnModeBtn').classList.add('active');
    document.getElementById('quizModeBtn').classList.remove('active');
    document.getElementById('quizModeSection').style.display = 'none';
    document.getElementById('startQuizBtn').textContent = 'Démarrer l\'apprentissage';
});

document.getElementById('quizModeBtn').addEventListener('click', function () {
    appMode = 'quiz';
    document.getElementById('quizModeBtn').classList.add('active');
    document.getElementById('learnModeBtn').classList.remove('active');
    document.getElementById('quizModeSection').style.display = 'block';
    document.getElementById('startQuizBtn').textContent = 'Démarrer le Quiz';
});