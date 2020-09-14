var _ = require('lodash');

export default class Ai {

    // Return the empty edges of a given board
    static availableEdges(board) {
        return board.edges.filter(edge => {
            return edge.clicked == null;
        })
    }

    // Returns a random available edge
    static getRandomMove(board) {
        let availableEdges = this.availableEdges(board);
        let randomIndex = Math.floor(Math.random() * availableEdges.length);
        return availableEdges[randomIndex];
    }

    // Get a greedy move: if a move increases the score of the currentplayer it will be returned. 
    // Otherwise a random move is returned
    static getGreedyBestMove(board) {
        let availableEdges = this.availableEdges(board);
        let bestEdge = this.getRandomMove(board);
        let currentPlayerName = board.getCurrentPlayer().name;
        let previousScore = board.getCurrentPlayer().score;

        for (var testedge of availableEdges) {
            let copy = _.cloneDeep(board);
            copy.simulation = true;
            let edge = copy.getEdge(testedge.x, testedge.y, testedge.vertical)
            copy.selectEdge(edge);
            let player = copy.getPlayerByName(currentPlayerName);
            if (player.score > previousScore) {
                bestEdge = edge;
                break;
            }
        }
        return board.getEdge(bestEdge.x, bestEdge.y, bestEdge.vertical);
    }


    // This function uses Alpha/Beta pruning to find the best move
    static getBestMove(board) {
        let currentPlayer = board.getCurrentPlayer();
        let result = this.alphaBeta(board, currentPlayer, currentPlayer, 0, -Infinity, Infinity);
        let bestEdge = result.move;
        console.log(result.score);
        return board.getEdge(bestEdge.x, bestEdge.y, bestEdge.vertical);
    }

    // Apply alpha/beta pruning through a recursive function. 
    // if the currentplayer === the maximizingplayer, then 
    static alphaBeta(board, lastplayer, maximizingplayer, depth, alpha, beta) {
        let is_maximizing = lastplayer.name === maximizingplayer.name;
        let availableEdges = this.availableEdges(board);
       
        // the heuristic is as follows: 
        // the score of the maximizing player with respect to the total score.
        // therefore a good score is achieved when the maximizing player has a high score and the others have a low score
        if (board.gameIsFinished() || depth >= 4) {
            let maximizing_score = board.getPlayerByName(maximizingplayer.name).score;
            let other_score = (board.getTotalScore() - maximizing_score); // total score - my score
            return {
                score: maximizing_score - other_score,
                depth: depth,
            }
        }

        let currentPlayer = board.getCurrentPlayer();
        let currentScore = currentPlayer.score;
        let move = this.getRandomMove(board);

        // maximizing
        if (is_maximizing) {
            let value = -Infinity;
            for (let edge of availableEdges) {
                let copy = _.cloneDeep(board);
                copy.simulation = true;
                copy.selectEdge(copy.getEdge(edge.x, edge.y, edge.vertical));

                let new_depth = depth + 1;
                if (copy.getPlayerByName(currentPlayer.name).score > currentScore) {
                    new_depth = depth;
                }

                let result = this.alphaBeta(copy, currentPlayer, maximizingplayer, new_depth, alpha, beta);
                if (result.score > value) {
                    value = result.score;
                    move = edge;
                }
                alpha = Math.max(alpha, value)
                if (alpha >= beta) break;   
            }
            return {
                move: move,
                score: value,
            }

        // minimizing
        } else {
            let value = Infinity;
            for (let edge of availableEdges) {
                let copy = _.cloneDeep(board);
                copy.simulation = true;
                copy.selectEdge(copy.getEdge(edge.x, edge.y, edge.vertical));

                let new_depth = depth + 1;
                if (copy.getPlayerByName(currentPlayer.name).score > currentScore) {
                    new_depth = depth;
                }

                let result = this.alphaBeta(copy, currentPlayer, maximizingplayer, new_depth, alpha, beta);
                if (result.score < value) {
                    value = result.score;
                    move = edge;
                }
                beta = Math.min(beta, value)
                if (beta <= alpha) break;                  
            }
            return {
                move: move,
                score: value,
            }   
        }
    }

}