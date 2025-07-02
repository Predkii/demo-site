import { API } from "./main.js";

const baseCode = document.querySelector("#base-code");
const targetCode = document.querySelector("#target-code");
const baseAmount = document.querySelector("#base-amount");
const targetAmount = document.querySelector("#target-amount");
const amount = document.querySelector("#amount");
const swap = document.querySelector("#swap");
const lastUpdate = document.querySelector(".refresh-data");

const url = new URL(document.location);
let paramBase = url.searchParams.get("base");
let paramTarget = url.searchParams.get("target");

const defaultAmount = 1;
amount.value = defaultAmount.toFixed(2);

baseCode.textContent = paramBase;
targetCode.textContent = paramTarget;

// Fetch the conversion rate + calculated amount
const getConvertion = () => {
  API.get(`/pair/${paramBase}/${paramTarget}/${amount.value}`).then((data) => {
    console.log(data.conversion_rate);
    baseAmount.textContent = `${amount.value} ${data.base_code} =`;
    targetAmount.textContent = `${data.conversion_result} ${data.target_code}`;
  });
};

// Show when the exchange rate was last updated
const rtf = new Intl.RelativeTimeFormat("en-US", {
  numeric: "auto",
  style: "long",
});

let timer = 0;
let output = rtf.format(timer, "second");

// Render paragraph
const lastUpdateTime = () => {
  lastUpdate.innerHTML = `<p id="last-update">${paramBase} to ${paramTarget} conversion — Last updated: ${output} <button id="refresh" class="btn-refresh text--normal">Refresh</button></p>`;

  // New Fetch request
  const refresh = document.querySelector("#refresh");
  refresh.addEventListener("click", () => {
    getConvertion();
    resetTimer();
  });
  // lastUpdate.textContent = `${paramBase} to ${paramTarget} conversion — Last updated: ${output} <button></button>`;
};

// Timer function
const myTimer = () => {
  timer -= 1;
  output = rtf.format(timer, "minute");
  lastUpdateTime();
};

// Rerender paragraph every minute
setInterval(myTimer, 60000);
getConvertion();
lastUpdateTime();

// Reset timer and rerender paragraph
const resetTimer = () => {
  timer = 0;
  output = rtf.format(timer, "second");
  lastUpdateTime();
  clearInterval(myTimer);
};

// Custom Amount
amount.addEventListener("change", () => {
  getConvertion();
  resetTimer();
});

// Swap currencies
swap.addEventListener("click", () => {
  [paramBase, paramTarget] = [paramTarget, paramBase];
  baseCode.textContent = paramBase;
  targetCode.textContent = paramTarget;
  getConvertion();
  resetTimer();
});
