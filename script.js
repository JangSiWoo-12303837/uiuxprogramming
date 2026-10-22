const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");
const practiceProgress = document.querySelector("#practiceProgress");
const questionSelect = document.querySelector("#questionSelect");
const questionMessage = document.querySelector("#questionMessage");
const practiceQuestion = document.querySelector("#practiceQuestion");
const answerInput = document.querySelector("#answerInput");
const answerMessage = document.querySelector("#answerMessage");
const answerEditor = document.querySelector("#answerEditor");
const answerConfirm = document.querySelector("#answerConfirm");
const confirmQuestion = document.querySelector("#confirmQuestion");
const confirmAnswer = document.querySelector("#confirmAnswer");
const recordQuestion = document.querySelector("#recordQuestion");
const recordAnswer = document.querySelector("#recordAnswer");
const completeMessage = document.querySelector("#completeMessage");
const recordActions = document.querySelector("#recordActions");

// 탭 이동과 진행 안내를 함께 바꾼다.
function showTab(index) {
  for (let i = 0; i < tabButtons.length; i++) {
    tabButtons[i].classList.remove("is-active");
    tabButtons[i].setAttribute("aria-pressed", "false");
    tabPanels[i].hidden = true;
  }
  tabButtons[index].classList.add("is-active");
  tabButtons[index].setAttribute("aria-pressed", "true");
  tabPanels[index].hidden = false;

  if (index === 0) {
    practiceProgress.textContent = "1 / 3 · 질문 선택";
  } else if (index === 1 && answerConfirm.hidden) {
    practiceProgress.textContent = "2 / 3 · 답변 입력";
  } else if (index === 1) {
    practiceProgress.textContent = "3 / 3 · 내용 확인";
  } else if (!completeMessage.hidden) {
    practiceProgress.textContent = "기록 완료";
  } else {
    practiceProgress.textContent = "연습 기록";
  }
}

for (let i = 0; i < tabButtons.length; i++) {
  tabButtons[i].addEventListener("click", function () {
    showTab(i);
  });
}

function updateAnswer() {
  answerMessage.classList.remove("is-error");
  answerInput.classList.remove("has-error");
  answerInput.removeAttribute("aria-invalid");
  if (answerInput.value.trim() === "") {
    answerMessage.textContent = answerInput.value.length + " / 500자 · 답변을 입력해 주세요.";
  } else {
    answerMessage.textContent = answerInput.value.length + " / 500자 · 작성한 내용을 확인해 보세요.";
  }
}

function showEditor() {
  answerEditor.hidden = false;
  answerConfirm.hidden = true;
  showTab(1);
  answerInput.focus();
}

questionSelect.addEventListener("change", function () {
  questionMessage.textContent = "선택한 질문: " + questionSelect.value;
  practiceQuestion.textContent = questionSelect.value;
  answerInput.value = "";
  answerEditor.hidden = false;
  answerConfirm.hidden = true;
  confirmQuestion.textContent = "";
  confirmAnswer.textContent = "";
  updateAnswer();
});

answerInput.addEventListener("input", updateAnswer);

document.querySelector("#startButton").addEventListener("click", function () {
  showEditor();
});

document.querySelector("#backQuestionButton").addEventListener("click", function () {
  showTab(0);
  questionSelect.focus();
});

// 빈 답변이면 같은 화면에서 수정하도록 안내한다.
document.querySelector("#checkAnswerButton").addEventListener("click", function () {
  if (answerInput.value.trim() === "") {
    answerMessage.textContent = "답변이 비어 있습니다. 공백 외의 내용을 입력한 뒤 다시 확인해 주세요.";
    answerMessage.classList.add("is-error");
    answerInput.classList.add("has-error");
    answerInput.setAttribute("aria-invalid", "true");
    answerInput.focus();
    return;
  }
  confirmQuestion.textContent = questionSelect.value;
  confirmAnswer.textContent = answerInput.value.trim();
  answerEditor.hidden = true;
  answerConfirm.hidden = false;
  showTab(1);
  document.querySelector("#confirmTitle").focus();
});

document.querySelector("#backAnswerButton").addEventListener("click", function () {
  showEditor();
});

document.querySelector("#saveButton").addEventListener("click", function () {
  recordQuestion.textContent = confirmQuestion.textContent;
  recordAnswer.textContent = confirmAnswer.textContent;
  completeMessage.hidden = false;
  recordActions.hidden = false;
  showTab(2);
  document.querySelector("#editRecordButton").focus();
});

document.querySelector("#editRecordButton").addEventListener("click", function () {
  questionSelect.value = recordQuestion.textContent;
  questionMessage.textContent = "선택한 질문: " + questionSelect.value;
  practiceQuestion.textContent = questionSelect.value;
  answerInput.value = recordAnswer.textContent;
  updateAnswer();
  showEditor();
});

// 다시 시작하면 연습 내용과 기록을 모두 지운다.
document.querySelector("#restartButton").addEventListener("click", function () {
  questionSelect.selectedIndex = 0;
  questionMessage.textContent = "선택한 질문: " + questionSelect.value;
  practiceQuestion.textContent = questionSelect.value;
  answerInput.value = "";
  updateAnswer();
  answerEditor.hidden = false;
  answerConfirm.hidden = true;
  confirmQuestion.textContent = "";
  confirmAnswer.textContent = "";
  recordQuestion.textContent = "아직 기록한 답변이 없습니다.";
  recordAnswer.textContent = "답변 연습 탭에서 답변을 작성하고 기록해 보세요.";
  completeMessage.hidden = true;
  recordActions.hidden = true;
  showTab(0);
  questionSelect.focus();
});

const subscribeForm = document.querySelector("#subscribeForm");
const emailInput = document.querySelector("#email");
const subscribeButton = document.querySelector("#subscribeButton");
const subscribeMessage = document.querySelector("#subscribeMessage");

emailInput.addEventListener("input", function () {
  subscribeMessage.classList.remove("is-success");
  subscribeButton.textContent = "면접 팁 신청하기";

  if (emailInput.value === "") {
    subscribeMessage.textContent = "이메일을 입력한 뒤 신청해주세요.";
    subscribeButton.disabled = true;
  } else if (!emailInput.validity.valid) {
    subscribeMessage.textContent = "이메일 형식을 확인해 주세요. 예: name@example.com";
    subscribeButton.disabled = true;
  } else {
    subscribeMessage.textContent = "신청할 수 있는 이메일입니다.";
    subscribeButton.disabled = false;
  }
});

subscribeForm.addEventListener("submit", function (event) {
  event.preventDefault();
  subscribeMessage.textContent = emailInput.value + "로 신청이 완료되었습니다. (실습용)";
  subscribeMessage.classList.add("is-success");
  subscribeButton.textContent = "신청 완료";
  subscribeButton.disabled = true;
});
