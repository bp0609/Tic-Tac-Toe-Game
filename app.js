let boxes=document.querySelectorAll('.box');
let resetBtn= document.querySelector('#reset-btn');
let newGameBtn = document.querySelector('#new-btn');
let msgContainer = document.querySelector(".msg-container");
let msg= document.querySelector("#msg");
let turnO = true;   //Player X , player O
// let manualbtn=document.querySelector('#2vs2');
const winPatterns = [[0,1,2], [0,3,6], [0,4,8], [1,4,7], [2,5,8], [3,4,5], [6,7,8], [2,4,6]];


boxes.forEach((box) => {
    box.addEventListener('click', (e) => {
        if(turnO && !box.innerHTML){
            box.innerHTML = 'O';
            turnO = !turnO;
        } else if(!turnO && !box.innerHTML){
            box.innerHTML = 'X';
            box.style.color="green";
            turnO = !turnO;
        }
        checkWinner();
    });
});

const disableBoxes = ()=>{
    for(let box of boxes){
        box.disabled = true;            //IMP: We need to disable all the buttons after we get a winner
    }
}
const enableBoxes = ()=>{
    for(let box of boxes){
        box.disabled = false;            //IMP: We need to disable all the buttons after we get a winner
    }
}

const showWinner=(winner)=>{
    msg.innerHTML=`Congratulations the Winner is ${winner}`;
    console.log("Here");
    msgContainer.classList.remove("hide");
    disableBoxes();
}
const checkFull = () => {
    let count = 0;
    boxes.forEach((box) => {
        if(box.innerHTML !== ''){
            count++;
        }
    });
    if(count === 9){
        msg.innerHTML = "It's a draw!";
        msgContainer.classList.remove("hide");
        disableBoxes();
    }
}
const checkWinner = () => {
    let boxesArr = Array.from(boxes);
    winPatterns.forEach((pattern) => {
        if(boxesArr[pattern[0]].innerHTML && boxesArr[pattern[0]].innerHTML === boxesArr[pattern[1]].innerHTML && boxesArr[pattern[1]].innerHTML === boxesArr[pattern[2]].innerHTML){
            console.log("there");
            boxesArr[pattern[0]].style.backgroundColor="#e3bc51";
            boxesArr[pattern[1]].style.backgroundColor="#e3bc51";
            boxesArr[pattern[2]].style.backgroundColor="#e3bc51";
            showWinner(boxesArr[pattern[0]].innerHTML);
        }
       
    });
    checkFull();
}

let resetGame = () => {
    console.log("Reset Game");
    turnO=true;
    boxes.forEach((box)=>{
        box.innerHTML='';
        box.style.backgroundColor="#ffffc7";
        box.style.color="#b0413e";
    });
    msgContainer.classList.add("hide");
    enableBoxes();

};

resetBtn.addEventListener('click',resetGame);
newGameBtn.addEventListener('click',resetGame);

// -------------------------------------------------------------------------------------------------------
// Switch player
function otherPlayer(player) {
    return player === PLAYER_X ? PLAYER_O : PLAYER_X;
}

// Best move calculation
function bestMove(board, player) {
    let response, candidate;
    let noCandidate = true;

    for (let row = 0; row < 3; ++row) {
        for (let col = 0; col < 3; ++col) {
            if (board[row][col] === EMPTY) {
                board[row][col] = player;
                if (hasWon(board, player)) {
                    board[row][col] = EMPTY;
                    return { row: row, col: col, score: 1 };
                }
                board[row][col] = EMPTY;
            }
        }
    }

    for (let row = 0; row < 3; ++row) {
        for (let col = 0; col < 3; ++col) {
            if (board[row][col] === EMPTY) {
                board[row][col] = player;
                response = bestMove(board, otherPlayer(player));
                board[row][col] = EMPTY;
                if (response.score === -1) {
                    return { row: row, col: col, score: 1 };
                } else if (response.score === 0) {
                    candidate = { row: row, col: col, score: 0 };
                    noCandidate = false;
                } else {
                    if (noCandidate) {
                        candidate = { row: row, col: col, score: -1 };
                        noCandidate = false;
                    }
                }
            }
        }
    }
    return candidate;
}

// Main game loop
function main() {
    const board = initBoard();
    let current = PLAYER_X;

    while (true) {
        printBoard(board);
        if (current === PLAYER_X) {
            console.log("0 1 2\n3 4 5\n6 7 8");
            const move = parseInt(prompt("Enter your move: "));
            const row = Math.floor(move / 3);
            const col = move % 3;
            if (board[row][col] !== EMPTY) {
                console.log("Invalid move! Try again.");
                continue;
            }
            board[row][col] = current;
        } else {
            const response = bestMove(board, current);
            board[response.row][response.col] = current;
        }

        if (hasWon(board, current)) {
            printBoard(board);
            console.log(`Player ${current} has won!`);
            break;
        } else if (isFull(board)) {
            printBoard(board);
            console.log("Draw.");
            break;
        }
        current = otherPlayer(current);
    }
}
