const PlayBoard = document.querySelector(".play-board")
let scoreElement = document.querySelector(".score")
let highScoreElement = document.querySelector(".high-score")
const controls = document.querySelectorAll(".controls i")

let gameOver = false
let gameOverAudioPlayed = false
let foodX, foodY
let snakeX = 5, snakeY = 10
let snakeBody = []
let velocityX = 0, velocityY = 0
let setIntervalId
let score = 0

// Getting high score from the local storage
let highScore = localStorage.getItem("high-score") || 0
highScoreElement.textContent = `High Score: ${highScore}`

const changeFoodPosition = () => {
    // Giving a random 0 - 30 value as a food position
    foodX = Math.floor(Math.random() * 30) + 1
    foodY = Math.floor(Math.random() * 30) + 1
}

const changeDirection = (e) => {
    // Changing velocity value based on key press
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0
        velocityY = -1
    } else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0
        velocityY = 1
    } else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1
        velocityY = 0
    } else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1
        velocityY = 0
    }
}

const handleGameOver = () => {
    // Clearing the timer and reloading the page on game over
    clearInterval(setIntervalId)
    location.reload()
}

controls.forEach(key => {
    // Calling changeDirection on each key click and passing key dataset value as an object
    key.addEventListener("click", () => changeDirection({ key: key.dataset.key }))
})

const initGame = () => {
    if(gameOver) {
    let screen = document.getElementById('gameOver-screen')
    screen.style.display = "flex"

    let gameAudio = document.getElementById('audioGame')
    gameAudio.pause()
    let gameOverAudio = document.getElementById('gameOverAudio')

    if(!gameOverAudioPlayed) {
        gameOverAudio.play()
        gameOverAudioPlayed = true
    }

    let message = document.getElementById("message")
    message.innerText = `You're score was: ${score}`

    window.addEventListener('keypress', function(event) {
        console.log('event wait')
        console.log(event)
        if(event.key === 'Enter') {
            console.log('Restart Buttton pressed by enter key')
            handleGameOver()
        }
    })

    }
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`

    // Checking if the snake hit the food
    if(snakeX === foodX && snakeY === foodY) {
        let pointAudio = document.getElementById('pointsAudio')
        pointAudio.play()

        changeFoodPosition()
        snakeBody.push([foodX, foodY]) // Pushing food position to snake body array
        score++ // Increment score by 1

        highScore = score >= highScore ? score : highScore
        localStorage.setItem("high-score", highScore)
        scoreElement.textContent = `Score ${score}`
        highScoreElement.textContent = `High Score ${highScore}`
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        // Shifting forward the value of the element in the snake body by one
        snakeBody[i] = snakeBody[i - 1]
    }

    snakeBody[0] = [snakeX, snakeY] //Setting first element of snake body to current snake position
    
    // Updating the snake's head position based on the current velocity
    snakeX += velocityX
    snakeY += velocityY

    // shecking if the snake's head is out of wall, if so setting gameOver to true
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true
    }

    for (let i = 0; i < snakeBody.length; i++) {
        // Adding a div for each part of the snake's body
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`    
    }
    PlayBoard.innerHTML = htmlMarkup
}

// News functions for moviles device
let touchStartX
let touchStartY

PlayBoard.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
})
PlayBoard.addEventListener('touchend', (e) => {
    if (!touchStartX || !touchStartY) {
        return;
}
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // Determine the swipe direction (adjust the thresholds as needed)
    const minSwipeDistance = 25; // Minimum distance to consider a swipe

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal Swipe 
        if (diffX > minSwipeDistance && velocityX !== -1) {
            changeDirection({ key: 'ArrowRight' });
        } else if (diffX < -minSwipeDistance && velocityX !== 1) {
            changeDirection({ key: 'ArrowLeft' });
        }
    } else {
        // Vertical Swipe 
        if (diffY > minSwipeDistance && velocityY !== -1) {
            changeDirection({ key: 'ArrowDown' });
        } else if (diffY < -minSwipeDistance && velocityY !== 1) {
            changeDirection({ key: 'ArrowUp' });
        }
    }

    // Reset the initial touch positions
    touchStartX = null;
    touchStartY = null;
    
})

changeFoodPosition()
setIntervalId = setInterval(initGame, 125)
document.addEventListener("keydown", changeDirection)