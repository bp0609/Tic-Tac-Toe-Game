let boxes=document.querySelectorAll('.box');
let resetBtn= document.querySelector('#reset-btn');
let newGameBtn = document.querySelector('#new-btn');
let msgContainer = document.querySelector(".msg-container");
let msg= document.querySelector("#msg");
let turnO = true;   //Player X , player O
// let manualbtn=document.querySelector('#2vs2');

const EMPTY = '.';
function initBoard() {
    return [
        [EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY]
    ];
}
let board= initBoard();
updateBoxes();




boxes.forEach((box,idx) => {
    box.addEventListener('click', (e) => {
        if(turnO && !box.innerHTML){
            box.innerHTML = 'O';
            // update the board
            let row = Math.floor(idx / 3);
            let col = idx % 3;
            board[row][col] = 'O';
            checkWinner('O');
            // AI move
            let response = bestMove(board, 'X');
            console.log("Response from AI: ")
            console.log(response);

            board[response.row][response.col] = 'X';
            updateBoxes();
            checkWinner('X');
        } 
    });
});

// Update the boxes from the board array
function updateBoxes(){
    let idx = 0;
    for(let row = 0; row < 3; row++){
        for(let col = 0; col < 3; col++){
            if(board[row][col] === 'O'){
                boxes[idx].innerHTML = 'O';
                boxes[idx].style.color="#b0413e";
            } else if(board[row][col] === 'X'){
                boxes[idx].innerHTML = 'X';
                boxes[idx].style.color="green";
            }
            else{
                boxes[idx].innerHTML = '';
            }
            boxes[idx].style.backgroundColor="#ffffc7";
            // boxes[idx].style.color="#b0413e";
            idx++;
        }
    }
}


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
    if(isFull(board)){
        msg.innerHTML = "It's a draw!";
        msgContainer.classList.remove("hide");
        disableBoxes();
    }
}
const checkWinner = (player) => {
    if(hasWon(board, player)){
        // Update the background of the winning boxes
        for (let row = 0; row < 3; ++row) {
            if (board[row][0] === player && board[row][1] === player && board[row][2] === player) {
                boxes[row*3].style.backgroundColor="#e3bc51";
                boxes[row*3+1].style.backgroundColor="#e3bc51";
                boxes[row*3+2].style.backgroundColor="#e3bc51";
            }
        }
    
        for (let col = 0; col < 3; ++col) {
            if (board[0][col] === player && board[1][col] === player && board[2][col] === player) {
                boxes[col].style.backgroundColor="#e3bc51";
                boxes[col+3].style.backgroundColor="#e3bc51";
                boxes[col+6].style.backgroundColor="#e3bc51";
            }
        }
    
        if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
            boxes[0].style.backgroundColor="#e3bc51";
            boxes[4].style.backgroundColor="#e3bc51";
            boxes[8].style.backgroundColor="#e3bc51";
        }
    
        if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
            boxes[2].style.backgroundColor="#e3bc51";
            boxes[4].style.backgroundColor="#e3bc51";
            boxes[6].style.backgroundColor="#e3bc51";
        }
        showWinner(player);
    }
    checkFull();
}

let resetGame = () => {
    console.log("Reset Game");
    turnO=true;
    board=initBoard();
    updateBoxes();
    msgContainer.classList.add("hide");
    enableBoxes();
};

resetBtn.addEventListener('click',resetGame);
newGameBtn.addEventListener('click',resetGame);

// -------------------------------------------------------------------------------------------------------
// Check if the board is full
function isFull(board) {
    for (let row = 0; row < 3; ++row) {
        for (let col = 0; col < 3; ++col) {
            if (board[row][col] === EMPTY) {
                return false;
            }
        }
    }
    return true;
}

// Check if a player has won
function hasWon(board, player) {
    for (let row = 0; row < 3; ++row) {
        if (board[row][0] === player && board[row][1] === player && board[row][2] === player) {
            return true;
        }
    }

    for (let col = 0; col < 3; ++col) {
        if (board[0][col] === player && board[1][col] === player && board[2][col] === player) {
            return true;
        }
    }

    if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
        return true;
    }

    if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
        return true;
    }

    return false;
}

const PLAYER_O = 'O';
const PLAYER_X = 'X';
// Switch player
function otherPlayer(player) {
    return player === PLAYER_X ? PLAYER_O : PLAYER_X;
}

// Print the board to the console
function printBoard(board) {
    board.forEach(row => console.log(row.join(' ')));
    console.log('\n');
}

// Best move calculation
function bestMove(board, player) {
    let response, candidate;
    let noCandidate = true;
    console.log("Here");
    // Board is full
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
    if(isFull(board)){
        if(hasWon(board, otherPlayer(player))){
            return { row: -1, col: -1, score: -1 };
        }
        else{
            return { row: -1, col: -1, score: 0 };
        }
    }
    for (let row = 0; row < 3; ++row) {
        for (let col = 0; col < 3; ++col) {
            if (board[row][col] === EMPTY) {
                board[row][col] = player;
                response = bestMove(board, otherPlayer(player));
                printBoard(board);
                board[row][col] = EMPTY;
                printBoard(board);
                console.log("Response from bestMove: ");
                console.log(response);
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
// function main() {
//     const board = initBoard();
//     let current = PLAYER_X;

//     while (true) {
//         printBoard(board);
//         if (current === PLAYER_X) {
//             console.log("0 1 2\n3 4 5\n6 7 8");
//             const move = parseInt(prompt("Enter your move: "));
//             const row = Math.floor(move / 3);
//             const col = move % 3;
//             if (board[row][col] !== EMPTY) {
//                 console.log("Invalid move! Try again.");
//                 continue;
//             }
//             board[row][col] = current;
//         } else {
//             const response = bestMove(board, current);
//             board[response.row][response.col] = current;
//         }

//         if (hasWon(board, current)) {
//             printBoard(board);
//             console.log(`Player ${current} has won!`);
//             break;
//         } else if (isFull(board)) {
//             printBoard(board);
//             console.log("Draw.");
//             break;
//         }
//         current = otherPlayer(current);
//     }
// }
