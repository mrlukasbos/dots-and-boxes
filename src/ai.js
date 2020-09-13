var _ = require('lodash');

export default class Ai {
    static availableEdges(board) {
        return board.edges.filter(edge => {
            return edge.clicked == null;
        })
    }

    static getRandomMove(board) {
        let availableEdges = this.availableEdges(board);
        let randomIndex = Math.floor(Math.random() * availableEdges.length);
        return availableEdges[randomIndex];
    }

    // the higher our score the better
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


     // the higher our score the better
     static getBestMove(board) {
        let currentPlayer = board.getCurrentPlayer();
        let result = this.alphaBeta(board, currentPlayer, currentPlayer, 0, -Infinity, +Infinity);
        let bestEdge = result.move;
        return board.getEdge(bestEdge.x, bestEdge.y, bestEdge.vertical);
    }

    static alphaBeta(board, lastplayer, maximizingplayer, depth, alpha, beta) {
        let is_maximizing  = lastplayer.name === maximizingplayer.name;

        if (board.gameIsFinished()) {
            let score = 0;
          
         //   if (is_maximizing) {
                score =lastplayer.score; 
           // } else {
             //   score = -board.getPlayerByName(lastplayer.name).score;
           // }
            return {
                score:  score,
                depth: depth,
            }
        }                
        
        let availableEdges = this.availableEdges(board);
        let currentPlayer = board.getCurrentPlayer();
        let move = this.getRandomMove(board);

        // maximizing
        if (is_maximizing) {
            let value = -Infinity;
            let depth = 0;
            for (let i = 0; i < availableEdges.length; i++) {
                let edge = availableEdges[i];
                let copy = _.cloneDeep(board);
                copy.simulation = true;
                copy.selectEdge(copy.getEdge(edge.x, edge.y, edge.vertical));
                let result = this.alphaBeta(copy, currentPlayer, maximizingplayer, depth + 1, alpha, beta);
                if (result.score > value) {
                    value = result.score;
                    move = edge;
                    depth = result.depth;
                }
                alpha = Math.max(alpha, value)
                if (alpha >= beta) break;   
            }
            return {
                move: move,
                score: value,
                depth: depth,
            }

        // minimizing
        } else {
            let value = Infinity;
            let depth = 0;
            for (let i = 0; i < availableEdges.length; i++) {
                let edge = availableEdges[i];
                let copy = _.cloneDeep(board);
                copy.simulation = true;
                copy.selectEdge(copy.getEdge(edge.x, edge.y, edge.vertical));
                let result = this.alphaBeta(copy, currentPlayer, maximizingplayer, depth + 1, alpha, beta);
                if (result.score < value) {
                    value = result.score;
                    move = edge;
                    depth = result.depth;
                }
                beta = Math.min(beta, value)
                if (beta <= alpha) break;                  
            }
            return {
                move: move,
                score: value,
                depth: depth,
            }   
        }
    }

}