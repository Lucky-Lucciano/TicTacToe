var TicTacToe = (function() {
    var TicTacToeBoard,
        currentPlayer,
        player1Score,
        player2Score;

    var init = function() {
        currentPlayer = 'red';
        player1Score = 0;
        player2Score = 0;

        //ConnectFourBoard  = new Board(6, 7);
        TicTacToeBoard.init();
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
        if(currentPlayer == 'red') {
            currentPlayer = 'blue';
        } else {
            currentPlayer = 'red';
        }
    };

    var has4PiecesConnected = function() {
        return false;
    };

    var newGame = function() {
        resetScore();

        ConnectFourBoard.reset();
    };

    TicTacToeBoard = (function(rows, columns) {
        console.log("In it");

        // TODO: dodati click event na sve Tiles od id=tileContainer
        // i da dodaje classu i mijenja board

        // TODO: prilikom svakog klika provjeriti je l terminal state

        /* TODO: create getTerminalState metoda koja vraca:
                 1 - RED WINNER
                 2 - BLUE WINNER
                 3 - DRAW
                 0 - NIJE TERMINAL
        */


        self = this;

        this.board = null;

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
            this.board = document.createElement('table');
            this.board.id = 'board';
            this.board.style.margin = '80px auto';
            this.board.style.backgroundColor = '#FFFF99';
            this.board.style.borderSpacing = '0px';

            for(var i = 0; i < rows; i++) {
                var blankRow = document.createElement('tr');
                blankRow.id = 'row_' + i;

                for(var j = 0; j < columns; j++) {
                    var blankTile = document.createElement('td');
                    blankTile.id = i + 'x' + j;
                    //blankTile.style.backgroundColor = '#808080';
                    blankTile.style.width = '50px';
                    blankTile.style.height = '50px';
                    blankTile.style.color = '#F3102E';
                    blankTile.style.fontSize= '24px';
                    blankTile.style.textAlign = 'center';
                    blankTile.style.cursor = 'pointer';

                    blankTile.appendChild(createTile());
                    blankRow.appendChild(blankTile);
                }

                blankRow.onclick = function(e) {
                    var target = e.target;

                    if(e.target.id == "") {
                        target = e.target.parentNode;
                    }

                    var column = target.id.split('x')[1];

                    insertPiece(column);

                    var fourConnected = has4PiecesConnected();
                    if(fourConnected) {

                        alert(currentPlayer + "has won!")
                        return;
                    }

                    changeActivePlayer();
                };

                this.board.appendChild(blankRow);
            }

            document.body.appendChild(this.board);
        };

        init();



        var insertPiece = function(column) {
            for (var i = rows - 1; i >= 0; i--) {
                var tile = document.getElementById(i + 'x' + column);

                if(tile.className == '') {
                    var newTile = currentPlayer == 'red' ? createTile('red') : createTile('blue');
                    tile.childNodes[0].parentElement.removeChild(tile.childNodes[0]);
                    tile.appendChild(newTile);
                    tile.className = currentPlayer;

                    break;
                }
            }
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

        var NodeUtilities = {
            insertLengthValue: function(node, distance) {
                var lengthVal = document.createElement("span");
                lengthVal.className = "pathValue";
                lengthVal.innerHTML = distance;
                node.appendChild(lengthVal);
            },
            insertCameFrom: function(node, cameFrom) {
                var cameFromHTML = document.createElement("span");
                cameFromHTML.className = "cameFrom";
                cameFromHTML.innerHTML = cameFrom;
                node.appendChild(cameFromHTML);
            }
        };

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

        var getFrontLine = function(node) {
            var params = node.split('x'),
                i = parseInt(params[0]),
                j = parseInt(params[1]),
                fl = [],
                tempNode = '';

            var isWall = function(node) {
                return document.getElementById(node).className == 'wall';
            };

            if((i-1) >= 0) {
                tempNode = (i-1) + 'x' + j;
                if(!isWall(tempNode))
                    fl.push(tempNode);
                //highlightFrontNode(tempNode);
            }

            if((j-1) >= 0) {
                tempNode = i + 'x' + (j - 1);
                if(!isWall(tempNode))
                    fl.push(tempNode);
                //highlightFrontNode(tempNode);
            }

            if((i+1) < rows) {
                tempNode = (i+1) + 'x' + j;
                if(!isWall(tempNode))
                    fl.push(tempNode);
                //highlightFrontNode(tempNode);
            }

            if((j+1) < columns) {
                tempNode = i + 'x' + (j+1);
                if(!isWall(tempNode))
                    fl.push(tempNode);
                //highlightFrontNode(tempNode);
            }

            return fl;
        };

        var movementCost = function(a, b) {
            var tileType = document.getElementById(b).className;

            if(tileType == 'grass') {
                return 5;
            } else if(tileType == 'water') {
                return 10;
            } else {
                return 1;
            }
        };

        this.start = function(option) {
            this.startNode = start;
            this.goalNode = goal;
            this.currentNode = start;

            this.reset();

            this.depthOptions = {
                depthVal: 3,
                nodeBeingChecked : '',
                found : false,
                iteration : 0,
                distance : {},
                cameFrom : {},
                unlimited : false
            };

            this.depthOptions.distance[this.startNode] = 0;
            this.depthOptions.cameFrom[this.startNode] = "";

            switch(option){
                case 1:
                    this.Dijkstra(this.startNode);
                    break;
                case 2:
                    this.GreedyBestFirst(this.startNode);
                    break;
                case 3:
                    this.A_Star(this.startNode);
                    break;
            }
        };

    })(3, 3);

    return {
        init: init,
        start: start,
        resetScore: resetScore,
        newGame: newGame
    }
})();

TicTacToe.init();
//XOI.start();