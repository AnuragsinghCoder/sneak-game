let keypress = "right";
let recent_key=[];
let pointer = [1];
let pointer_position = null;
let score = 2;
let high_score = 0;
let reward_point=null;

let game_running = false;
let game_poused = false;
let game_overed = false;
let user_want_to;
let interval;
let invalid_move=false;


// Opposite Direction Helper Function
function oposite(key){
    const opposites={
        up: "down",
        down: "up",
        left: "right",
        right: "left"
     };  
    return opposites[key]||key;
}




// Game State Reset Functions
function reset_game_running(){
    return game_running = false;
}
function reset_game_poused(){
    return game_poused = false;
}
function reset_game_overed(){
    return game_overed = false;
}
function reset() {
    reset_game_running();
    reset_game_poused();
    reset_game_overed();

    pointer = [1];
    score = 2;
    reward_point = null;
    recent_key = [];
    keypress = "right";
    invalid_move = false;

    // Clear grid colors
    const cells = document.querySelectorAll(".col");
    cells.forEach((cell) => {
        cell.style.backgroundColor = "rgb(241, 181, 181)"; // Default color
    });

    // Reset displayed scores
    document.querySelector(".li_score").innerHTML = score;
    document.querySelector(".hi_score").innerHTML = high_score;
    document.querySelector(".game_over").style.display="none";
}




// Event Listener for Keypress
// // creating a event which return only key press in keypress variable
let eventListenerAttached = false;

function check_event(callback) {
    if (!eventListenerAttached) {
        document.addEventListener("keydown", function (event) {
            const key = event.key.toLowerCase(); // Normalize key to lowercase
            let direction = null; // Declare a local variable

            if (key === "w" || key === "arrowup") {
                direction = "up";
            } else if (key === "s" || key === "arrowdown") {
                direction = "down";
            } else if (key === "a" || key === "arrowleft") {
                direction = "left";
            } else if (key === "d" || key === "arrowright") {
                direction = "right";
            }

            if (direction && typeof callback === "function") {
                callback(direction); // Call the provided callback with the direction
            }
        });

        eventListenerAttached = true;
    }
}


// Key Press Handler
//supporting function for check_event
function key_pressed(direction) {
    let current_key=direction;
    recent_key.push(direction);

    if(recent_key[recent_key.length-2]!==oposite(direction)){
        keypress=direction;
        if(recent_key.length>5){
            recent_key.shift();
        }
    }else{
        recent_key.pop();
    }

    // keypress=direction;
    console.log(`Keypress detected: ${direction}`);
    // game_play(keypress);
    return keypress;
}


// Pointer Functions
// a function to get pointer position
function  check_pointer_position(){
    pointer_position = pointer[pointer.length-1];
    return pointer_position;
}

// a function to update pointer
function update_pointer(keypress){
    check_pointer_position();
    let new_position = pointer_position;   
    
    switch (keypress) {
        case "up":
            if(new_position>10){
                new_position -= 10;
            }
            break;
        case "down":
            if(new_position<91){
                new_position += 10;
            }
            break;
        case "left":
            if((new_position%10)!=1){
                new_position -=1 ;
            }
            break;
        case "right":
            if((new_position%10)!=0){
                new_position +=1 ;
            }
            break; 
        default:
            console.log("Invalid move");
            return;
    }
    // if(!(pointer.includes(new_position))&&(pointer.length>score+2)){
    //     pointer.push(new_position); 
    //     pointer.shift();  
    // }else {
    //     console.log("Invalid move");
    //     invalid_move = true;
    // }
    if (new_position > 0 && new_position <= 100 && !pointer.includes(new_position)) {
        pointer.push(new_position);
        if (pointer.length > score + 2) {
            pointer.shift();
        }
        console.log(`Pointer updated: ${pointer}`);
    } else {
        console.log("Invalid move");
        invalid_move = true;
    }
    return pointer;
}


// Grid Color Update Functions
// functions for update colors 
// function for update main color
function update_cell_color(position, color){
    const cell = document.querySelector(`.col${position}`);
    if (cell) {
        cell.style.backgroundColor = color;
    } else {
        console.error(`Cell .col${position} not found`);
    }
}

function pointer_main_color(color) {
    check_pointer_position();
    update_cell_color(pointer_position, color);
}

// // function for update hower color
function pointer_hower_color(color){
    check_pointer_position();
    update_cell_color(pointer_position, color);
    //first try to hower
    update_cell_color(pointer[0],"rgb(241, 181, 181)");
}



// Reward Point Functions
function new_reward_point(){
    reward_point=null;
    let random_point = Math.floor(Math.random() * 100) + 1;

    while(pointer.includes(random_point)){
        random_point = Math.floor(Math.random() * 100) + 1;
    }

    reward_point  =random_point;
    update_cell_color(reward_point, "white");
    return reward_point;
}

//function for reward position
function check_reward_point(){
    if(!reward_point){
        new_reward_point();
    }
    return reward_point;
}

// Score Update Functions
//function for updating current score 
function update_current_score(){
    score = score+1;
    document.querySelector(".li_score").innerHTML=score;
    return score;
}

//function for updating high score 
function update_high_score(){
    if(score>=high_score){
        high_score = score;
        document.querySelector(".hi_score").innerHTML=score;
        return score;
    }
}

// function for updating score
function update_score() {
    check_pointer_position();
    check_reward_point();

    if (pointer_position === reward_point) {
        update_current_score();
        update_high_score();
        new_reward_point();
    }
}



// function for game over
function game_over() {
    if (invalid_move) {
        clearInterval(interval);
        game_overed = true;

        // Display Game Over message
        const gameOverElement = document.querySelector(".game_over");
        if (gameOverElement) {
            gameOverElement.style.display = "flex";
        }

        console.log("Game Over!");
    }
    return game_overed;
}



// Game Manager Functions
// onclick ()==>

function start(){
    user_want_to = "start";
    game_manager();
    return user_want_to;
}
function stop(){
    user_want_to = "stop";
    game_manager();
    return user_want_to;
}

   
function restart() {
    console.log("Restarting the game...");

    // Clear any existing intervals to prevent speed-up
    clearInterval(interval);


    reset();
    // Reset game states
    // Generate a new reward point
    new_reward_point();

    // Restart the game loop
    play("start");
}


//game manager
function game_manager(){
    if(user_want_to=="start" && !game_running && !game_overed){    
        play("start");    
    }
    if(user_want_to=="stop"&&game_running){
        play("stop");
    }
    // if(user_want_to=="restart"){
    //     reset();
    //     play("start");
    // }
}



function play(current_event) {
    check_event(key_pressed);  
    if (current_event === "start" && !game_running && !game_overed) {
        console.log("Starting game...");
        interval = setInterval(() => {
            game_play(keypress);
        }, 500);
        game_running = true;
    } else if (current_event === "stop" || game_overed) {
        console.log("Stopping game...");
        clearInterval(interval);
        game_running = false;
    }
}



function game_play(keypress){
    update_pointer(keypress);
    pointer_hower_color("red");
    check_reward_point()
    update_score();
    game_over();
}

