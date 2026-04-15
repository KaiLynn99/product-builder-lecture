const STORAGE_KEY = "theme";

document.addEventListener("DOMContentLoaded", () => {
    const numberContainer = document.querySelector(".number-container");
    const generateBtn = document.getElementById("generate-btn");
    const themeToggle = document.getElementById("theme-toggle");

    if (!numberContainer || !generateBtn || !themeToggle) {
        return;
    }

    const initialTheme = getSavedTheme() || getSystemTheme();
    setTheme(themeToggle, initialTheme);
    generateNumbers(numberContainer);

    generateBtn.addEventListener("click", () => {
        generateNumbers(numberContainer);
    });

    themeToggle.addEventListener("click", () => {
        const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        setTheme(themeToggle, nextTheme);
        saveTheme(nextTheme);
    });
});

function getSystemTheme() {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
    }

    return "light";
}

function getSavedTheme() {
    try {
        const theme = localStorage.getItem(STORAGE_KEY);
        return theme === "dark" || theme === "light" ? theme : null;
    } catch (error) {
        return null;
    }
}

function saveTheme(theme) {
    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
        // Some browsers block storage in restricted contexts. The toggle still works for this page view.
    }
}

function setTheme(themeToggle, theme) {
    const isDark = theme === "dark";

    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    themeToggle.setAttribute("aria-pressed", String(isDark));
}

function generateNumbers(numberContainer) {
    const numbers = [];

    while (numbers.length < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;

        if (!numbers.includes(randomNumber)) {
            numbers.push(randomNumber);
        }
    }

    numbers.sort((a, b) => a - b);
    numberContainer.replaceChildren(...numbers.map(createNumberElement));
}

function createNumberElement(number) {
    const numberDiv = document.createElement("div");
    numberDiv.classList.add("number");
    numberDiv.textContent = number;

    return numberDiv;
}
