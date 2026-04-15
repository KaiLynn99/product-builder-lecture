
const numberContainer = document.querySelector(".number-container");
const generateBtn = document.getElementById("generate-btn");

generateBtn.addEventListener("click", () => {
    generateNumbers();
});

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
