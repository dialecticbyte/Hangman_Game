let jsondata; //variable to hold JSON data
let word, userarray = [], correctarray = [];
let wrong_guesses = 0, gamew = 0;
let ct = 0;
let h = 0;
let canvas = document.getElementById('hangmanCanvas');
let ctx = canvas.getContext('2d'); 

async function fetchData() { //brings in the json data
    try{
        const response = await fetch('./hangman.json');
        jsondata = await response.json();
    } catch (error) {
        console.error('Error fetching JSON data:', error);
    }
}
function Guess_word() {
    if (!jsondata) {
        console.error('JSON data not loaded yet.');
        return;
    }
    let words = jsondata;    
    let randomindex = Math.floor(Math.random() * words.length);
    word = words[randomindex].toLowerCase();
    for(let i=0, len=word.length; i<len; i++){
        correctarray.push(word.charAt(i));
    }
    console.log(correctarray);
    console.log(correctarray.length);
    return word;
}
function userguess() {
    let user_input = document.getElementById("userinput").value;
    //console.log("User guessed: " + user_input);

    userarray.push(user_input.toLowerCase());
    console.log("User guesses so far: " + userarray);
    if(userarray[userarray.length-1] === correctarray[userarray.length-1]){
        console.log("Correct Guess! Proceed to next letter.");
    } 
    else if(userarray[userarray.length-1] !== correctarray[userarray.length-1]){ 
        if(wrong_guesses < 6){
            wrong_guesses += 1;
            console.log("Wrong Guess! Total wrong guesses: " + wrong_guesses);
            userarray.splice(userarray.length-1, 1);
            console.log("try again");
            document.getElementById("wro").innerText = wrong_guesses;
            drawHangman();
        }
    }
    if(user_input.length>0){
        document.getElementById("userinput").value = "";
        user_input = "";
    }
    update();
}
function resetGame() {
    userarray = [];
    correctarray = [];
    word = "";
    Guess_word();
    wrong_guesses = 0;
    h = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawHangman();
    document.getElementById("wrd").innerText = "";
    document.getElementById("msg1").innerText = "";
    document.getElementById("msg2").innerText = "";
}
function Changetheme() {
    let body = document.body;
    ct++;
    if(ct===1){
        body.style.background = "linear-gradient(to right, #b78b1cff, #a15901ff)";
        alert("Theme Changed to Dark Mode!");
    }
    if(ct===2){
        body.style.background = "linear-gradient(to right,  #FFE500, #FFA800)";
        alert("Themer changed to Light Mode(Defualt) ")
        ct -= 2;
    }
}
function Quit(){
    resetGame();
    gamew = 0;
    document.getElementById("sco").innerText = gamew;
    alert("Game Reset! Your score is now 0.");
}
function nextword() {
    resetGame();
    wrong_guesses = 0;
    document.getElementById("wro").innerText = wrong_guesses;
}
function Help(){ //provides hints
    h++;
    if(h===1){
        document.getElementById("msg1").innerText = "The number of letters are:" + correctarray.length + ". You have to guess the correct letters in order.";
    }
    else if(h===2){
        document.getElementById("msg2").innerText = "The first letter is: " + correctarray[0] + " and the last letter is: " + correctarray[correctarray.length - 1];
    }
    else if(h>2){
        alert("No more hints available!");
        h -= 1;
    }
}
function Rules(){
    let ruleblock = document.getElementById("rule_block");
    ruleblock.style.display = "block";
}
function btn_close(){
    document.getElementById("rule_block").style.display = "none";
}
function update(){ //updates the game status
    if(wrong_guesses > 5){
        console.log("Game Over! You've made " + wrong_guesses + " wrong guesses. The correct word was: " + word)
        alert("Game Over! You've made " + wrong_guesses + " wrong guesses. The correct word was: " + word);
        resetGame();
        document.getElementById("wrd").innerText = "The word was: " + word;
    }
    if(userarray.length === correctarray.length){
        console.log("Congratulations! You've guessed the word: " + word);
        alert("Congratulations! You've guessed the word: " + word);
        gamew += 1;
        document.getElementById("sco").innerText = gamew;
        document.getElementById("wrd").innerText = "Congratulations! You've guessed the word: " + word;
        resetGame();
    }
}
function drawHangman() { //draws the hangman based on wrong guesses
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;

    // Draw gallows (scaled for 300x300)
    ctx.beginPath();
    ctx.moveTo(37, 262);
    ctx.lineTo(112, 262);
    ctx.moveTo(75, 262);
    ctx.lineTo(75, 37);
    ctx.lineTo(187, 37);
    ctx.lineTo(187, 60);
    ctx.stroke();

    if (wrong_guesses >= 1) {
        // Head
        ctx.beginPath();
        ctx.arc(187, 82, 22, 0, Math.PI * 2);
        ctx.stroke();
    }
    if (wrong_guesses >= 2) {
        // Body
        ctx.beginPath();
        ctx.moveTo(187, 104);
        ctx.lineTo(187, 187);
        ctx.stroke();
    }
    if (wrong_guesses >= 3) {
        // Left arm
        ctx.beginPath();
        ctx.moveTo(187, 127);
        ctx.lineTo(164, 150);
        ctx.stroke();
    }
    if (wrong_guesses >= 4) {
        // Right arm
        ctx.beginPath();
        ctx.moveTo(187, 127);
        ctx.lineTo(210, 150);
        ctx.stroke();
    }
    if (wrong_guesses >= 5) {
        // Left leg
        ctx.beginPath();
        ctx.moveTo(187, 187);
        ctx.lineTo(164, 225);
        ctx.stroke();
    }
    if (wrong_guesses >= 6) {
        // Right leg
        ctx.beginPath();
        ctx.moveTo(187, 187);
        ctx.lineTo(210, 225);
        ctx.stroke();
        // Animate hanging
        animateHanging();
    } else if (wrong_guesses > 0) {
        // Animate rope loosening for each wrong guess
        animateRopeLoosening(wrong_guesses);
    }
}

function animateRopeLoosening(level) {
    let targetY = 60 + (level - 1) * 15; // Increase rope length for each wrong guess
    let y = 60;
    let speed = 1;
    let interval = setInterval(() => {
        ctx.clearRect(180, 0, 15, canvas.height);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(187, 37);
        ctx.lineTo(187, y);
        ctx.stroke();
        y += speed;
        if (y >= targetY) {
            clearInterval(interval);
        }
    }, 30);
}

function animateHanging() {
    let y = 60;
    let speed = 2;
    let interval = setInterval(() => {
        ctx.clearRect(180, 0, 15, canvas.height);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(187, 37);
        ctx.lineTo(187, y);
        ctx.stroke();
        y += speed;
        if (y > 104) {
            clearInterval(interval);
            // Draw the man at the bottom
            ctx.beginPath();
            ctx.arc(187, 128, 22, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(187, 150);
            ctx.lineTo(187, 225);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(187, 172);
            ctx.lineTo(164, 195);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(187, 172);
            ctx.lineTo(210, 195);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(187, 225);
            ctx.lineTo(164, 262);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(187, 225);
            ctx.lineTo(210, 262);
            ctx.stroke();
        }
    }, 50);
}
fetchData().then(() => { //ensure data is fetched before starting
    Guess_word();
    drawHangman();
})