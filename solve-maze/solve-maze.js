let GRID_WIDTH;
let GRID_HEIGHT;
let start;
let maze = [];
let stack = [];
let route = [];

document.addEventListener('DOMContentLoaded', startMaze)

async function startMaze() {
  await fetchMaze()
  drawMaze()
  solveMaze()
}

function drawMaze() {
  const mazeDiv = document.getElementById("maze");
  mazeDiv.innerHTML = "";
  mazeDiv.style.setProperty("--GRID_WIDTH", GRID_WIDTH);
  for (let i = 0; i < maze.length; i++) {
    const row = maze[i];

    for (let j = 0; j < row.length; j++) {
      const cell = row[j];

      const newCell = document.createElement("div");
      newCell.setAttribute("data-row", cell.row);
      newCell.setAttribute("data-col", cell.col);
      newCell.classList.add("node");

      if (cell.row === start.row && cell.col === start.col) {
        newCell.classList.add("start");
        newCell.textContent = "Start";
      }
      if (cell.row === goal.row && cell.col === goal.col) {
        newCell.classList.add("goal");
        newCell.textContent = "Goal";
      }
      if (cell.north) {
        newCell.classList.add("north-wall");
      }
      if (cell.south) {
        newCell.classList.add("south-wall");
      }
      if (cell.west) {
        newCell.classList.add("west-wall");
      }
      if (cell.east) {
        newCell.classList.add("east-wall");
      }

      mazeDiv.appendChild(newCell);
    }
  }
}

function show(route) {
  console.log(route, 'route')
  let i = 0;
  setInterval(() => {
    if(i < route.length) {
      drawRoute(route[i])
      i++
    }
  }, 1000)
}

function drawRoute(cell) {
  const mazeDiv = document.getElementById("maze");
  const cellElement = mazeDiv.querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`);
  cellElement.classList.add('route')
}

function solveMaze() {
  let currentCell = start;
   
  while(currentCell.row !== goal.row || currentCell.col !== goal.col) {
    route.push(currentCell)
    currentCell.visited = true;
    console.log(currentCell, 'current')    

    const cells = getUnvisitedNeighbors(currentCell)
    cells.forEach(cell => {
    stack.push(cell)
  })

  currentCell = stack.pop();
  
}

  route.push(goal)

  show(route)
}

function getUnvisitedNeighbors(cell) {
  const neighbors = [];

  
  if(!cell.east && !visitCell(cell.row, cell.col + 1).visited) {
    neighbors.push(visitCell(cell.row, cell.col + 1))
  }

  if(!cell.south && !visitCell(cell.row + 1, cell.col).visited) {
      neighbors.push(visitCell(cell.row + 1, cell.col))
  }

  if(!cell.west && !visitCell(cell.row, cell.col - 1).visited) {
      neighbors.push(visitCell(cell.row, cell.col - 1))
  }

  if(!cell.north && !visitCell(cell.row - 1, cell.col).visited) {
      neighbors.push(visitCell(cell.row - 1, cell.col))
  }


  return neighbors
}

function visitCell(row, col) {
  return maze[row][col];
}

async function fetchMaze() {
  const response = await fetch("/solve-maze/maze.json");
  data = await response.json();
  console.log(data, "data");
  GRID_WIDTH = data.cols;
  GRID_HEIGHT = data.rows;
  maze = data.maze;
  start = maze[data.start.row][data.start.col];
  goal = maze[data.goal.row][data.goal.col];
  console.log(start, "start");
  console.log(goal, "goal");
  return data;
}
