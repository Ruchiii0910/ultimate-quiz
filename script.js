// create quiz logic with multiple questions and score tracking
const quizData = [
    {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        answer: "Paris",
        difficulty: "easy"
    },
    {
        question: "What is the largest planet in our solar system?",
        options: ["Earth", "Jupiter", "Mars", "Saturn"],
        answer: "Jupiter",
        difficulty: "easy"
    },
    {
        question: "Who wrote 'To Kill a Mockingbird'?",
        options: ["Harper Lee", "Mark Twain", "Ernest Hemingway", "F. Scott Fitzgerald"],
        answer: "Harper Lee",
        difficulty: "medium"
    },
    {
        question: "What is the chemical symbol for gold?",
        options: ["Au", "Ag", "Fe", "Cu"],
        answer: "Au",
        difficulty: "medium"
    },
    {
        question: "In which year did World War II end?",
        options: ["1944", "1945", "1946", "1947"],
        answer: "1945",
        difficulty: "medium"
    },
    {
        question: "What is the square root of 144?",
        options: ["10", "11", "12", "13"],
        answer: "12",
        difficulty: "easy"
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Leonardo da Vinci", "Pablo Picasso", "Vincent van Gogh", "Michelangelo"],
        answer: "Leonardo da Vinci",
        difficulty: "medium"
    },
    {
        question: "What is the hardest natural substance on Earth?",
        options: ["Gold", "Iron", "Diamond", "Platinum"],
        answer: "Diamond",
        difficulty: "hard"
    },
    {
        question: "In physics, what does E=mc² represent?",
        options: ["Newton's Law", "Einstein's Theory of Relativity", "Ohm's Law", "Boyle's Law"],
        answer: "Einstein's Theory of Relativity",
        difficulty: "hard"
    },
    {
        question: "What is the capital of Australia?",
        options: ["Sydney", "Melbourne", "Canberra", "Perth"],
        answer: "Canberra",
        difficulty: "hard"
    }
];
let currentQuestionIndex = 0;
let score = 0;
let filteredQuestions = [];
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const scoreElement = document.getElementById("score");
const nextButton = document.getElementById("next");
const startButton = document.getElementById("start-quiz");
const difficultySelect = document.getElementById("difficulty");
const quizContent = document.getElementById("quiz-content");
const difficultySelector = document.querySelector(".difficulty-selector");
const viewHighScoresButton = document.getElementById("view-high-scores");

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function saveHighScore(score, difficulty) {
    const highScores = loadHighScores();
    const newScore = {
        score: score,
        difficulty: difficulty,
        date: new Date().toLocaleDateString()
    };
    highScores.push(newScore);
    highScores.sort((a, b) => b.score - a.score);
    if (highScores.length > 10) {
        highScores.splice(10);
    }
    localStorage.setItem('quizHighScores', JSON.stringify(highScores));
}

function loadHighScores() {
    const stored = localStorage.getItem('quizHighScores');
    return stored ? JSON.parse(stored) : [];
}

function displayHighScores() {
    const highScores = loadHighScores();
    questionElement.textContent = "";
    optionsElement.innerHTML = "";
    nextButton.style.display = "none";
    scoreElement.textContent = "";
    
    const highScoresDiv = document.createElement("div");
    highScoresDiv.className = "high-scores";
    highScoresDiv.innerHTML = "<h2>🏆 High Scores</h2>";
    if (highScores.length === 0) {
        highScoresDiv.innerHTML += "<p>🏅 No high scores yet! Be the first!</p>";
    } else {
        const ul = document.createElement("ul");
        highScores.forEach((entry, index) => {
            const li = document.createElement("li");
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅';
            li.textContent = `${medal} Score: ${entry.score} (${entry.difficulty}) - ${entry.date}`;
            ul.appendChild(li);
        });
        highScoresDiv.appendChild(ul);
    }
    const backButton = document.createElement("button");
    backButton.className = "back-button";
    backButton.textContent = "Back";
    backButton.addEventListener("click", () => {
        quizContent.innerHTML = `
            <div class="question" id="question"></div>
            <div class="options" id="options"></div>
            <button class="next-button" id="next">Next</button>
            <div class="score" id="score">Score: 0</div>
        `;
        // Reassign global elements
        questionElement = document.getElementById("question");
        optionsElement = document.getElementById("options");
        scoreElement = document.getElementById("score");
        nextButton = document.getElementById("next");
        attachNextButtonListener();
        difficultySelector.style.display = "block";
        quizContent.style.display = "none";
    });
    highScoresDiv.appendChild(backButton);
    quizContent.innerHTML = "";
    quizContent.appendChild(highScoresDiv);
    quizContent.style.display = "block";
    difficultySelector.style.display = "none";
}

startButton.addEventListener("click", () => {
    const selectedDifficulty = difficultySelect.value;
    filteredQuestions = quizData.filter(q => q.difficulty === selectedDifficulty);
    if (filteredQuestions.length === 0) {
        alert("No questions available for this difficulty.");
        return;
    }
    shuffleArray(filteredQuestions);
    currentQuestionIndex = 0;
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    difficultySelector.style.display = "none";
    quizContent.style.display = "block";
    loadQuestion();
});

viewHighScoresButton.addEventListener("click", displayHighScores);

function loadQuestion() {
    const currentQuestion = filteredQuestions[currentQuestionIndex];
    questionElement.textContent = `Question ${currentQuestionIndex + 1} of ${filteredQuestions.length}\n\n${currentQuestion.question}`;
    optionsElement.innerHTML = "";
    currentQuestion.options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.className = "option-button";
        button.addEventListener("click", () => {
            // Disable all option buttons after selection
            const buttons = optionsElement.querySelectorAll(".option-button");
            buttons.forEach(btn => btn.disabled = true);
            if (option === currentQuestion.answer) {
                score++;
            }
            scoreElement.textContent = `Score: ${score}`;
            nextButton.disabled = false;
        });
        optionsElement.appendChild(button);
    });
    nextButton.disabled = true;
}

function attachNextButtonListener() {
    nextButton.addEventListener("click", () => {    
        currentQuestionIndex++;
        if (currentQuestionIndex < filteredQuestions.length) {
            loadQuestion();
        } else {
            questionElement.textContent = `🎉 Quiz Completed! 🎉\n\nYour final score is ${score}/${filteredQuestions.length}`;
            optionsElement.innerHTML = "";
            nextButton.style.display = "none";
            const restartButton = document.createElement("button");
            restartButton.textContent = "🔄 Restart Quiz";
            restartButton.className = "next-button";
            restartButton.addEventListener("click", () => {
                difficultySelector.style.display = "block";
                quizContent.style.display = "none";
            });
            optionsElement.appendChild(restartButton);
            saveHighScore(score, difficultySelect.value);
        }   
    });
}

attachNextButtonListener();

