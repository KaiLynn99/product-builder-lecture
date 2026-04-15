const STORAGE_KEY = "theme";

document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");
    const numberContainer = document.querySelector(".number-container");
    const generateBtn = document.getElementById("generate-btn");

    if (themeToggle) {
        const initialTheme = getSavedTheme() || getSystemTheme();
        setTheme(themeToggle, initialTheme);

        themeToggle.addEventListener("click", () => {
            const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
            setTheme(themeToggle, nextTheme);
            saveTheme(nextTheme);
        });
    }

    if (numberContainer && generateBtn) {
        generateNumbers(numberContainer);

        generateBtn.addEventListener("click", () => {
            generateNumbers(numberContainer);
        });
    }

    document.querySelectorAll(".comments-panel").forEach(setupComments);
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


function setupComments(panel) {
    const form = panel.querySelector(".comment-form");
    const list = panel.querySelector(".comment-list");
    const storageKey = panel.dataset.commentsKey;

    if (!form || !list || !storageKey) {
        return;
    }

    renderComments(list, getComments(storageKey));

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const name = String(formData.get("name") || "").trim();
        const message = String(formData.get("message") || "").trim();

        if (!name || !message) {
            return;
        }

        const comments = getComments(storageKey);
        comments.unshift({
            id: Date.now(),
            name,
            message,
            createdAt: new Date().toISOString(),
        });

        saveComments(storageKey, comments);
        renderComments(list, comments);
        form.reset();
    });
}

function getComments(storageKey) {
    try {
        const comments = JSON.parse(localStorage.getItem(storageKey) || "[]");
        return Array.isArray(comments) ? comments : [];
    } catch (error) {
        return [];
    }
}

function saveComments(storageKey, comments) {
    try {
        localStorage.setItem(storageKey, JSON.stringify(comments.slice(0, 50)));
    } catch (error) {
        // Comments are optional; the page should keep working even if storage is unavailable.
    }
}

function renderComments(list, comments) {
    list.replaceChildren();

    if (comments.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.classList.add("empty-comments");
        emptyMessage.textContent = "아직 댓글이 없습니다.";
        list.append(emptyMessage);
        return;
    }

    comments.forEach((comment) => {
        const article = document.createElement("article");
        article.classList.add("comment-item");

        const header = document.createElement("div");
        header.classList.add("comment-meta");

        const name = document.createElement("strong");
        name.textContent = comment.name;

        const time = document.createElement("time");
        time.dateTime = comment.createdAt;
        time.textContent = formatCommentDate(comment.createdAt);

        const message = document.createElement("p");
        message.textContent = comment.message;

        header.append(name, time);
        article.append(header, message);
        list.append(article);
    });
}

function formatCommentDate(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "방금 전";
    }

    return date.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}
