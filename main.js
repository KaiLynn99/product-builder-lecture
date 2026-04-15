const numberContainer = document.querySelector(".number-container");
const generateBtn = document.getElementById("generate-btn");
const themeToggle = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

setTheme(initialTheme);

generateBtn.addEventListener("click", () => {
    generateNumbers();
});

themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
});

function setTheme(theme) {
    const isDark = theme === "dark";

    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    themeToggle.setAttribute("aria-pressed", String(isDark));
}

function generateNumbers() {
    numberContainer.innerHTML = ""; // Clear previous numbers
    const numbers = [];
    while (numbers.length < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        if (!numbers.includes(randomNumber)) {
            numbers.push(randomNumber);
        }
    }

    numbers.sort((a, b) => a - b);

    for (const number of numbers) {
        const numberDiv = document.createElement("div");
        numberDiv.classList.add("number");
        numberDiv.textContent = number;
        numberContainer.appendChild(numberDiv);
    }
}

generateNumbers();
