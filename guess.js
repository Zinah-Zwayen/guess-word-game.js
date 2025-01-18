// Setting Game Name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector("footer").innerHTML = `${gameName} Game Created by Zinah`;

// Setting Game Options
let numberOfTries = 6;
let numberOfLetters = 6;
let currentTry = 1;
let numberOfHints = 2;

// Manage Words
let wordToGuess = "";
const words = ["Spaces", "Update", "Delete", "Master", "Branch", "Mainly", "Entery", "Insert"];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
let messageArea = document.querySelector(".message");

// Manage Hints
document.querySelector(".hint span").innerHTML = numberOfHints;
const getHintButton = document.querySelector(".hint");
getHintButton.addEventListener("click", getHint);

function generateInput(){
    const inputsContainer = document.querySelector(".inputs");

    // Create Tries loop
    for(let i = 1; i <= numberOfTries; i++){
        const tryDiv = document.createElement("div");
        tryDiv.classList.add(`try${i}`);
        tryDiv.innerHTML = `<span>Try ${i}</span>`;

        if(i !== 1)tryDiv.classList.add("disabled-inputs");
        // Creat inputs loop
        for(let j = 1; j <= numberOfLetters; j++){
            const input = document.createElement("input");
            input.type = "text";
            input.id = `guess${i}-letter${j}`;
            input.setAttribute('maxlength','1');
            tryDiv.appendChild(input);
        }
        inputsContainer.appendChild(tryDiv);
    }
    // Focus on first input in first try element
    inputsContainer.children[0].children[1].focus();

    // Disable all inputs except first one
    const inputsInDiableDiv = document.querySelectorAll(".disabled-inputs input");
    inputsInDiableDiv.forEach((input) => (input.disabled = true));

    const inputs = document.querySelectorAll("input");
    inputs.forEach((input, index) => {
        // Convert input to uppercase
        input.addEventListener("input", function() {
            this.value = this.value.toUpperCase();

            //focus on next input if exsist
            const nextInput = inputs[index + 1];
            if(nextInput) nextInput.focus();
        });

        input.addEventListener("keydown", function(event) {
            const currentIndex = Array.from(inputs).indexOf(event.target);
            if(event.key === "ArrowRight") {
                const nextInput = currentIndex + 1;
                if (nextInput < inputs.length) inputs[nextInput].focus();
            }
            if (event.key === "ArrowLeft") {
                const prevInput = currentIndex - 1;
                if (prevInput >= 0) inputs[prevInput].focus();
            }
        });
    });
} 

// Creat handle guess for words
const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuesses);

console.log(wordToGuess);


function handleGuesses(){
    let successGuess = true;
   
    for(let i = 1; i <= numberOfLetters; i++){
        const inputField = document.querySelector(`#guess${currentTry}-letter${i}`);
        const letter = inputField.value.toLowerCase();
        const actualLetter = wordToGuess[i - 1];

        // Game logic
        if (letter === actualLetter){
            // Letter is correct and in correct place
            inputField.classList.add("yes-in-place");
        }else if (wordToGuess.includes(letter) && letter !== ""){
            // Letter is correct but not in correct place
            inputField.classList.add("not-in-place");
            successGuess = false;
        }else{
            // letter in wrong
            inputField.classList.add("no");
            successGuess = false;
        }
    }

    // Check if user win or lose
    if (successGuess){
        messageArea.innerHTML = `You win the word is <span>${wordToGuess}</span>`;
        if(numberOfHints === 2){
            messageArea.innerHTML = `<p> Congratulations you win without using hints<p>`;

        }

        // Add disabled class on all try divs
        let allTries = document.querySelectorAll(".inputs > div");
        allTries.forEach((tryDiv)=> tryDiv.classList.add("disabled-inputs"));

        // Disabled the check word button
        guessButton.disabled = true;
        getHintButton.disabled = true;
    }else{
        document.querySelector(`.try${currentTry}`).classList.add("disabled-inputs");
        const currentTryInputs = document.querySelectorAll(`.try${currentTry} input`);
        currentTryInputs.forEach((input) => (input.disabled = true));

        currentTry++;

        
        const nextTryInput = document.querySelectorAll(`.try${currentTry} input`);
        nextTryInput.forEach((input) => (input.disabled = false));

        let el = document.querySelector(`.try${currentTry}`);
        if (el){
            document.querySelector(`.try${currentTry}`).classList.remove("disabled-inputs");
            el.children[1].focus();
        }else{
            // Disable Guess Button
            guessButton.disabled = true;
            getHintButton.disabled = true;
            messageArea.innerHTML = `You lose the word is <span>${wordToGuess}</span>`;
        }
    }
}

function getHint(){
    if(numberOfHints > 0){
        numberOfHints--;
        document.querySelector(".hint span").innerHTML = numberOfHints;
    }
    if(numberOfHints === 0){
        getHintButton.disabled = true;
    }

    const enabledInputs = document.querySelectorAll("input:not([disabled])");

    const emptyEnabledInputs = Array.from(enabledInputs).filter((input) => input.value === "");

    if(emptyEnabledInputs.length > 0){
        const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
        const randomInput = emptyEnabledInputs[randomIndex];
        const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
        if(indexToFill !== 0){
            randomInput.value = wordToGuess[indexToFill].toUpperCase();
        }
    }
}
// add function to enable delete letters using backspace
function handleBackspace(event){
    if(event.key === "Backspace"){
        const inputs = document.querySelectorAll("input:not([disabled])");
        const currentIndex = Array.from(inputs).indexOf(document.activeElement);
        if(currentIndex > 0 ){
            const currentInput = inputs[currentIndex];
            const prevInput = inputs[currentIndex - 1];
            currentInput.value = "";
            prevInput.value = "";
            prevInput.focus();
        }
    }
}

document.addEventListener("keydown", handleBackspace);

window.onload = function (){
    generateInput();
};