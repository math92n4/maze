let GRID_WITH;
let maze = []
document.addEventListener('DOMContentLoaded', start)

function start() {
    console.log('hello')
    fetchMaze();
    drawMaze();
}

function drawMaze() {
    console.log(maze)
}

function fetchMaze() {
    fetch('maze.json')
        .then(res => res.json())
        .then(body => {
            maze = body;
        })
}