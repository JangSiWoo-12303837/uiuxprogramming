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
const reviewMessage = document.querySelector("#reviewMessage");
const writeAnswerButton = document.querySelector("#writeAnswerButton");
const reviewBox = document.querySelector("#reviewBox");
const reviewChecks = document.querySelectorAll(".review-check");
const reviewResult = document.querySelector("#reviewResult");
const reviewScore = document.querySelector("#reviewScore");
const reviewFeedback = document.querySelector("#reviewFeedback");
const reviewTips = document.querySelector("#reviewTips");
let hasRecord = false;

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
  hasRecord = true;
  resetReview();
  reviewBox.hidden = true;
  writeAnswerButton.hidden = true;
  reviewMessage.textContent = "답변을 기록했습니다. 답변 점검하기를 눌러 점검해 보세요.";
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
  hasRecord = false;
  resetReview();
  reviewBox.hidden = true;
  writeAnswerButton.hidden = true;
  reviewMessage.textContent = "기록한 답변을 읽으며 스스로 점검해 보세요.";
  showTab(0);
  questionSelect.focus();
});

// 기록을 마친 뒤 답변을 스스로 점검한다.
document.querySelector("#reviewButton").addEventListener("click", function () {
  if (hasRecord === false) {
    reviewMessage.textContent = "점검할 답변이 없습니다. 먼저 답변을 작성하고 기록해 주세요.";
    writeAnswerButton.hidden = false;
    return;
  }
  reviewBox.hidden = false;
  reviewMessage.textContent = "기록한 답변을 읽고 잘 지킨 항목을 체크해 주세요.";
  document.querySelector("#reviewTitle").focus();
});

writeAnswerButton.addEventListener("click", function () {
  showEditor();
});

document.querySelector("#reviewResultButton").addEventListener("click", function () {
  const tips = [
    "질문에서 묻는 내용에 맞춰 첫 문장을 써 보세요.",
    "직접 겪은 경험이나 그렇게 생각한 이유를 하나 넣어 보세요.",
    "반복되는 표현을 줄이고 핵심 내용부터 말해 보세요."
  ];
  let count = 0;
  reviewTips.textContent = "";

  for (let i = 0; i < reviewChecks.length; i++) {
    if (reviewChecks[i].checked) {
      count += 1;
    } else {
      const tip = document.createElement("li");
      tip.textContent = tips[i];
      reviewTips.appendChild(tip);
    }
  }

  reviewScore.textContent = "3개 중 " + count + "개 항목을 지켰습니다.";
  if (count === 3) {
    reviewFeedback.textContent = "모든 항목을 지켰네요. 작성한 답변을 소리 내어 연습해 보세요.";
  } else if (count === 0) {
    reviewFeedback.textContent = "체크한 항목이 없습니다. 아래 내용을 참고해서 한 가지씩 보완해 보세요.";
  } else {
    reviewFeedback.textContent = "잘 지킨 부분은 유지하고, 아래 내용을 보완해 보세요.";
  }
  reviewResult.hidden = false;
  document.querySelector("#reviewResultTitle").focus();
});

for (let i = 0; i < reviewChecks.length; i++) {
  reviewChecks[i].addEventListener("change", function () {
    reviewResult.hidden = true;
    reviewMessage.textContent = "체크한 내용이 바뀌었습니다. 점검 결과 보기를 다시 눌러 주세요.";
  });
}

document.querySelector("#closeReviewButton").addEventListener("click", function () {
  reviewBox.hidden = true;
  reviewMessage.textContent = "점검을 닫았습니다. 다시 열면 체크한 내용이 유지됩니다.";
  document.querySelector("#reviewButton").focus();
});

function resetReview() {
  for (let i = 0; i < reviewChecks.length; i++) {
    reviewChecks[i].checked = false;
  }
  reviewResult.hidden = true;
  reviewScore.textContent = "";
  reviewFeedback.textContent = "";
  reviewTips.textContent = "";
}

document.querySelector("#restartReviewButton").addEventListener("click", function () {
  resetReview();
  reviewMessage.textContent = "체크와 결과를 지웠습니다. 기록한 답변을 다시 점검해 주세요.";
  reviewChecks[0].focus();
});

document.querySelector("#improveAnswerButton").addEventListener("click", function () {
  document.querySelector("#editRecordButton").click();
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
