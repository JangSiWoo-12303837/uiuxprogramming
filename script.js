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
const reviewMessage = document.querySelector("#reviewMessage");
const reviewBox = document.querySelector("#reviewBox");
const reviewChecks = document.querySelectorAll(".review-check");
const reviewResult = document.querySelector("#reviewResult");
const reviewScore = document.querySelector("#reviewScore");
const reviewFeedback = document.querySelector("#reviewFeedback");
const reviewTips = document.querySelector("#reviewTips");
const practiceForm = document.querySelector("#practiceForm");
const targetOption = document.querySelector("#targetOption");
const targetFields = document.querySelector("#targetFields");
const targetRole = document.querySelector("#targetRole");
const submitStatus = document.querySelector("#submitStatus");
const saveButton = document.querySelector("#saveButton");
const storageKey = "interview-practice-records-v2";
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

const mainNav = document.querySelector("#mainNav");
const navLinks = mainNav.querySelectorAll("a");
const menuToggle = document.querySelector("#menuToggle");
const mobileMenu = window.matchMedia("(max-width: 600px)");
const recordList = document.querySelector("#recordList");
const recordEmpty = document.querySelector("#recordEmpty");
const recordDetail = document.querySelector("#recordDetail");
const recordStatus = document.querySelector("#recordStatus");
const filterButtons = document.querySelectorAll(".filter-button");
let records = [];
let selectedRecordId = null;
let editingRecordId = null;
let currentFilter = "all";

function setMenuOpen(open) {
  mainNav.classList.toggle("is-open", open);
  menuToggle.textContent = open ? "메뉴 닫기" : "메뉴 열기";
  menuToggle.setAttribute("aria-expanded", String(open));
}

menuToggle.addEventListener("click", function () {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});
mobileMenu.addEventListener("change", function () { setMenuOpen(false); });
mainNav.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && mobileMenu.matches) {
    setMenuOpen(false);
    menuToggle.focus();
  }
});
navLinks.forEach(function (link) {
  link.addEventListener("click", function () { setMenuOpen(false); });
});

function setPracticePanel(index) {
  tabButtons.forEach(function (button, i) {
    button.classList.toggle("is-active", i === index);
    button.setAttribute("aria-pressed", String(i === index));
    tabPanels[i].hidden = i !== index;
  });
  practiceProgress.textContent = index === 0 ? "1 / 3 · 질문 선택"
    : answerConfirm.hidden ? "2 / 3 · 답변 입력" : "3 / 3 · 내용 확인";
}

// 주소를 기준으로 메뉴를 표시하므로 새로고침과 뒤로 가기도 같은 경로를 쓴다.
function updateLocation() {
  const hash = location.hash || "#about";
  const menuHash = hash === "#answerPanel" ? "#features" : hash;
  navLinks.forEach(function (link) {
    const current = link.getAttribute("href") === menuHash;
    link.classList.toggle("is-current", current);
    if (current) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
  const currentLink = mainNav.querySelector("[aria-current]");
  document.title = "면접 준비 서비스 | " + (currentLink ? currentLink.textContent : "면접 연습");
  if (hash === "#features") setPracticePanel(0);
  if (hash === "#answerPanel") setPracticePanel(1);
  setMenuOpen(false);
}
window.addEventListener("hashchange", updateLocation);

function moveTo(hash) {
  if (location.hash !== hash) location.hash = hash;
  updateLocation();
}

function showTab(index) {
  setPracticePanel(index);
  moveTo(index === 0 ? "#features" : "#answerPanel");
}
tabButtons.forEach(function (button, index) {
  button.addEventListener("click", function () { showTab(index); });
});

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
  document.querySelector("#checkAnswerButton").disabled = false;
  updateAnswer();
});
answerInput.addEventListener("input", updateAnswer);
document.querySelector("#startButton").addEventListener("click", function () {
  editingRecordId = null;
  showEditor();
});
document.querySelector("#backQuestionButton").addEventListener("click", function () {
  showTab(0);
  questionSelect.focus();
});
document.querySelector("#backAnswerButton").addEventListener("click", showEditor);

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

function saveRecords(nextRecords) {
  localStorage.setItem(storageKey, JSON.stringify(nextRecords));
  records = nextRecords;
}

function getVisibleRecords() {
  return records.filter(function (record) {
    if (currentFilter === "pending") return !record.reviewed;
    if (currentFilter === "reviewed") return record.reviewed;
    return true;
  });
}

function renderRecords() {
  const visible = getVisibleRecords();
  const names = { all: "전체", pending: "점검 전", reviewed: "점검 완료" };
  document.querySelector("#recordCount").textContent = names[currentFilter] + " · " + visible.length + "개";
  filterButtons.forEach(function (button) {
    const selected = button.dataset.filter === currentFilter;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  recordEmpty.hidden = visible.length !== 0;
  recordList.hidden = visible.length === 0;
  const noRecords = records.length === 0;
  recordEmpty.querySelector("h3").textContent = noRecords ? "아직 기록한 답변이 없습니다."
    : currentFilter === "pending" ? "점검을 기다리는 답변이 없습니다." : "점검을 마친 답변이 없습니다.";
  recordEmpty.querySelector("p").textContent = noRecords ? "면접 질문을 고르고 첫 답변을 작성해 보세요."
    : currentFilter === "pending" ? "전체에서 기록을 확인하거나 새 답변을 연습해 보세요."
    : "전체 또는 점검 전에서 답변을 열고 자기 점검을 해보세요.";
  recordEmpty.querySelector("a").hidden = !noRecords;
  recordList.replaceChildren();
  visible.forEach(function (record) {
    const item = document.createElement("li");
    item.className = "record-card";
    const state = document.createElement("p");
    state.className = "record-state";
    state.textContent = record.reviewed ? "점검 완료" : "점검 전";
    const title = document.createElement("h3");
    title.textContent = record.question;
    const context = document.createElement("p");
    context.textContent = record.targeted ? record.targetRole : "일반 면접 연습";
    const preview = document.createElement("p");
    preview.textContent = record.answer.length > 80 ? record.answer.slice(0, 80) + "…" : record.answer;
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "답변 보기";
    button.setAttribute("aria-label", record.question + " 답변 보기");
    button.addEventListener("click", function () {
      selectRecord(record.id);
      moveTo("#records");
      document.querySelector("#recordDetailTitle").focus();
    });
    item.append(state, title, context, preview, button);
    recordList.appendChild(item);
  });
}

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentFilter = button.dataset.filter;
    moveTo("#records");
    renderRecords();
    recordStatus.textContent = "";
    if (!getVisibleRecords().some(record => record.id === selectedRecordId)) {
      recordDetail.hidden = true;
      selectedRecordId = null;
    }
  });
});

function selectRecord(id) {
  const record = records.find(record => record.id === id);
  if (!record) return;
  selectedRecordId = id;
  recordDetail.hidden = false;
  completeMessage.hidden = true;
  recordQuestion.textContent = record.question;
  recordAnswer.textContent = record.answer;
  document.querySelector("#recordContext").textContent = record.targeted ? "지원 직무: " + record.targetRole : "일반 면접 연습";
  reviewChecks.forEach(function (check, index) { check.checked = record.checks[index]; });
  reviewResult.hidden = true;
  reviewBox.hidden = true;
  reviewMessage.textContent = record.reviewed ? "점검을 마친 답변입니다. 답변 점검하기를 눌러 결과를 다시 볼 수 있습니다."
    : "기록한 답변을 읽으며 스스로 점검해 보세요.";
}

practiceForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  if (isSaving || !validatePractice()) return;
  if (answerConfirm.hidden || event.submitter !== saveButton) {
    showConfirmation();
    return;
  }
  const data = new FormData(practiceForm);
  const record = {
    id: editingRecordId || crypto.randomUUID(),
    question: String(data.get("question")),
    answer: String(data.get("answer")).trim(),
    targeted: data.get("targeted") === "yes",
    checks: [false, false, false],
    reviewed: false
  };
  if (record.targeted) record.targetRole = String(data.get("targetRole")).trim();
  const nextRecords = editingRecordId ? records.map(item => item.id === editingRecordId ? record : item) : [record, ...records];
  isSaving = true;
  practiceForm.setAttribute("aria-busy", "true");
  const controls = [...document.querySelectorAll("#features button, #practiceForm input, #practiceForm select, #practiceForm textarea, #records button, #records input")];
  const previousDisabled = controls.map(control => control.disabled);
  controls.forEach(control => { control.disabled = true; });
  saveButton.textContent = "기록 저장 중…";
  submitStatus.classList.remove("is-error");
  submitStatus.textContent = "답변을 이 브라우저에 저장하고 있습니다.";
  let succeeded = false;
  try {
    await new Promise(resolve => window.setTimeout(resolve, 700));
    if (new URLSearchParams(location.search).get("save-error") === "1") throw new Error("저장 실패 확인용");
    saveRecords(nextRecords);
    editingRecordId = record.id;
    currentFilter = "all";
    renderRecords();
    selectRecord(record.id);
    completeMessage.textContent = "답변 기록이 완료되었습니다. 답변을 읽고 자기 점검을 해보세요.";
    completeMessage.hidden = false;
    submitStatus.textContent = "";
    recordStatus.classList.remove("is-error");
    recordStatus.textContent = "답변을 저장했습니다. 전체 " + records.length + "개 기록이 있습니다.";
    moveTo("#records");
    succeeded = true;
  } catch {
    submitStatus.classList.add("is-error");
    submitStatus.textContent = "답변을 저장하지 못했습니다. 입력 내용은 유지됩니다. 브라우저 저장 설정을 확인한 뒤 다시 기록해 주세요.";
  } finally {
    isSaving = false;
    practiceForm.setAttribute("aria-busy", "false");
    controls.forEach((control, index) => { if (control.isConnected) control.disabled = previousDisabled[index]; });
    saveButton.textContent = "답변 기록 완료하기";
    if (succeeded) document.querySelector("#recordDetailTitle").focus();
  }
});

document.querySelector("#editRecordButton").addEventListener("click", function () {
  const record = records.find(record => record.id === selectedRecordId);
  if (!record) return;
  editingRecordId = record.id;
  questionSelect.value = record.question;
  questionMessage.textContent = "선택한 질문: " + record.question;
  practiceQuestion.textContent = record.question;
  answerInput.value = record.answer;
  targetOption.checked = record.targeted;
  targetRole.value = record.targetRole || "";
  clearFieldError(answerInput, "answerError");
  clearFieldError(targetRole, "roleError");
  syncTargetFields();
  updateAnswer();
  showEditor();
});

// 새 답변은 입력만 비운다. 이미 저장한 연습 기록은 보관한다.
document.querySelector("#restartButton").addEventListener("click", function () {
  editingRecordId = null;
  practiceForm.reset();
  clearFieldError(answerInput, "answerError");
  clearFieldError(targetRole, "roleError");
  syncTargetFields();
  updateAnswer();
  questionMessage.textContent = "선택한 질문: " + questionSelect.value;
  practiceQuestion.textContent = questionSelect.value;
  confirmQuestion.textContent = "";
  confirmAnswer.textContent = "";
  document.querySelector("#confirmContext").textContent = "";
  submitStatus.classList.remove("is-error");
  answerEditor.hidden = false;
  answerConfirm.hidden = true;
  document.querySelector("#checkAnswerButton").disabled = false;
  showTab(0);
  questionSelect.focus();
});

function showReviewResult() {
  const tips = ["질문에서 묻는 내용에 맞춰 첫 문장을 써 보세요.", "직접 겪은 경험이나 그렇게 생각한 이유를 하나 넣어 보세요.", "반복되는 표현을 줄이고 핵심 내용부터 말해 보세요."];
  const count = [...reviewChecks].filter(check => check.checked).length;
  reviewTips.replaceChildren();
  reviewChecks.forEach(function (check, index) {
    if (!check.checked) {
      const tip = document.createElement("li");
      tip.textContent = tips[index];
      reviewTips.appendChild(tip);
    }
  });
  reviewScore.textContent = "3개 중 " + count + "개 항목을 지켰습니다.";
  reviewFeedback.textContent = count === 3 ? "모든 항목을 지켰네요. 작성한 답변을 소리 내어 연습해 보세요."
    : count === 0 ? "체크한 항목이 없습니다. 아래 내용을 참고해서 한 가지씩 보완해 보세요."
    : "잘 지킨 부분은 유지하고, 아래 내용을 보완해 보세요.";
  reviewResult.hidden = false;
}

function saveReview(reviewed) {
  const record = records.find(record => record.id === selectedRecordId);
  if (!record) return false;
  const updated = { ...record, reviewed, checks: [...reviewChecks].map(check => check.checked) };
  try {
    saveRecords(records.map(item => item.id === record.id ? updated : item));
    renderRecords();
    reviewMessage.classList.remove("is-error");
    return true;
  } catch {
    reviewChecks.forEach((check, index) => { check.checked = record.checks[index]; });
    reviewMessage.classList.add("is-error");
    reviewMessage.textContent = "점검 내용을 저장하지 못했습니다. 브라우저 저장 설정을 확인한 뒤 다시 시도해 주세요.";
    return false;
  }
}

document.querySelector("#reviewButton").addEventListener("click", function () {
  reviewBox.hidden = false;
  const record = records.find(record => record.id === selectedRecordId);
  if (record && record.reviewed) showReviewResult();
  document.querySelector("#reviewTitle").focus();
});
document.querySelector("#reviewResultButton").addEventListener("click", function () {
  if (!saveReview(true)) return;
  showReviewResult();
  reviewMessage.textContent = "점검 결과를 저장했습니다. 이 답변은 점검 완료로 표시됩니다.";
  document.querySelector("#reviewResultTitle").focus();
});
reviewChecks.forEach(function (check) {
  check.addEventListener("change", function () {
    if (!saveReview(false)) return;
    reviewResult.hidden = true;
    reviewMessage.textContent = "체크한 내용이 바뀌었습니다. 점검 결과 보기를 다시 눌러 주세요.";
  });
});
document.querySelector("#closeReviewButton").addEventListener("click", function () {
  reviewBox.hidden = true;
  document.querySelector("#reviewButton").focus();
});
document.querySelector("#restartReviewButton").addEventListener("click", function () {
  reviewChecks.forEach(check => { check.checked = false; });
  if (!saveReview(false)) return;
  reviewResult.hidden = true;
  reviewMessage.textContent = "체크와 결과를 지웠습니다. 기록한 답변을 다시 점검해 주세요.";
  reviewChecks[0].focus();
});
document.querySelector("#improveAnswerButton").addEventListener("click", function () {
  document.querySelector("#editRecordButton").click();
});

function isValidRecord(record) {
  return record && [...questionSelect.options].some(option => option.value === record.question)
    && typeof record.answer === "string" && record.answer.trim().length >= 20 && record.answer.length <= 500
    && typeof record.targeted === "boolean"
    && (!record.targeted || (typeof record.targetRole === "string" && record.targetRole.trim().length >= 2 && record.targetRole.length <= 40));
}

// 9주차에 저장한 최근 답변도 목록의 첫 기록으로 불러온다.
try {
  const stored = localStorage.getItem(storageKey);
  const data = stored === null ? JSON.parse(localStorage.getItem("interview-practice-latest-v1")) : JSON.parse(stored);
  const items = Array.isArray(data) ? data : data ? [data] : [];
  records = items.filter(isValidRecord).map(function (record) {
    return {
      ...record,
      id: typeof record.id === "string" ? record.id : crypto.randomUUID(),
      checks: Array.isArray(record.checks) && record.checks.length === 3 ? record.checks.map(Boolean) : [false, false, false],
      reviewed: record.reviewed === true
    };
  });
} catch {
  recordStatus.textContent = "저장 기록을 불러오지 못했습니다. 브라우저 저장 설정을 확인해 주세요.";
}
syncTargetFields();
renderRecords();
updateLocation();

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
