const toggleBall = document.querySelector(".toggle-ball");
const btnsElement = document.querySelectorAll("button");
const inputElement = document.querySelector("#result");
const body = document.body;
const themes = ["theme1", "theme2", "theme3"];
let currentIndex = 0;

function updateTheme(index) {
  body.className = "";
  body.classList.add(themes[index]);
  toggleBall.style.left = `${index * 24 + 3}px`;
}

toggleBall.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % themes.length;
  updateTheme(currentIndex);
});

document.querySelectorAll(".theme-numbers span").forEach((span, index) => {
  span.addEventListener("click", () => {
    currentIndex = index;
    updateTheme(currentIndex);
  });
});

for (let i = 0; i < btnsElement.length; i++) {
  btnsElement[i].addEventListener("click", () => {
    const btnValue = btnsElement[i].textContent;
    triggerAnimation(btnsElement[i]);
    if (btnValue === "del") {
      backspace();
    } else if (btnValue === "reset") {
      clearResult();
    } else if (btnValue === "=") {
      calculateResult();
    } else {
      appendValue(btnValue);
    }
  });
}

function backspace() {
  inputElement.value = inputElement.value.slice(0, -1);
  const currentValue = inputElement.value.replace(/,/g, "");
  inputElement.value = formatWithCommas(currentValue.slice(0, -1));
  checkEmptyInput();
}

function clearResult() {
  inputElement.value = "0";
}

function appendValue(btnValue) {
  if (inputElement.value === "0") {
    inputElement.value = ""; // Remove the leading zero before appending
  }
  const currentValue = inputElement.value.replace(/,/g, "");
  if (isOperator(btnValue)) {
    if (isOperator(currentValue.slice(-1)) || currentValue === "") {
      return;
    }
  }
  const newValue = currentValue + btnValue;
  inputElement.value = formatWithCommas(newValue);
}

function formatWithCommas(number) {
  if (!number) return "";
  const [integer, decimal] = number.split(".");
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimal ? `${formattedInteger}.${decimal}` : formattedInteger;
}

function calculateResult() {
  try {
    if (!isOperator(inputElement.value.slice(-1))) {
      const result = eval(inputElement.value.replace(/,/g, ""));
      inputElement.value = formatWithCommas(result.toString());
    }
  } catch {
    inputElement.value = "Error";
  }
}

function isOperator(value) {
  return ["+", "-", "*", "/"].includes(value);
}

function triggerAnimation(button) {
  button.classList.add("click");
  setTimeout(() => {
    button.classList.remove("click");
  }, 500);
}

document.addEventListener("keydown", (event) => {
  const key = event.key;
  if (!isNaN(key) || key === ".") {
    appendValue(key);
    animateKey(key);
  } else if (isOperator(key)) {
    const currentValue = inputElement.value.replace(/,/g, "");
    if (!isOperator(currentValue.slice(-1))) {
      appendValue(key);
      animateKey(key);
    }
  } else if (key === "Enter") {
    calculateResult();
    animateKey("=");
  } else if (key === "Backspace") {
    backspace();
    animateKey("del");
  } else if (key === "Escape") {
    clearResult();
    animateKey("reset");
  }
});

function animateKey(key) {
  const button = Array.from(btnsElement).find(btn => btn.textContent.trim() === key);
  if (button) {
    triggerAnimation(button);
  }
}

function checkEmptyInput() {
  if (inputElement.value === "") {
    inputElement.value = "0";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  inputElement.value = "0";
});
