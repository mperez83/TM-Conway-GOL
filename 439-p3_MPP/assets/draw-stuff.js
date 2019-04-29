// Draw stuff
// Time-stamp: <2019-04-06 20:08:33 Michael Perez>
//
//draw_cells author: Michael Perez
//Email: m_perez83@csu.fullerton.edu
//Description: This file contains functions to do the following two things:
//draw_cells: Draws all of the cells based on Wolfram Rule 150
//function at work in this application is draw_cells.
// ------------------------------------------------------------

var cells = [
  [],
  []
];

function draw_cells(rctx, scale) {

  let width = rctx.canvas.width / scale;
  let height = rctx.canvas.height / scale;

  //Create nodes
  for (let row = 0; row < height; row++) {
    if (!cells[row]) cells[row] = [];
    for (let col = 0; col < width; col++) {
      cells[row][col] = {
        state: 0,
        liveNeighborCount: 0
      };
    }
  }

  //Manually create the first generation
  /*cells[0][19].state = 1;

  for (let row = 0; row < cells.length; row++) {
    for (let col = 0; col < cells[row].length; col++) {
      rctx.fillStyle = (cells[row][col].state == 0) ? "white" : "black";
      rctx.fillRect(col * scale, row * scale, scale, scale);
    }
  }*/

  //Randomly generate the first generation
  for (let row = 0; row < cells.length; row++) {
    for (let col = 0; col < cells[row].length; col++) {
      cells[row][col].state = Math.floor(Math.random() * 2);
      rctx.fillStyle = (cells[row][col].state == 0) ? "white" : "black";
      rctx.fillRect(col * scale, row * scale, scale, scale);
    }
  }

  //Create TM and set the head to the top center cell
  tm = {
    hr: 0,
    hc: 0,
    stateArray: cells,
    nwState: 0,
    nState: 0,
    neState: 0,
    wState: 0,
    cState: 0,
    eState: 0,
    swState: 0,
    sState: 0,
    seState: 0
  };

  //Perform all TM operations
  setInterval(function() {
    gather_cell_information(tm, rctx);
    reset_tm_head_to_0_0(tm, rctx);
    generate_next_generation(tm, rctx);
    reset_tm_head_to_0_0(tm, rctx);
  }, 100);

}

function gather_cell_information(tm, rctx) {

  let rowCount = 0;
  let colCount = 0;

  while (rowCount < tm.stateArray.length) {

    colCount = 0;
    while (colCount < tm.stateArray[0].length) {
      cells[tm.hr][tm.hc].liveNeighborCount = 0;
      read_cell_state(tm, rctx, "nw");
      read_cell_state(tm, rctx, "n");
      read_cell_state(tm, rctx, "ne");
      read_cell_state(tm, rctx, "w");
      read_cell_state(tm, rctx, "c");
      read_cell_state(tm, rctx, "e");
      read_cell_state(tm, rctx, "sw");
      read_cell_state(tm, rctx, "s");
      read_cell_state(tm, rctx, "se");
      colCount++;
      if (colCount != tm.stateArray[0].length) move_tm_right(tm, rctx);
    }

    rowCount++;

    if (rowCount != tm.stateArray.length) {
      while (tm.hc != 0) move_tm_left(tm, rctx);
      move_tm_down(tm, rctx);
    }

  }

}

function reset_tm_head_to_0_0(tm, rctx) {
  while (tm.hr != 0) move_tm_up(tm, rctx);
  while (tm.hc != 0) move_tm_left(tm, rctx);
}

function generate_next_generation(tm, rctx) {

  let rowCount = 0;
  let colCount = 0;

  while (rowCount < tm.stateArray.length) {

    colCount = 0;
    while (colCount < tm.stateArray[0].length) {
      write_cell_state(tm, rctx);
      colCount++;
      if (colCount != tm.stateArray[0].length) move_tm_right(tm, rctx);
    }

    rowCount++;

    if (rowCount != tm.stateArray.length) {
      while (tm.hc != 0) move_tm_left(tm, rctx);
      move_tm_down(tm, rctx);
    }

  }

}



function read_cell_state(tm, rctx, targetCell) {
  switch (targetCell) {

    case "nw":
      if (tm.hr == 0 || tm.hc == 0) {
        tm.nwState = 0;
      }
      else {
        move_tm_left(tm, rctx);
        move_tm_up(tm, rctx);
        tm.nwState = cells[tm.hr][tm.hc].state;
        move_tm_down(tm, rctx);
        move_tm_right(tm, rctx);
        if (tm.nwState == 1) cells[tm.hr][tm.hc].liveNeighborCount++;
      }
      break;

    case "n":
      if (tm.hr == 0) {
        tm.nState = 0;
      }
      else {
        move_tm_up(tm, rctx);
        tm.nState = cells[tm.hr][tm.hc].state;
        move_tm_down(tm, rctx);
        if (tm.nState == 1) cells[tm.hr][tm.hc].liveNeighborCount++;
      }
      break;

    case "ne":
      if (tm.hr == 0 || tm.hc == (tm.stateArray[0].length - 1)) {
        tm.neState = 0;
      }
      else {
        move_tm_right(tm, rctx);
        move_tm_up(tm, rctx);
        tm.neState = cells[tm.hr][tm.hc].state;
        move_tm_down(tm, rctx);
        move_tm_left(tm, rctx);
        if (tm.neState == 1) cells[tm.hr][tm.hc].liveNeighborCount++;
      }
      break;

    case "w":
      if (tm.hc == 0) {
        tm.wState = 0;
      }
      else {
        move_tm_left(tm, rctx);
        tm.wState = cells[tm.hr][tm.hc].state;
        move_tm_right(tm, rctx);
        if (tm.wState == 1) cells[tm.hr][tm.hc].liveNeighborCount++;
      }
      break;

    case "c":
      tm.cState = cells[tm.hr][tm.hc].state;
      break;

    case "e":
      if (tm.hc == (tm.stateArray[0].length - 1)) {
        tm.eState = 0;
      }
      else {
        move_tm_right(tm, rctx);
        tm.eState = cells[tm.hr][tm.hc].state;
        move_tm_left(tm, rctx);
        if (tm.eState == 1) cells[tm.hr][tm.hc].liveNeighborCount++;
      }
      break;

    case "sw":
      if (tm.hr == (tm.stateArray.length - 1) || tm.hc == 0) {
        tm.swState = 0;
      }
      else {
        move_tm_left(tm, rctx);
        move_tm_down(tm, rctx);
        tm.swState = cells[tm.hr][tm.hc].state;
        move_tm_up(tm, rctx);
        move_tm_right(tm, rctx);
        if (tm.swState == 1) cells[tm.hr][tm.hc].liveNeighborCount++;
      }
      break;

    case "s":
      if (tm.hr == (tm.stateArray.length - 1)) {
        tm.sState = 0;
      }
      else {
        move_tm_down(tm, rctx);
        tm.sState = cells[tm.hr][tm.hc].state;
        move_tm_up(tm, rctx);
        if (tm.sState == 1) cells[tm.hr][tm.hc].liveNeighborCount++;
      }
      break;

    case "se":
      if (tm.hr == (tm.stateArray.length - 1) || tm.hc == (tm.stateArray[0].length - 1)) {
        tm.seState = 0;
      }
      else {
        move_tm_right(tm, rctx);
        move_tm_down(tm, rctx);
        tm.seState = cells[tm.hr][tm.hc].state;
        move_tm_up(tm, rctx);
        move_tm_left(tm, rctx);
        if (tm.seState == 1) cells[tm.hr][tm.hc].liveNeighborCount++;
      }
      break;
  }
}

function write_cell_state(tm, rctx) {
  //Live cells
  if (cells[tm.hr][tm.hc].state == 1) {
    //Underpopulation death
    if (cells[tm.hr][tm.hc].liveNeighborCount < 2) {
      cells[tm.hr][tm.hc].state = 0;
    }

    //Good population sustain
    else if (cells[tm.hr][tm.hc].liveNeighborCount == 2 || cells[tm.hr][tm.hc].liveNeighborCount == 3) {
      cells[tm.hr][tm.hc].state = 1;
    }

    //Overpopulation death
    else if (cells[tm.hr][tm.hc].liveNeighborCount > 3) {
      cells[tm.hr][tm.hc].state = 0;
    }
  }

  //Dead cells
  else {
    //Reproduction
    if (cells[tm.hr][tm.hc].liveNeighborCount == 3) {
      cells[tm.hr][tm.hc].state = 1;
    }
  }

  reset_tm_head_to_state_color(tm, rctx);
}



function move_tm_up(tm, rctx) {
  reset_tm_head_to_state_color(tm, rctx);
  tm.hr--;
  rctx.fillStyle = "purple";
  rctx.fillRect(tm.hc * scale, tm.hr * scale, scale, scale);
}

function move_tm_down(tm, rctx) {
  reset_tm_head_to_state_color(tm, rctx);
  tm.hr++;
  rctx.fillStyle = "purple";
  rctx.fillRect(tm.hc * scale, tm.hr * scale, scale, scale);
}

function move_tm_left(tm, rctx) {
  reset_tm_head_to_state_color(tm, rctx);
  tm.hc--;
  rctx.fillStyle = "purple";
  rctx.fillRect(tm.hc * scale, tm.hr * scale, scale, scale);
}

function move_tm_right(tm, rctx) {
  reset_tm_head_to_state_color(tm, rctx);
  tm.hc++;
  rctx.fillStyle = "purple";
  rctx.fillRect(tm.hc * scale, tm.hr * scale, scale, scale);
}

function reset_tm_head_to_state_color(tm, rctx) {
  rctx.fillStyle = (cells[tm.hr][tm.hc].state == 0) ? "white" : "black";
  rctx.fillRect(tm.hc * scale, tm.hr * scale, scale, scale);
}
