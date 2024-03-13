let GRID_WIDTH;
let GRID_HEIGHT;
let start;
let maze = []
let route = []
let backtrack = []
document.getElementById('solve').addEventListener('click', startMaze)


function startMaze() {
    buttonDiv.innerHTML = ""
    mazeDiv.innerHTML = ""
    fetchMaze(drawMaze)
    .then(() => {
        depthFirstSearch();
    })
    .then(() => {
        routeButton();
    })
}

function drawMaze() {
    const mazeDiv = document.getElementById('maze');
    mazeDiv.innerHTML = ""
    mazeDiv.style.setProperty('--GRID_WIDTH', GRID_WIDTH)
    for (let i = 0; i < maze.length; i++) {
        const row = maze[i];

        for (let j = 0; j < row.length; j++) {
            const cell = row[j];
            
            const newCell = document.createElement('div');
            newCell.setAttribute('data-row', cell.row)
            newCell.setAttribute('data-col', cell.col)
            newCell.classList.add('node');

            if(cell.row === start.row && cell.col === start.col) {
                newCell.classList.add('start');
                newCell.textContent = 'Start'
            }
            if(cell.row === goal.row && cell.col === goal.col) {
                newCell.classList.add('goal');
                newCell.textContent = 'Goal'
            }
            if(cell.north) {
                newCell.classList.add('north-wall');
            }
            if(cell.south) {
                newCell.classList.add('south-wall');
            }
            if(cell.west) {
                newCell.classList.add('west-wall');
            }
            if(cell.east) {
                newCell.classList.add('east-wall');
            }

            mazeDiv.appendChild(newCell);
        }
    }
}

function routeButton() {
    
    buttonDiv.innerHTML = ""
    const button = document.createElement('button')
    button.textContent = 'See route/backtrack'
    buttonDiv.appendChild(button)

    button.addEventListener('click', () => {
        updateView();
        updateButton();
    })
}

function updateButton() {
    
    buttonDiv.innerHTML = ""
    const button = document.createElement('button')
    button.textContent = '<- Go back'
    buttonDiv.appendChild(button)

    button.addEventListener('click', () => {
        drawMaze();
        routeButton();
    })
}

function updateView() {
    // route
    for(const cell of route) {
        const cellDiv = document.querySelector(`.node[data-row="${cell.row}"][data-col="${cell.col}"]`)
        cellDiv.classList.add('route');
        
    }

    // backtrack
    for(const cell of backtrack) {
        const cellDiv = document.querySelector(`.node[data-row="${cell.row}"][data-col="${cell.col}"]`)
        cellDiv.classList.add('backtrack');
        cellDiv.textContent = 'Backtrack'
    }
}

function depthFirstSearch(cell = start) {
    cell.visited = true;
    route.push(cell);

    if (cell.row === goal.row && cell.col === goal.col) {
        console.log('we are there')
        return true;
    }
    const unvisitedNeighbors = getUnvisitedNeighbors(cell);

    for (const nextCell of unvisitedNeighbors) {
        console.log(nextCell, "VISITING");
        // I CANT STOP IT??
        if(depthFirstSearch(nextCell)) {
            return true;
        }
    }

    backtrack.push(cell)
    console.log(cell, "BACKTRACKING")
    route.pop();
}

function getUnvisitedNeighbors(cell) {
    const neighbors = [];

    // if south of the cell is unvisited - repeat of the other directions
    if(!cell.south && !visitCell(cell.row + 1, cell.col).visited) {
        neighbors.push(visitCell(cell.row + 1, cell.col))
    }

    if(!cell.west && !visitCell(cell.row, cell.col - 1).visited) {
        neighbors.push(visitCell(cell.row, cell.col - 1))
    }

    if(!cell.north && !visitCell(cell.row - 1, cell.col).visited) {
        neighbors.push(visitCell(cell.row - 1, cell.col))
    }

    if(!cell.east && !visitCell(cell.row, cell.col + 1).visited) {
        neighbors.push(visitCell(cell.row, cell.col + 1))
    }

    return neighbors
}


function visitCell(row, col) {
    return maze[row][col]
}


async function fetchMaze(drawMaze) {
   const response = await fetch('/solve-maze/maze.json')
   data = await response.json()
   console.log(data, 'data')
   GRID_WIDTH = data.cols
   GRID_HEIGHT = data.rows
   maze = data.maze
   start = maze[data.start.row][data.start.col]
   goal = maze[data.goal.row][data.goal.col]
   console.log(start, 'start')
   console.log(goal, 'goal')
   drawMaze()
}
