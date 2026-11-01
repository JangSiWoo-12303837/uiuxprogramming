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
const practiceForm = document.querySelector("#practiceForm");
const targetOption = document.querySelector("#targetOption");
const targetFields = document.querySelector("#targetFields");
const targetRole = document.querySelector("#targetRole");
const submitStatus = document.querySelector("#submitStatus");
const saveButton = document.querySelector("#saveButton");
const storageKey = "interview-practice-latest-v1";
let savedRecord = null;
let isSaving = false;

function syncTargetFields() {
  const open = targetOption.checked;
  targetOption.setAttribute("aria-expanded", String(open));
  targetFields.hidden = !open;
  targetFields.disabled = !open;
  targetRole.disabled = !open;
  if (!open) clearFieldError(targetRole, "roleError");
  updateRole();
}

function clearFieldError(input, errorId) {
  input.removeAttribute("aria-invalid");
  input.classList.remove("has-error");
  document.getElementById(errorId).textContent = "";
}

function validateField(input, errorId, minimum, maximum, label) {
  const length = input.value.trim().length;
  const subject = label + (label === "답변" ? "을" : "를");
  let message = "";
  if (length === 0) message = subject + " 입력해 주세요. 공백만 입력할 수 없습니다.";
  else if (length < minimum) message = subject + " " + minimum + "자 이상 입력해 주세요. 현재 " + length + "자입니다.";
  else if (length > maximum) message = subject + " " + maximum + "자 이하로 줄여 주세요.";
  clearFieldError(input, errorId);
  if (message) {
    input.setAttribute("aria-invalid", "true");
    input.classList.add("has-error");
    document.getElementById(errorId).textContent = message;
  }
  input.classList.toggle("is-valid", !message);
  return !message;
}

function updateRole() {
  if (targetRole.getAttribute("aria-invalid") === "true") {
    validateField(targetRole, "roleError", 2, 40, "지원 직무");
  }
  const length = targetRole.value.trim().length;
  const valid = targetOption.checked && length >= 2 && length <= 40;
  targetRole.classList.toggle("is-valid", valid);
  document.querySelector("#roleMessage").textContent = targetRole.value.length + " / 40자" + (valid ? " · 입력 조건을 충족했습니다." : "");
}

function validatePractice() {
  const answerValid = validateField(answerInput, "answerError", 20, 500, "답변");
  const roleValid = !targetOption.checked || validateField(targetRole, "roleError", 2, 40, "지원 직무");
  if (!answerValid || !roleValid) {
    showEditor();
    (answerValid ? targetRole : answerInput).focus();
    return false;
  }
  return true;
}

targetOption.addEventListener("change", function () {
  syncTargetFields();
  submitStatus.textContent = "";
});
targetRole.addEventListener("input", function () {
  updateRole();
  submitStatus.textContent = "";
});

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
  if (answerInput.getAttribute("aria-invalid") === "true") {
    validateField(answerInput, "answerError", 20, 500, "답변");
  }
  const length = answerInput.value.trim().length;
  const valid = length >= 20 && length <= 500;
  answerInput.classList.toggle("is-valid", valid);
  answerMessage.textContent = answerInput.value.length + " / 500자 · " + (valid ? "입력 조건을 충족했습니다." : "20자 이상 작성해 주세요.");
  submitStatus.textContent = "";
}

function showEditor() {
  document.querySelector("#checkAnswerButton").disabled = false;
  answerEditor.hidden = false;
  answerConfirm.hidden = true;
  showTab(1);
  answerInput.focus();
}

questionSelect.addEventListener("change", function () {
  questionMessage.textContent = "선택한 질문: " + questionSelect.value;
  practiceQuestion.textContent = questionSelect.value;
  answerInput.value = "";
  clearFieldError(answerInput, "answerError");
  answerEditor.hidden = false;
  answerConfirm.hidden = true;
  confirmQuestion.textContent = "";
  confirmAnswer.textContent = "";
  document.querySelector("#checkAnswerButton").disabled = false;
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

function showConfirmation() {
  document.querySelector("#checkAnswerButton").disabled = true;
  confirmQuestion.textContent = questionSelect.value;
  confirmAnswer.textContent = answerInput.value.trim();
  document.querySelector("#confirmContext").textContent = targetOption.checked ? "지원 직무: " + targetRole.value.trim() : "일반 면접 연습";
  answerEditor.hidden = true;
  answerConfirm.hidden = false;
  showTab(1);
  document.querySelector("#confirmTitle").focus();
}

document.querySelector("#backAnswerButton").addEventListener("click", function () {
  showEditor();
});

function renderRecord(record) {
  completeMessage.textContent = "답변 기록이 완료되었습니다. 이 브라우저에서 다시 확인할 수 있습니다.";
  recordQuestion.textContent = record.question;
  recordAnswer.textContent = record.answer;
  document.querySelector("#recordContext").textContent = record.targeted ? "지원 직무: " + record.targetRole : "일반 면접 연습";
  completeMessage.hidden = false;
  recordActions.hidden = false;
  hasRecord = true;
  resetReview();
  reviewBox.hidden = true;
  writeAnswerButton.hidden = true;
  reviewMessage.textContent = "답변을 기록했습니다. 답변 점검하기를 눌러 점검해 보세요.";
}

// 확인과 저장 모두 submit에서 처리한다. 저장 중 Enter와 연속 클릭도 차단한다.
practiceForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  if (isSaving) return;
  if (!validatePractice()) return;
  if (answerConfirm.hidden || event.submitter !== saveButton) {
    showConfirmation();
    return;
  }
  const data = new FormData(practiceForm);
  const record = {
    question: String(data.get("question")),
    answer: String(data.get("answer")).trim(),
    targeted: data.get("targeted") === "yes"
  };
  // 비활성화한 직무 입력은 FormData와 저장 객체에서 모두 제외한다.
  if (record.targeted) record.targetRole = String(data.get("targetRole")).trim();
  isSaving = true;
  practiceForm.setAttribute("aria-busy", "true");
  const controls = [...document.querySelectorAll("#features button, #practiceForm input, #practiceForm select, #practiceForm textarea")];
  const previousDisabled = controls.map(control => control.disabled);
  controls.forEach(control => { control.disabled = true; });
  saveButton.textContent = "기록 저장 중…";
  submitStatus.classList.remove("is-error");
  submitStatus.textContent = "답변을 이 브라우저에 저장하고 있습니다.";
  let succeeded = false;
  try {
    await new Promise(resolve => window.setTimeout(resolve, 700));
    if (new URLSearchParams(location.search).get("save-error") === "1") {
      throw new Error("저장 실패 확인용");
    }
    localStorage.setItem(storageKey, JSON.stringify(record));
    savedRecord = record;
    renderRecord(record);
    submitStatus.textContent = "답변 기록이 완료되었습니다.";
    showTab(2);
    succeeded = true;
  } catch {
    submitStatus.classList.add("is-error");
    submitStatus.textContent = "답변을 저장하지 못했습니다. 입력 내용은 유지됩니다. 브라우저 저장 설정을 확인한 뒤 다시 기록해 주세요.";
  } finally {
    isSaving = false;
    practiceForm.setAttribute("aria-busy", "false");
    controls.forEach((control, index) => { control.disabled = previousDisabled[index]; });
    saveButton.textContent = "답변 기록 완료하기";
    if (succeeded) document.querySelector("#editRecordButton").focus();
  }
});

document.querySelector("#editRecordButton").addEventListener("click", function () {
  questionSelect.value = recordQuestion.textContent;
  questionMessage.textContent = "선택한 질문: " + questionSelect.value;
  practiceQuestion.textContent = questionSelect.value;
  answerInput.value = recordAnswer.textContent;
  targetOption.checked = savedRecord.targeted;
  targetRole.value = savedRecord.targetRole || "";
  clearFieldError(answerInput, "answerError");
  clearFieldError(targetRole, "roleError");
  syncTargetFields();
  updateAnswer();
  showEditor();
});

// 다시 시작하면 연습 내용과 기록을 모두 지운다.
document.querySelector("#restartButton").addEventListener("click", function () {
  try {
    localStorage.removeItem(storageKey);
  } catch {
    reviewMessage.textContent = "저장 기록을 지우지 못했습니다. 브라우저 저장 설정을 확인한 뒤 다시 시도해 주세요.";
    return;
  }
  practiceForm.reset();
  clearFieldError(answerInput, "answerError");
  clearFieldError(targetRole, "roleError");
  syncTargetFields();
  savedRecord = null;
  document.querySelector("#confirmContext").textContent = "";
  document.querySelector("#recordContext").textContent = "";
  submitStatus.classList.remove("is-error");
  questionSelect.selectedIndex = 0;
  questionMessage.textContent = "선택한 질문: " + questionSelect.value;
  practiceQuestion.textContent = questionSelect.value;
  answerInput.value = "";
  updateAnswer();
  answerEditor.hidden = false;
  answerConfirm.hidden = true;
  document.querySelector("#checkAnswerButton").disabled = false;
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

syncTargetFields();
// 손상되었거나 이전 형식의 저장값은 화면에 복원하지 않는다.
try {
  const record = JSON.parse(localStorage.getItem(storageKey));
  const questions = [...questionSelect.options].map(option => option.value);
  if (record && questions.includes(record.question) && typeof record.answer === "string" && record.answer.trim().length >= 20 && record.answer.length <= 500 && typeof record.targeted === "boolean" && (!record.targeted || (typeof record.targetRole === "string" && record.targetRole.trim().length >= 2 && record.targetRole.length <= 40))) {
    savedRecord = record;
    renderRecord(record);
    completeMessage.textContent = "이 브라우저에 저장한 최근 답변을 불러왔습니다.";
  }
} catch {
  // 저장 접근이 차단되어도 작성은 가능하며 제출 시 실패를 안내한다.
}

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
