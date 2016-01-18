// Blue - X; Red - O

var TicTacToe = (function() {
    var ROWS = 3,
        COLUMNS = 3,
        OUTCOMES = {
            DRAW: 0,
            BLUE_WON: 1,
            RED_WON: -1
        };

    var TicTacToeBoard,
        currentPlayer,
        gameOutcome,
        isGameActive,
        currentRow,
        currentColumn,
        player1Score,
        player2Score,
        vsAI,
        player1,
        player2,
        AIPick;

    var init = function() {
        currentPlayer = 'Red';
        player1Score = 0;
        player2Score = 0;
        currentRow = -1;
        currentColumn = -1;

        vsAI = true;

        if(vsAI) {
            player1 = currentPlayer;
            AIPick = getReversePlayer(currentPlayer);
        } else {
            player1 = currentPlayer;
            player2 = getReversePlayer(currentPlayer);
        }


        isGameActive = 1;

        //ConnectFourBoard  = new Board(6, 7);
        //TicTacToeBoard.init();
    };

    var start = function() {

    };

    var resetScore = function() {
        player1Score = 0;
        player2Score = 0;

        document.getElementById("score_p1").value = player1Score;
        document.getElementById("score_p2").value = player2Score;
    };

    var changeActivePlayer = function() {
        if(currentPlayer == 'Red') {
            currentPlayer = 'Blue';
        } else {
            currentPlayer = 'Red';
        }

        document.getElementById("currentPlayerTurn").innerHTML = currentPlayer;
    };

    var getReversePlayer = function(player) {
        if(player == 'Red') {
            return 'Blue';
        } else {
            return 'Red';
        }
    };

    var checkWinnerState = function(board) {
        if(hasWon(board ? board : null)) {  // check if winning move
            gameOutcome = (currentPlayer == 'Red') ? OUTCOMES.RED_WON : OUTCOMES.BLUE_WON;
            isGameActive = false;

            return true;
        } else if(isDraw(board ? board : null)) {  // check for draw
            gameOutcome = OUTCOMES.DRAW;
            isGameActive = false;

            return true;
        }

        return false;
    };

    var isDraw = function(boardCopy) {
        var board = boardCopy ? boardCopy : TicTacToeBoard.board;

        for(var row = 0; row < ROWS; ++row) {
            for(var col = 0; col < COLUMNS; ++col) {
                if(board[row][col] == '') {
                    return false;  // an empty cell found, not draw, exit
                }
            }
        }
        return true;  // no empty cell, it's a draw
    };

    var hasWon = function(boardCopy) {
        var board = boardCopy ? boardCopy : TicTacToeBoard.board;

        return (board[currentRow][0] == currentPlayer         // 3-in-the-row
                && board[currentRow][1] == currentPlayer
                && board[currentRow][2] == currentPlayer
                || board[0][currentColumn] == currentPlayer      // 3-in-the-column
                && board[1][currentColumn] == currentPlayer
                && board[2][currentColumn] == currentPlayer
                || currentRow == currentColumn            // 3-in-the-diagonal
                && board[0][0] == currentPlayer
                && board[1][1] == currentPlayer
                && board[2][2] == currentPlayer
                || currentRow + currentColumn == 2  // 3-in-the-opposite-diagonal
                && board[0][2] == currentPlayer
                && board[1][1] == currentPlayer
                && board[2][0] == currentPlayer);
    };

    var AIPlay = function(AIType) {
        if(!isGameActive) {
            return;
        }

        var currentBoardState = TicTacToeBoard.cloneBoard(TicTacToeBoard.board),
            depth = parseInt(document.getElementById('cutoffVal').value),
            idealMove;

        Minimax.setCutOffValue(isNaN(depth) ? Number.POSITIVE_INFINITY : depth);

        if(AIType == 'minimax') {
            idealMove = Minimax.minimaxDecision(currentBoardState, currentPlayer);
        } else if(AIType == 'alpha-beta') {
            idealMove = Minimax.alphaBetaSearch(currentBoardState, currentPlayer);
        }

        var target = document.getElementById(idealMove.row + '_' + idealMove.col);

        currentRow = idealMove.row;
        currentColumn = idealMove.col;

        if (!TicTacToeBoard.insertPiece(target)) {
            return;
        }

        checkGameCompleted();

        changeActivePlayer();
    };

    var newGame = function() {
        resetScore();

        TicTacToeBoard.reset();
    };

    var checkGameCompleted = function() {
        if(checkWinnerState()) {
            if(gameOutcome != OUTCOMES.DRAW) {
                alert(currentPlayer + " has won!");
                return;
            } else {
                alert("DRAW :(");
                return;
            }
        }
    };

    Minimax = (function(){
        var currentPlayer,
            Max,
            Min,
            actionValuePairs = {},
            bestMove,
            cutOffValue;

        var init = function() {

        };

        var getActionValuePairs = function() {
            return actionValuePairs;
        };

        var getRandomInt = function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        var isWinningState = function(boardCopy, currentRow, currentColumn, currentPlayer) {
            var board = boardCopy ? boardCopy : TicTacToeBoard.board;

            return (board[currentRow][0] == currentPlayer         // 3-in-the-row
            && board[currentRow][1] == currentPlayer
            && board[currentRow][2] == currentPlayer
            || board[0][currentColumn] == currentPlayer      // 3-in-the-column
            && board[1][currentColumn] == currentPlayer
            && board[2][currentColumn] == currentPlayer
            || currentRow == currentColumn            // 3-in-the-diagonal
            && board[0][0] == currentPlayer
            && board[1][1] == currentPlayer
            && board[2][2] == currentPlayer
            || currentRow + currentColumn == 2  // 3-in-the-opposite-diagonal
            && board[0][2] == currentPlayer
            && board[1][1] == currentPlayer
            && board[2][0] == currentPlayer);
        };

        var isTerminalState = function(board, row, col, player) {
            if(isWinningState(board, row, col, player)) {
                var freeCells = 1;

                for(var r = 0; r < ROWS; r++) {
                    for(var c = 0; c < COLUMNS; c++) {
                        if(board[r][c] == '') {
                            freeCells++;
                        }
                    }
                }

                return freeCells * ((player == 'Red') ? OUTCOMES.RED_WON : OUTCOMES.BLUE_WON);
            } else if(isDraw(board)) {
                return OUTCOMES.DRAW;
            }

            return 'NO';
        };

        var getStateActions = function(board) {
            var actions = [];

            for(var r = 0; r < ROWS; r++) {
                for(var c = 0; c < COLUMNS; c++) {
                    if(board[r][c] == '') {
                        actions.push({
                            row: r,
                            col: c
                        });
                    }
                }
            }

            return actions.length > 0 ? actions : null;
        };

        var actionResult = function(board, action, player) {
            board[action.row][action.col] = player;

            return board;
        };

        var getUtilityValue = function(gameResult) {
            switch(gameResult) {
                case OUTCOMES.DRAW:
                    return OUTCOMES.DRAW;
                case OUTCOMES.BLUE_WON:
                    return OUTCOMES.BLUE_WON;
                case OUTCOMES.RED_WON:
                    return OUTCOMES.RED_WON;
            }
        };

        var getRandomMove = function(board) {
            var possibleStateActions = getStateActions(board);

            return possibleStateActions[getRandomInt(0, possibleStateActions.length - 1)];
        };

        var maxValue = function(board, lastAction, lastPlayer) {
            var state = isTerminalState(board, lastAction.row, lastAction.col, lastPlayer);

            if(state != 'NO') {
                //return getUtilityValue(state);
                //console.log("Max state: " + state);
                //console.log("-------------------");
                return state;
            }

            var score = Number.NEGATIVE_INFINITY,
                possibleStateActions = getStateActions(board),
                tempActionState;

            for(var i = 0; i < possibleStateActions.length; i++) {
                tempActionState = actionResult(TicTacToeBoard.cloneBoard(board), possibleStateActions[i], Max);
                score = Math.max(score, minValue(tempActionState, possibleStateActions[i], Max));
            }

            return score;
        };

        var minValue = function(board, lastAction, lastPlayer) {
            var state = isTerminalState(board, lastAction.row, lastAction.col, lastPlayer);

            if(state != 'NO') {
                //return getUtilityValue(state);
                //console.log("Min state: " + state);
                //console.log("-------------------");
                return state;
            }

            var score = Number.POSITIVE_INFINITY,
                possibleStateActions = getStateActions(board),
                tempActionState;

            for(var i = 0; i < possibleStateActions.length; i++) {
                tempActionState = actionResult(TicTacToeBoard.cloneBoard(board), possibleStateActions[i], Min);
                score = Math.min(score, maxValue(tempActionState, possibleStateActions[i], Min));
            }

            return score;
        };

        var minimaxDecision = function(board, player, depth) {
            currentPlayer = player;
            Max = player;
            Min = getReversePlayer(player);

            var possibleStateActions = getStateActions(board),
                actionUtilities = [];

            for(var i = 0; i < possibleStateActions.length; i++) {
                actionUtilities[i] = minValue(actionResult(TicTacToeBoard.cloneBoard(board), possibleStateActions[i], Max), possibleStateActions[i], Max);
            }

            var max = Number.NEGATIVE_INFINITY,
                maxKey;

            for(var utilValue in actionUtilities) {
                if(actionUtilities[utilValue] > max) {
                    max = actionUtilities[utilValue];
                    maxKey = utilValue
                }
            }

            return possibleStateActions[maxKey];
        };

        var maxAlphaBetaValue = function(board, alpha, beta, lastAction, lastPlayer, depth, isRootCall) {
            var state = isTerminalState(board, lastAction.row, lastAction.col, lastPlayer);
            depth++;

            if(state != 'NO') {
                //return getUtilityValue(state);
                //console.log("Max state: " + state + " - Alpha: " + alpha);

                return state;
            } else if(depth == cutOffValue) {
                var eval = Heuristics.evaluationFunctions.TicTacToe(TicTacToeBoard.cloneBoard(board));
                console.log("Min eval at depth: " + depth + "; state evaluation: " + eval);
                return getUtilityValue(state);
            }

            var score = Number.NEGATIVE_INFINITY,
                possibleStateActions = getStateActions(board);

            for(var i = 0; i < possibleStateActions.length; i++) {
                score = Math.max(score, minAlphaBetaValue(actionResult(TicTacToeBoard.cloneBoard(board), possibleStateActions[i], Max), alpha, beta, possibleStateActions[i], Max, depth));


                // Ako je ovo zadovoljeno onda to ne odgovara MINu i dalje vrijednosti score-a nece ni gledati
                // Posto je score uvijek Math.max, moze samo gore biti po beti
                if(score >= beta)
                    return score;

                //Prune branch if true
                //if(alpha >= beta)
                //    return alpha;

                if(score > alpha) {
                    if(isRootCall) {
                        bestMove = {
                            row: possibleStateActions[i].row,
                            col: possibleStateActions[i].col
                        };
                    }

                    alpha = score;
                }
            }

            return score;
            //return alpha;
        };

        var minAlphaBetaValue = function(board, alpha, beta, lastAction, lastPlayer, depth) {
            var state = isTerminalState(board, lastAction.row, lastAction.col, lastPlayer);
            depth++;

            if(state != 'NO') {
                //return getUtilityValue(state);
                //console.log("Min state: " + state + " - Beta: " + beta);
                //console.log("-------------------");

                return state;
            } else if(depth == cutOffValue) {
                var eval = Heuristics.evaluationFunctions.TicTacToe(TicTacToeBoard.cloneBoard(board));
                console.log("Min eval at depth: " + depth + "; state evaluation: " + eval);
                return eval;
            }

            var score = Number.POSITIVE_INFINITY,
                possibleStateActions = getStateActions(board);

            for(var i = 0; i < possibleStateActions.length; i++) {
                score = Math.min(score, maxAlphaBetaValue(actionResult(TicTacToeBoard.cloneBoard(board), possibleStateActions[i], Min), alpha, beta, possibleStateActions[i], Min, depth, false));

                // Ako je ovo zadovoljeno onda to ne odgovara MAXu i dalje vrijednosti score-a nece ni gledati
                // Posto je score minimum, moze samo gore biti po alfi
                if(score <= alpha)
                    return score;

                //beta = Math.min(beta, score);
                // Prune if true
                //if(alpha >= beta)
                //    return beta;

                beta = Math.min(beta, score);

                //if(score <= alpha)
                //    return alpha;
                //
                //beta = Math.min(beta, score);

            }

            return score;
            //return beta;
        };

        var alphaBetaSearch = function(board, player, depth) {
            var alphaNuclearOption = Number.NEGATIVE_INFINITY,
                betaNuclearOption = Number.POSITIVE_INFINITY,
                value;

            Max = player;
            Min = getReversePlayer(player);

            value = maxAlphaBetaValue(TicTacToeBoard.cloneBoard(board), alphaNuclearOption, betaNuclearOption, {row: currentRow, col: currentColumn}, Min, 0, true);

            console.log("End value: " + value);

            return bestMove;
        };

        var setCutOffValue = function(value) {
            cutOffValue = value;
        };

        return {
            init: init,
            minimaxDecision: minimaxDecision,
            getRandomMove: getRandomMove,
            alphaBetaSearch: alphaBetaSearch,
            getActionValuePairs: getActionValuePairs,
            setCutOffValue: setCutOffValue
        }
    })();

    var Heuristics = {
        // TODO Opisati u diplomskom ovu vrstu Matematike i Manhattan distance
        //Manhattan distance on a square grid - Taxi cab mathematics
        manhattanDistance: function(to, from) {
            var paramTo = to.split('x'),
                toX = parseInt(paramTo[0]),
                toY = parseInt(paramTo[1]),
                paramFrom = from.split('x'),
                fromX = parseInt(paramFrom[0]),
                fromY = parseInt(paramFrom[1]);

            return Math.abs(toX - fromX) + Math.abs(toY - fromY);
        },

        evaluationFunctions: {
            TicTacToe: function(state) {

                return 10;
            }
        }
    };

    TicTacToeBoard = (function(rows, columns) {
        self = this;

        this.board = null;
        this.boardMirror = null;

        var createTile = function(type) {
            var tile = document.createElement('img');

            if(type == 'blue') {
                tile.src = '/Connect-4/res/c4fillblu.gif';
            } else if(type == 'red') {
                tile.src = '/Connect-4/res/c4fillred.gif';
            } else {
                tile.src = '/Connect-4/res/c4fillempty.gif';
            }

            return tile;
        };

        var init = function() {
            var counter = 0;

            this.board = document.getElementById('tileContainer');
            var childTiles = this.board.getElementsByTagName('div');

            this.boardMirror = new Array(ROWS);
            for (var r = 0; r < ROWS; r++) {
                this.boardMirror[r] = new Array(COLUMNS);
            }

            for(var i = 0; i < ROWS; i++) {
                for(var j = 0; j < COLUMNS; j++) {
                    var tempTile = childTiles[counter];
                    tempTile.id = i + '_' + j;

                    this.boardMirror[i][j] = '';

                    tempTile.onclick = function(e) {
                        if(!isGameActive) {
                            return;
                        }

                        var target = e.target;

                        currentRow = target.id.split('_')[0];
                        currentColumn = target.id.split('_')[1];

                        if (!insertPiece(target)) {
                            return;
                        }

                        checkGameCompleted();

                        changeActivePlayer();

                        if(vsAI) {
                            var AITypes = document.getElementsByName("ai-type"),
                                AIType;

                            for(var i = 0; i < AITypes.length; i++) {
                                if(AITypes[i].checked == true) {
                                    AIType = AITypes[i].value;
                                }
                            }

                            AIPlay(AIType);
                        }
                    };

                    counter++;
                }
            }

            if(vsAI) {
                AIPlay();
            }
        };

        init();

        var insertPiece = function(tile) {
            if(tile.className.indexOf("player") == -1) {
                tile.className += ' player' + currentPlayer;
                self.boardMirror[currentRow][currentColumn] = currentPlayer;

                return true;
            }

            return false;
        };

        var cloneBoard = function(origBoard) {
            var clone = new Array(ROWS);

            for(var i = 0; i < ROWS; i++) {
                clone[i] = new Array(COLUMNS);

                for (var j = 0; j < COLUMNS; j++) {
                    clone[i][j] = origBoard[i][j];
                }
            }

            return clone;
        };

        this.reset = function() {
            this.frontLine = [];
            this.history = [];

            var blankTile;

            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < columns; j++) {
                    blankTile = document.getElementById(i + 'x' + j);
                    //blankTile.style.backgroundColor = '#808080';
                    blankTile.style.width = '50px';
                    blankTile.style.height = '50px';
                    blankTile.style.color = '#F3102E';
                    blankTile.style.fontSize = '24px';
                    blankTile.style.textAlign = 'center';
                    blankTile.style.border = '';
                    blankTile.innerHTML = '';
                    blankTile.className = '';

                    blankTile.appendChild(createTile());
                }
            }
        };

        var contains = function(a, obj) {
            var i = a.length;
            while (i--) {
                if (a[i] === obj) {
                    return true;
                }
            }
            return false;
        };

        return {
            board: this.boardMirror,
            cloneBoard: cloneBoard,
            insertPiece: insertPiece
        }
    })(ROWS, COLUMNS);

    return {
        init: init,
        start: start,
        resetScore: resetScore,
        newGame: newGame
    }
})();

TicTacToe.init();