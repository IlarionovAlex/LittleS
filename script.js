let questions = [];
let currentQuestion = 0;
let wrong = [];
let correctCount = 0;
const setupDiv = document.getElementById('setup');
const examDiv = document.getElementById('exam');
const questionContainer = document.getElementById('questionContainer');
const resultDiv = document.getElementById('result');
const scoreP = document.getElementById('score');
const wrongDiv = document.getElementById('wrongAnswers');
const fileInput = document.getElementById('fileInput');

document.getElementById('startBtn').onclick = () => {
 const file = fileInput.files[0];
 if (!file) {
   alert('Please select a JSON file.');
   return;
 }
 const reader = new FileReader();
 reader.onload = () => {
   try {
     questions = JSON.parse(reader.result);
     if (!Array.isArray(questions)) throw new Error('Invalid format');
     setupDiv.style.display = 'none';
     examDiv.style.display = 'block';
     currentQuestion = 0;
     wrong = [];
     correctCount = 0;
     showQuestion();
   } catch (err) {
     alert('Could not parse questions: ' + err.message);
   }
 };
 reader.onerror = () => alert('Error reading file.');
 reader.readAsText(file);
};

document.getElementById('nextBtn').onclick = () => {
 const selected = document.querySelector('input[name="answer"]:checked');
 if (!selected) {
   alert('Select an answer.');
   return;
 }
 const idx = parseInt(selected.value, 10);
 if (questions[currentQuestion].answers[idx].correct) {
   correctCount++;
 } else {
  wrong.push({q: questions[currentQuestion], chosen: idx, number: currentQuestion + 1});
 }
 currentQuestion++;
 if (currentQuestion < questions.length) {
   showQuestion();
 } else {
   finish();
 }
};

document.getElementById('restartBtn').onclick = () => {
 resultDiv.style.display = 'none';
 setupDiv.style.display = 'block';
 fileInput.value = '';
};

function showQuestion() {
  const q = questions[currentQuestion];
  questionContainer.innerHTML = `<h3>${currentQuestion + 1}. ${q.question}</h3>` +
    q.answers.map((a, i) =>
      `<label><input type="radio" name="answer" value="${i}"> ${a.text}</label><br>`
    ).join('');
}

function finish() {
 examDiv.style.display = 'none';
 resultDiv.style.display = 'block';
 scoreP.textContent = `Score: ${correctCount}/${questions.length}`;
 const list = wrong.map(item => {
   const correct = item.q.answers.find(a => a.correct);
  return `<div class='wrong'><strong>${item.number}. ${item.q.question}</strong><br>` +
    `Your answer: ${item.q.answers[item.chosen].text}<br>` +
    `Correct answer: <span class="correct">${correct.text}</span></div>`;
 }).join('<hr>');
 wrongDiv.innerHTML = list || '<p class="correct">All answers correct!</p>';
}
