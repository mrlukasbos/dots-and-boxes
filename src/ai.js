export default class Ai {
    contructor() {
    }

    static getRandomMove(edges) {
        let availableEdges = edges.filter(edge => {
            return edge.clicked == null;
        })
        console.log(availableEdges.length)
        let randomIndex = Math.floor(Math.random() * availableEdges.length);
        return availableEdges[randomIndex];
    }
}