import FetchWrapper from "./fetch-wrapper.js";

const currencies = document.querySelectorAll(".group");
const exchange = document.querySelector("#exchange");

const API = new FetchWrapper("https://v6.exchangerate-api.com/v6/YOUR-API-KEY");

const money = ["USD", "EUR", "CAD", "PKR", "INR", "GBP", "BRL", "IDR"];

// Render base and target currencies cards
API.get("/codes").then((data) => {
  data.supported_codes.forEach((code) => {
    currencies.forEach((currency) => {
      if (money.includes(code[0])) {
        currency.insertAdjacentHTML(
          "beforeend",
          `<button class="card" data-currency="${code[0]}"><span class="code">${code[0]}</span><span class="name">${code[1]}</span></button>`
        );
      }
    });
  });

  const base = document.querySelectorAll("#base-currency .card");
  const target = document.querySelectorAll("#target-currency .card");

  // Create and set "active" flags false
  let baseValue;
  let targetValue;
  let baseActive = false;
  let targetActive = false;

  // Disable "Track Exchange Rate" button at render
  exchange?.setAttribute("disabled", "disabled");

  // Enable "Track Exchange Rate" button when both "active" flags are true
  const enableLink = () => {
    const value = `results.html?base=${baseValue}&target=${targetValue}`;
    if (baseActive && targetActive) {
      exchange.removeAttribute("disabled");
      exchange.setAttribute("onClick", `location.href='${value}';`);
    }
  };

  // Assings CLASS "active" to clicked card and set FLAG "baseActive" true
  base.forEach((element) => {
    element.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector("#base-currency .card.active")?.classList.remove("active");
      e.currentTarget.classList.add("active");
      baseValue = e.currentTarget.dataset.currency;

      // Enable target card when the base card has been clicked
      target.forEach((element) => {
        element.removeAttribute("disabled");
      });

      // Prevents selecting the same currency
      document
        .querySelector(`#target-currency button[data-currency="${baseValue}"]`)
        .setAttribute("disabled", "disabled");

      baseActive = true;
      enableLink();
    });
  });

  // Same as above
  target.forEach((element) => {
    // Target cards are disabled until the base card is selected
    element.setAttribute("disabled", "disabled");
    element.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector("#target-currency .card.active")?.classList.remove("active");
      e.currentTarget.classList.add("active");
      targetValue = e.currentTarget.dataset.currency;

      // Enable base card when the target card has been clicked
      base.forEach((element) => {
        element.removeAttribute("disabled");
      });

      // Prevents selecting the same currency
      document
        .querySelector(`#base-currency button[data-currency="${targetValue}"]`)
        .setAttribute("disabled", "disabled");

      targetActive = true;
      enableLink();
    });
  });
});

export { API };

// const parent = document.querySelector("#parent);
// const child = document.createElement('p');
// child.textContent = 'Hello World';
// parent.appendChild(child);
