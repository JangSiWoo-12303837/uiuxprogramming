const serviceName = "Re:hear";
let isSubscribed = false;
let submitCount = 0;

function makeSubscribeMessage(email, subscribed) {
  if (subscribed == true) {
    return email + "로 신청이 완료 되었습니다.";
  }
  return "이메일을 입력한 뒤 신청해 주세요.";
}

const subscribeForm = document.querySelector("#subscribeForm");
const emailInput = document.querySelector("#email");
const subscribeButton = document.querySelector("#subscribeButton");
const subscribeMessage = document.querySelector("#subscribeMessage");

console.log(subscribeForm);
console.log(emailInput);
console.log(subscribeButton);
console.log(subscribeMessage);
