// Function to start the game
function playTheGame() {
    // Ask the user if they want to play
    const wantToPlay = confirm("Would you like to play the game?");
    
    if (!wantToPlay) {
        alert("No problem, Goodbye");
        return;
    }
    
    // Initialize variables for user input validation
    let userNumber;
    let isValid = false;
    
    // Keep asking until valid input is provided (bonus feature)
    while (!isValid) {
        // Ask for a number between 0-10
        userNumber = prompt("Enter a number between 0 and 10:");
        
        // Validate user input
        if (userNumber === null) {
            // User clicked Cancel
            alert("Game cancelled, Goodbye");
            return;
        } else if (isNaN(userNumber) || userNumber === "") {
            alert("Sorry Not a number, please try again");
        } else {
            userNumber = Number(userNumber);
            
            if (userNumber < 0 || userNumber > 10) {
                alert("Sorry it's not a good number, please try again");
            } else {
                isValid = true;
            }
        }
    }
    
    // Generate random number for computer (between 0 and 10)
    const computerNumber = Math.round(Math.random() * 10);
    
    // Compare numbers
    compareNumbers(userNumber, computerNumber);
}

// Function to compare user and computer numbers
function compareNumbers(userNumber, computerNumber, attempts = 1) {
    // Check if user guessed correctly
    if (userNumber === computerNumber) {
        alert("WINNER");
        return;
    }
    
    // Check if user has used all 3 attempts
    if (attempts >= 3) {
        alert("Out of chances");
        return;
    }
    
    // Give hint and ask for another guess
    let newGuess;
    if (userNumber > computerNumber) {
        newGuess = prompt("Your number is bigger than the computer's, guess again:");
    } else {
        newGuess = prompt("Your number is smaller than the computer's, guess again:");
    }
    
    // Handle if user cancels prompt
    if (newGuess === null) {
        alert("Game cancelled, Goodbye");
        return;
    }
    
    // Validate new guess
    if (isNaN(newGuess) || newGuess === "") {
        alert("Sorry Not a number, Goodbye");
        return;
    }
    
    newGuess = Number(newGuess);
    
    if (newGuess < 0 || newGuess > 10) {
        alert("Sorry it's not a good number, Goodbye");
        return;
    }
    
    // Recursive call with incremented attempts
    compareNumbers(newGuess, computerNumber, attempts + 1);
}