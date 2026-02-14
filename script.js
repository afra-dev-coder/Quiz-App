import { auth, db } from './firebase.config.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref, set, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const questions = [
    {
        question: "What does HTML stand for?",
        answers: [
            { text: "Hyper Text Markup Language", correct: true },
            { text: "High Text Machine Language", correct: false },
            { text: "Hyper Tool Multi Language", correct: false },
            { text: "Hyper Transfer Markup Language", correct: false },
        ]
    },
    {
        question: "Which tag is used for the largest heading in HTML?",
        answers: [
            { text: "<h6>", correct: false },
            { text: "<h3>", correct: false },
            { text: "<h1>", correct: true },
            { text: "<head>", correct: false },
        ]
    },
    {
        question: "Which CSS property is used to change the background color?",
        answers: [
            { text: "color", correct: false },
            { text: "bgcolor", correct: false },
            { text: "background-color", correct: true },
            { text: "all-color", correct: false },
        ]
    },
    {
        question: "JavaScript is a ___ language.",
        answers: [
            { text: "Markup", correct: false },
            { text: "Programming", correct: true },
            { text: "Design", correct: false },
            { text: "Data", correct: false },
        ]
    },
    {
        question: "Which symbol is used for an ID selector in CSS?",
        answers: [
            { text: ".", correct: false },
            { text: "#", correct: true },
            { text: "&", correct: false },
            { text: "@", correct: false },
        ]
    },
    {
        question: "Which property is used to change the font of an element?",
        answers: [
            { text: "font-weight", correct: false },
            { text: "font-family", correct: true },
            { text: "font-style", correct: false },
            { text: "font-size", correct: false },
        ]
    },
    {
        question: "How do you write 'Hello World' in an alert box?",
        answers: [
            { text: "msg('Hello World');", correct: false },
            { text: "alertBox('Hello World');", correct: false },
            { text: "msgBox('Hello World');", correct: false },
            { text: "alert('Hello World');", correct: true },
        ]
    },
    {
        question: "Inside which HTML element do we put the JavaScript?",
        answers: [
            { text: "<js>", correct: false },
            { text: "<scripting>", correct: false },
            { text: "<script>", correct: true },
            { text: "<javascript>", correct: false },
        ]
    },
    {
        question: "Which HTML element is used to define important text?",
        answers: [
            { text: "<strong>", correct: true },
            { text: "<i>", correct: false },
            { text: "<important>", correct: false },
            { text: "<b>", correct: false },
        ]
    },
    {
        question: "What is the correct way to write a JavaScript array?",
        answers: [
            { text: "var colors = 1 = ('red'), 2 = ('green')", correct: false },
            { text: "var colors = (1:'red', 2:'green')", correct: false },
            { text: "var colors = ['red', 'green', 'blue']", correct: true },
            { text: "var colors = 'red', 'green', 'blue'", correct: false },
        ]
    },
    {
        question: "Which operator is used to assign a value to a variable?",
        answers: [
            { text: "x", correct: false },
            { text: "-", correct: false },
            { text: "*", correct: false },
            { text: "=", correct: true },
        ]
    },
    {
        question: "Which HTML attribute is used to define inline styles?",
        answers: [
            { text: "style", correct: true },
            { text: "class", correct: false },
            { text: "font", correct: false },
            { text: "styles", correct: false },
        ]
    },
    {
        question: "What does CSS stand for?",
        answers: [
            { text: "Colorful Style Sheets", correct: false },
            { text: "Computer Style Sheets", correct: false },
            { text: "Cascading Style Sheets", correct: true },
            { text: "Creative Style Sheets", correct: false },
        ]
    },
    {
        question: "Which sign does jQuery use as a shortcut?",
        answers: [
            { text: "the % sign", correct: false },
            { text: "the ? sign", correct: false },
            { text: "the $ sign", correct: true },
            { text: "the @ sign", correct: false },
        ]
    },
    {
        question: "How do you call a function named 'myFunction'?",
        answers: [
            { text: "call myFunction()", correct: false },
            { text: "myFunction()", correct: true },
            { text: "call function myFunction()", correct: false },
            { text: "invoke myFunction()", correct: false },
        ]
    }
];

let currentQuestionIndex = 0;
let score = 0;

// DOM Elements
const authContainer = document.getElementById('auth-container');
const quizApp = document.getElementById('quiz-app');
const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const authDesc = document.getElementById('auth-desc');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const toggleAuthText = document.getElementById('toggle-auth-text');
const signupFields = document.getElementById('signup-fields');
const displayNameSpan = document.getElementById('display-name');
const logoutBtn = document.getElementById('logout-btn');
const skipBtn = document.getElementById('skip-btn');
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const progressBar = document.getElementById("progress-bar");

let isLoginMode = true;

// Initialize on Load
window.addEventListener('DOMContentLoaded', () => {
    // We'll let onAuthStateChanged handle the initial visibility
});

// Toggle Login/Signup
function updateToggle() {
    if (isLoginMode) {
        authTitle.innerText = "Welcome Back";
        authDesc.innerText = "Login to start your premium quiz journey";
        authSubmitBtn.innerHTML = `<span>Login</span> <i class="fas fa-arrow-right"></i>`;
        toggleAuthText.innerHTML = `Don't have an account? <span id="toggle-auth">Sign Up</span>`;
        signupFields.style.display = "none";
        document.getElementById('user-name').required = false;
    } else {
        authTitle.innerText = "Create Account";
        authDesc.innerText = "Sign up to track your progress and rankings!";
        authSubmitBtn.innerHTML = `<span>Sign Up</span> <i class="fas fa-user-plus"></i>`;
        toggleAuthText.innerHTML = `Already have an account? <span id="toggle-auth">Login</span>`;
        signupFields.style.display = "block";
        document.getElementById('user-name').required = true;
    }
}

// Fixed: Single global event listener for the toggle link
document.addEventListener('click', (e) => {
    if (e.target.id === 'toggle-auth') {
        isLoginMode = !isLoginMode;
        updateToggle();
    }
});

// Initial toggle setup
updateToggle();

// Handle Auth Form Submission
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('user-email').value;
    const password = document.getElementById('user-password').value;
    const name = document.getElementById('user-name').value;

    const originalBtnContent = authSubmitBtn.innerHTML;
    authSubmitBtn.innerHTML = `<span>Processing...</span> <i class="fas fa-spinner fa-spin"></i>`;
    authSubmitBtn.disabled = true;

    try {
        if (isLoginMode) {
            await signInWithEmailAndPassword(auth, email, password);
        } else {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await updateProfile(user, { displayName: name });

            // Save to Realtime Database
            await set(ref(db, 'users/' + user.uid), {
                username: name,
                email: email,
                createdAt: new Date().toISOString()
            });
        }
        // Success: onAuthStateChanged will handle visibility
    } catch (error) {
        console.error("Auth Error:", error);
        alert("Error: " + error.message);
    } finally {
        authSubmitBtn.innerHTML = originalBtnContent;
        authSubmitBtn.disabled = false;
    }
});

// Guest Access
skipBtn.addEventListener('click', () => {
    authContainer.style.display = "none";
    quizApp.style.display = "flex";
    displayNameSpan.innerText = "Guest Player";
    startQuiz();
});

// Track Auth State
onAuthStateChanged(auth, (user) => {
    if (user) {
        displayNameSpan.innerText = user.displayName || user.email;
        authContainer.style.display = "none";
        quizApp.style.display = "flex";
        startQuiz();
    } else {
        authContainer.style.display = "flex";
        quizApp.style.display = "none";
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    signOut(auth);
});

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.style.display = "none";
    showQuestion();
}

function updateProgressBar() {
    const progress = ((currentQuestionIndex) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function showQuestion() {
    resetState();
    updateProgressBar();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerText = `${questionNo}. ${currentQuestion.question}`;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.classList.add("btn");

        // Create span for text to preserve layout
        const textSpan = document.createElement("span");
        textSpan.textContent = answer.text; // Use textContent to safely show HTML tags as text
        button.appendChild(textSpan);

        answerButtons.appendChild(button);

        if (answer.correct) {
            button.dataset.correct = "true";
        }
        button.addEventListener("click", selectAnswer);
    });
}

function resetState() {
    nextButton.style.display = "none";
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target.closest('button');
    const isCorrect = selectedBtn.dataset.correct === "true";

    // Disable all buttons immediately
    Array.from(answerButtons.children).forEach(button => {
        button.disabled = true;
    });

    if (isCorrect) {
        selectedBtn.classList.add("correct");
        const icon = document.createElement("i");
        icon.className = "fas fa-check-circle";
        selectedBtn.appendChild(icon);
        score++;
    } else {
        selectedBtn.classList.add("incorrect");
        const icon = document.createElement("i");
        icon.className = "fas fa-times-circle";
        selectedBtn.appendChild(icon);

        // Highlight the correct answer
        Array.from(answerButtons.children).forEach(button => {
            if (button.dataset.correct === "true") {
                button.classList.add("correct");
                const correctIcon = document.createElement("i");
                correctIcon.className = "fas fa-check-circle";
                button.appendChild(correctIcon);
            }
        });
    }

    nextButton.style.display = "flex";
}

async function showScore() {
    resetState();
    progressBar.style.width = "100%";

    let resultText = "";
    if (score === questions.length) resultText = "Perfect Mastery! 🏆";
    else if (score > (questions.length * 0.7)) resultText = "Top Notch Performance! 🎉";
    else if (score > (questions.length * 0.4)) resultText = "Good Effort! 👍";
    else resultText = "Keep Practicing! 💪";

    questionElement.innerHTML = `
        <div class="score-card">
            <div class="result-icon">${score > (questions.length / 2) ? '🏆' : '🔥'}</div>
            <h2>${resultText}</h2>
            <div class="final-score">
                <span>Total Correct: ${score}</span>
                <span>Accuracy: ${Math.round((score / questions.length) * 100)}%</span>
            </div>
            <p>You matched <strong>${score}</strong> out of <strong>${questions.length}</strong> questions correctly.</p>
        </div>
    `;

    if (auth.currentUser) {
        try {
            const scoresRef = ref(db, 'scores/' + auth.currentUser.uid);
            await push(scoresRef, {
                score: score,
                total: questions.length,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error("Database Error:", error);
        }
    }

    nextButton.innerHTML = `Retake Quiz <i class="fas fa-redo"></i>`;
    nextButton.style.display = "flex";
}

nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else if (currentQuestionIndex === questions.length) {
        showScore();
    } else {
        startQuiz();
    }
});
