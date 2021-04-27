var exercises = ["Sprint in Place", "Jumping Jacks", "Sit Ups", "Squats", "Wall Sit", "Push Ups"];
var generatedExercises = [];
var numberOfExercises = 5;
var intervalTimer;
var currentExerciseCount = -1;

window.onload = function () {
    generateExercises();
};

/**
 *  Change the text of the button for the user
 * */
function timerBtnPressed() {
    var btn = document.getElementById("start-timer");

    if (btn.innerText === "Start") {
        startTimer();
        btn.innerText = "Stop";
    } else {
        resetTimer();
        btn.innerText = "Start";
    }
}

/**
 * Start the timer for the user and display the countdown, updating every second.
 * */
function startTimer() {
    var minDuration = 5;
    var duration = 60 * minDuration, display = document.getElementById('timer');

    // alert("Starting Timer!");

    var timer = duration, minutes, seconds;

    intervalTimer = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        if (seconds === "00" && currentExerciseCount <= numberOfExercises) {
            currentExerciseCount++;

            if (currentExerciseCount > numberOfExercises) {
                resetTimer();
            }

            highlightCurrentExercise(currentExerciseCount);

            var gifPath = getGifPath(generatedExercises[currentExerciseCount]);
            playNotificationSound("/sound/timer-sound.wav");
            playGif(generatedExercises[currentExerciseCount], gifPath);
        }

        display.innerHTML = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
        }

        if (minutes === "00" && seconds === "00") {
            clearInterval(intervalTimer);
        }
    }, 1000);
}

/**
 * Restart the timer and clear the countdown
 * */
function resetTimer() {
    clearInterval(intervalTimer);
    reset();
}

/**
 * Play a sound for the user to let them know a new workout is next
 * @param {any} url the url of the sound to play
 */
function playNotificationSound(url) {
    const audio = new Audio(url);
    audio.play();
}

/**
 * Allows user to repick 5 exercises if they do not like what was chosen.
 * */
function repickExercises() {
    // if the timer is running reset it
    resetTimer();

    // clear the current exercises
    generatedExercises.length = 0;

    // clear the html 
    document.getElementById("exercise-list").innerHTML = "";
    var btn = document.getElementById("start-timer");
    btn.innerText = "Start";

    generateExercises();
}

/**
 * Generate the exercises for the user to see what they will be doing.
 * */
function generateExercises() {

    for (i = 0; i < numberOfExercises; i++) {
        const selectedExercise = Math.floor(Math.random() * exercises.length);
        generatedExercises.push(exercises[selectedExercise]);
    }

    generatedExercises.forEach(displayExercise);
}

/**
 * Show all the exercises in a list to the user.
 * 
 * @param {any} item the exercises to be shown  
 * @param {any} index 
 */
function displayExercise(item, index) {
    if (index === 0) {
        document.getElementById("exercise-list").innerHTML += "<li class='list-group-item list-group-item-action active'>" + item + "</li>";
    } else {
        document.getElementById("exercise-list").innerHTML += "<li class='list-group-item list-group-item-action'>" + item + "</li>";
    }
}

/**
 * Play the correct gif according to the current exercise
 * 
 * @param {any} exercise
 * @param {any} path
 */
function playGif(exercise, path) {
    var player = document.getElementById("gif-player");
    var elem = document.createElement("img");

    if (player.firstChild) {
        player.firstChild.remove();
    }

    elem.setAttribute("src", path);
    elem.setAttribute("alt", exercise);
    elem.classList.add("img-workout");
    player.appendChild(elem);
}

/**
 * Reset the timer, gifs, and list
 * */
function reset() {
    // clear the player
    var player = document.getElementById("gif-player");
    if (player.firstChild) {
        player.firstChild.remove();
    }

    // reset the timer
    var display = document.getElementById('timer');
    display.innerHTML = "05:00";

    //reset the count
    currentExerciseCount = -1;
}

/**
 * Return the correct gif for the current exercise.
 * @param {any} currentExercise
 */
function getGifPath(currentExercise) {

    var path = "";

    switch (currentExercise) {
        case "Sprint in Place":
            path = "/images/quick-workout/Sprinting.gif";
            break;
        case "Jumping Jacks":
            path = "/images/quick-workout/JumpingJacks.gif";
            break;
        case "Sit Ups":
            path = "/images/quick-workout/SitUps.gif";
            break;
        case "Squats":
            path = "/images/quick-workout/Squats.gif";
            break;
        case "Wall Sit":
            path = "/images/quick-workout/WallSitgif.gif";
            break;
        case "Push Ups":
            path = "/images/quick-workout/PushUps.gif";
            break;
        default:
            path = "/images/quick-workout/JumpingJacks.gif";
            break;

    }

    return path;
}

/**
 * Highlight the current exercise for the user.
 * 
 * @param {any} count
 */
function highlightCurrentExercise(count) {
    var list = document.getElementById("exercise-list");

    if (count != 0) {
        list.children[(count - 1)].classList.remove("active");
    }

    if (count === 0 || count >= numberOfExercises) return;

    list.children[count].classList.add("active");
}