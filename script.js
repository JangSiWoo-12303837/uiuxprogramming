// 버튼을 누르면 해당 탭의 내용만 보여준다.
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");

for (let i = 0; i < tabButtons.length; i++) {
  tabButtons[i].addEventListener("click", function () {
    for (let j = 0; j < tabButtons.length; j++) {
      tabButtons[j].classList.remove("is-active");
      tabButtons[j].setAttribute("aria-pressed", "false");
      tabPanels[j].hidden = true;
    }

    tabButtons[i].classList.add("is-active");
    tabButtons[i].setAttribute("aria-pressed", "true");
    const panelId = tabButtons[i].dataset.panel;
    document.getElementById(panelId).hidden = false;
  });
}

const questionSelect = document.querySelector("#questionSelect");
const questionMessage = document.querySelector("#questionMessage");
const practiceQuestion = document.querySelector("#practiceQuestion");
const answerInput = document.querySelector("#answerInput");
const answerMessage = document.querySelector("#answerMessage");
const saveButton = document.querySelector("#saveButton");
const recordQuestion = document.querySelector("#recordQuestion");
const recordAnswer = document.querySelector("#recordAnswer");

// 질문이 바뀌면 새 답변을 쓸 수 있도록 입력창을 비운다.
questionSelect.addEventListener("change", function () {
  questionMessage.textContent = "선택한 질문: " + questionSelect.value;
  practiceQuestion.textContent = questionSelect.value;
  answerInput.value = "";
  updateAnswer();
});

function updateAnswer() {
  const answerLength = answerInput.value.length;
  answerMessage.classList.remove("is-success");
  saveButton.textContent = "답변 기록하기";

  if (answerInput.value.trim() === "") {
    answerMessage.textContent = answerLength + " / 500자 · 답변을 입력해 주세요.";
    saveButton.disabled = true;
  } else {
    answerMessage.textContent = answerLength + " / 500자 · 기록할 수 있습니다.";
    saveButton.disabled = false;
  }
}

answerInput.addEventListener("input", updateAnswer);

saveButton.addEventListener("click", function () {
  recordQuestion.textContent = questionSelect.value;
  recordAnswer.textContent = answerInput.value.trim();
  answerMessage.textContent = "답변을 기록했습니다. 연습 기록 탭에서 확인해 보세요.";
  answerMessage.classList.add("is-success");
  saveButton.textContent = "기록 완료";
  saveButton.disabled = true;
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
