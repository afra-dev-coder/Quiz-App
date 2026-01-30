let questions = [
    {
       question: "HTML stands for?" ,
       answers: [
        { text: "Hyper Text Markup Language" , correct : true },
        { text: "High Text Machine Language" , correct : false },
        { text: "Hyper Tool Multi Language", correct : false},
        { text: "Hyper Transfer Markup  Language", correct : false},
  ]
    },
    
    {
       question: "Which tag is used for largest heading in HTML?" ,
       answers: [
        { text: "<h6> " , correct : false },
        { text: "<h3> " , correct : false },
        { text: "<h1> ", correct : true},
        { text: "<head>", correct : false},
  ]
    },
    {
       question: "Which tag is used to create a hyperlink?" ,
       answers: [
        { text: "<link>" , correct : false },
        { text: "<href> " , correct : false },
        { text: "<url>", correct : false},
        { text: "<a>", correct : true},
  ]
    },
    {
       question: "CSS stands for?" ,
       answers: [
        { text: "Colorful Style Sheets" , correct : false },
        { text: "Computer Style Sheets " , correct : false },
        { text: "Cascading  Style Sheets ", correct : true},
        { text: "Creative Style Sheets", correct : false},
  ]
    },
    {
       question: "Which property is used to change text color in CSS?" ,
       answers: [
        { text: "font-style" , correct : false },
        { text: "text-color" , correct : false },
        { text: "color", correct : true},
        { text: "background-color", correct : false},
  ]
    },
    {
       question: "Which symbol is used for id selector in CSS?" ,
       answers: [
        { text: " * " , correct : false },
        { text: " . " , correct : false },
        { text: " @ ", correct : false},
        { text: " # ", correct : true},
  ]
    },
    {
       question: "JavaScript is a ___ language." ,
       answers: [
        { text: "Markup" , correct : false },
        { text: "Styling" , correct : false },
        { text: "Programming", correct : true},
        { text: "Database ", correct : false},
  ]
    },
    {
       question: "Which keyword is used to declare a variable in JavaScript?" ,
       answers: [
        { text: "int" , correct : false },
        { text: "var" , correct : true },
        { text: "string", correct : false},
        { text: "define", correct : false},
  ]
    },
    {
       question: "Which method is used to show alert box?" ,
       answers: [
        { text: "prompt() " , correct : false },
        { text: "confirm() " , correct : false },
        { text: "alert() ", correct : true},
        { text: "messege() ", correct : false},
  ]
    },
    {
       question: "Which operator is used for comparison?" ,
       answers: [
        { text: " = " , correct : false },
        { text: " == " , correct : true },
        { text: " === ", correct : false},
        { text: " += ", correct : false},
  ]
    }
    
]
let questionElement = document.getElementById("question");

let answerButtons = document.getElementById("answer-buttons");
let nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

function startQuiz(){
     currentQuestionIndex = 0;
     score = 0;
     nextButton.innerHTML = "Next";
     showQuestion();
}
 function showQuestion(){
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + " . " + currentQuestion.question

    currentQuestion.answers.forEach(answer => {
    const button = document.createElement("button");
    button.textContent = answer.text; 
    button.classList.add("btn");
    answerButtons.appendChild(button);

    if (answer.correct) {
        button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
});

 } 
function resetState(){
    nextButton.style.display = "none";
    while(answerButtons.firstChild){
        answerButtons.removeChild(answerButtons.firstChild);
    }
}
function selectAnswer(e){
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if(isCorrect){
        selectedBtn.classList.add("correct");
        score++;
    } 
    else{
        selectedBtn.classList.add("incorrect")
    }
    Array.from(answerButtons.children).forEach(button => {
        if(button.dataset.correct === "true"){
            button.classList.add("correct");
        }
        button.disabled = true;
    })
    nextButton.style.display ="block"
}
function showScore(){
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "block"; 
}

function handleNextButton(){
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length){
        showQuestion();
    }
    else{
        showScore();
    }
}
    nextButton.addEventListener("click", ()=>{
        if(currentQuestionIndex < questions.length){
            handleNextButton();
        }
        else{
            startQuiz();
        }
    })
 startQuiz();