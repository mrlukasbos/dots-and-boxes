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
    static getBestMove(board) {
        let availableEdges = this.availableEdges(board);
        let bestEdge = availableEdges[0];
        let bestScore = -Infinity;

        let currentPlayer = board.getCurrentPlayer();

        for (var testedge of availableEdges) {
            let copy = board.copy();
            let edge = copy.getEdge(testedge.x, testedge.y, testedge.vertical);
            copy.selectEdge(edge);
            
            let score = this.minMax(copy, currentPlayer.name, 0);
            console.log(score);
            if (score > bestScore) {
                bestScore = score;
                bestEdge = edge
            }
        }
        console.log("returning edge: ", bestEdge)
        return board.getEdge(bestEdge.x, bestEdge.y, bestEdge.vertical);
    }

    static minMax(board, thisplayer, depth) {
        let availableEdges = this.availableEdges(board);

        if (depth < 5) {
            for (let i = 0; i < availableEdges.length; i++) {
                let edge = availableEdges[i];
                let copy = board.copy();
                copy.selectEdge(copy.getEdge(edge.x, edge.y, edge.vertical));
                return this.minMax(copy, thisplayer, depth + 1);
            }
        }

        let player = board.getPlayerByName(thisplayer);
        return player.score;
    }
}