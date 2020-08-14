//Global Variable Declarations
//theme
var start_seek_color = "orange";
var end_seek_color = "rgb(0,115,255)";
var seek_color =  "#928caf"; //eflatun:"#928caf" // green: "#8ac28c";
var wall_color = "#444";
var grid_color = "#111";
var body_bg_color = "#111";
var shortest_path_color = "#16db4e"; //soft green: "#4CAF50" //neon green: #16db4e";

var total_cell_count = 0;
var total_row_count = 0;
var grid_size = 0;
var one_row_cell_count = 0;
var hover_color = start_seek_color;
var start_point_selected = false;
var end_point_selected = false;
var wall_end_cell = undefined;
var wall_ended = false;
var wall_started = false;
var start_cell = undefined;
var end_cell = undefined;
var walls = []
var entered_to_cell = false;
var the_seek_list = undefined;
var the_shortest_path = undefined;
var the_maze = undefined;
var last_cell_in_shortest_path = undefined;
var sleep_ms = 0;



function initializeGlobals(){
    total_cell_count = 0;
    total_row_count = 0;
    grid_size = 0;
    one_row_cell_count = 0;
    hover_color = start_seek_color;
    start_point_selected = false;
    end_point_selected = false;
    wall_end_cell = undefined;
    wall_ended = false;
    wall_started = false;
    start_cell = undefined;
    end_cell = undefined;
    walls = []
    entered_to_cell = false;
    the_seek_list = undefined;
    the_shortest_path = undefined;
    the_maze = undefined;
    last_cell_in_shortest_path = undefined;
    sleep_ms = 0;
}

function darkTheme(){
    start_seek_color = "orange";
    end_seek_color = "rgb(0,115,255)";
    seek_color = "#928caf";
    wall_color = "#444";
    grid_color = "#111";
    body_bg_color = "#111";
    shortest_path_color = "#16db4e";
    hover_color = start_seek_color;
}

function lightTheme(){
    start_seek_color = "orange";
    end_seek_color = "rgb(0,115,255)";
    seek_color = "#928caf";
    wall_color = "#444";
    grid_color = "#ddd";
    body_bg_color = "#ddd";
    shortest_path_color = "#16db4e";
    hover_color = start_seek_color;
}

function changeTheme(button){
    clearGrid();
    if(button.getAttribute("value")==0)
        darkTheme();
    else
        lightTheme();

    document.getElementById("grid_table").style.backgroundColor = grid_color;
    var tds = document.getElementsByTagName("td");
    var i;
    for(i=0; i<tds.length; i++){
        tds[i].style.backgroundColor = grid_color;
    }
}

function createRandomWalls(percent){
    clearGrid();
    var table = document.getElementById("grid_table");
    var rows = table.rows;

    var cell_no;
    for(cell_no=0; cell_no<total_cell_count; cell_no++){
        row_index = Math.floor(cell_no / one_row_cell_count);
        cell_index = cell_no % one_row_cell_count;
        row = rows[row_index];
        cells = row.cells;
        cell = cells[cell_index];
        cell_prop = Math.floor(Math.random() * 100);
        if(cell_prop < percent){
            cell.setAttribute("is_wall", 1);
            cell.style.backgroundColor = wall_color;
            walls.push(cell.getAttribute("value"));
        }
    }
}

function giveRandomStartAndEndPoints(){
    if(start_cell)
        start_cell.style.backgroundColor = grid_color;
    if(end_cell)
        end_cell.style.backgroundColor = grid_color;
    start_cell = undefined;
    end_cell = undefined;
    start_point_selected = false;
    end_point_selected = false;

    var table = document.getElementById("grid_table");
    var rows = table.rows;

    while(!start_point_selected || !end_point_selected){
        var cell_no = Math.floor(Math.random() * total_cell_count);
        row_index = Math.floor(cell_no / one_row_cell_count);
        cell_index = cell_no % one_row_cell_count;
        row = rows[row_index];
        cells = row.cells;
        cell = cells[cell_index];
        if(cell.getAttribute("is_wall")==0){
            if(!start_point_selected){
                start_cell = cell;
                start_point_selected = true;
                start_cell.style.backgroundColor = start_seek_color;
            }
            else{
                end_cell = cell;
                end_point_selected = true;
                end_cell.style.backgroundColor = end_seek_color;
            }
        }
    }
    hover_color = wall_color;
    


    
}


function changeCellColor(cell){
    if(cell === start_cell || cell === end_cell || wall_ended){
        entered_to_cell ? entered_to_cell = false : entered_to_cell = true; // correct toggle between if(!entered_to cell) and else 
        wall_started = false;
        wall_ended = false;
        return;
    }

    if(wall_started){
        cell.style.backgroundColor = hover_color;
        cell.setAttribute("is_wall", 1);
        walls.push(cell.getAttribute("value"));
    }

    else{
        if(!entered_to_cell){
            if (cell.getAttribute("is_wall") != 1 && cell.getAttribute("is_seek") != 1 && cell.getAttribute("is_in_shortest_path") != 1){
                cell.style.backgroundColor = hover_color;
            }
            entered_to_cell = true;
        }
        else{
            if (cell.getAttribute("is_wall") != 1 && cell.getAttribute("is_seek") != 1 && cell.getAttribute("is_in_shortest_path") != 1){
                cell.style.backgroundColor = grid_color;		
            }
            entered_to_cell = false;
        }
    }
}

function cellClicked(cell){
    if(!start_point_selected){
        if(cell.getAttribute("is_wall")!=1){
            start_point_selected = true;
            hover_color = end_seek_color;
            start_cell = cell;
            // start_cell.setAttribute("id", "start-cell");
            // var locator = document.createElement("div");
            // locator.setAttribute("id", "start-cell-locator");
            // locator.style.zIndex = 2;
            // var text = document.createTextNode("Start");
            // locator.appendChild(text);
            // console.log("locator created");
            // document.body.appendChild(locator);
            // console.log("locator appended");
        }
        return;
    }
    if(!end_point_selected){
        if(cell.getAttribute("is_wall")!=1){
            end_point_selected = true;
            hover_color = wall_color;
            end_cell = cell;
        }
        return;
    }
    if(!wall_started){
        wall_started = true;
        wall_ended = false;
    }
    else{
        wall_started = false;
        wall_ended = true;
    }
}

function changeGrid(button){
    var grid_size_px = grid_size;
    initializeGlobals();
    var table = document.getElementById("grid_table");
    var rows = table.rows;
    if(button)
        grid_size_px = button.getAttribute("value");

    var row_count = rows.length;
    destroyGrid(row_count);
    createGrid(grid_size_px);
}

function destroyGrid(row_count){
    console.log("method start: destroyGrid()");
    var table = document.getElementById("grid_table");
    for(r = 0; r < row_count; r++) {
        table.deleteRow(0);
    }
    console.log("method end: destroyGrid()");
}

function clearGrid(){
    changeGrid();
}

function createGrid(grid_size_px){
    grid_size = grid_size_px;
    console.log("method start: createGrid()");
    var cell_size = parseInt(grid_size_px);
    var grid = document.getElementById("grid");
    var grid_width = grid.clientWidth;
    var grid_height = grid.clientHeight;
    var row_count = parseInt(grid_height / cell_size);
    var cell_count = parseInt(grid_width / cell_size);
    one_row_cell_count = cell_count;
    total_row_count = row_count;
    total_cell_count = row_count * cell_count;

    var table = document.getElementById("grid_table");
    
    var r, c;
    for(r = 0; r < row_count; r++) {
        var row = table.insertRow(r);
        row.setAttribute("class","table_row");
        row.setAttribute("height",cell_size.toString());
        for(c = 0; c < cell_count; c++){
            var cell = row.insertCell(c);
            cell.setAttribute("onmouseenter","changeCellColor(this)");
            cell.setAttribute("onmouseleave","changeCellColor(this)");
            cell.setAttribute("onclick","cellClicked(this)");
            cell.setAttribute("value",(r * cell_count) + c);
            cell.setAttribute("is_wall", 0);
            cell.setAttribute("is_seek", 0);
            cell.setAttribute("is_in_shortest_path", 0);
        }
    }
    console.log("method end: createGrid()");
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function showProcess(){

    //Show Seeking Process
    var table = document.getElementById("grid_table");
    var rows = table.rows;
    var seek_list_array = [];
    for(i=0; i<the_seek_list.length; i++){
        seek_list_array.push(the_seek_list[i]);
    }
    var seek_list_array_length = seek_list_array.length;
    seek_list_array.forEach((cell_no, i) => {        
        setTimeout(() => {
            row_index = Math.floor(cell_no / one_row_cell_count);
            cell_index = cell_no % one_row_cell_count;
            var row = rows[row_index];
            var cells = row.cells;
            var cell = cells[cell_index];
            if (cell !== start_cell){
                cell.style.backgroundColor = seek_color;
                cell.setAttribute("is_seek", 1);
            }

            //Show The Shortest Path
            if(i == seek_list_array_length-1){
                showing_seeking_process = false;
                console.log("SEEKING_PROCESS_STATUS:", showing_seeking_process);
                showShortestPath(the_shortest_path);
            }
        }, i/2);

    });
}


function makeGridFullWall(){
    var table = document.getElementById("grid_table");
    var rows = table.rows;
    var r, c;
    for(r=0; r<rows.length; r++){
        var cells = rows[r].cells;
        for(c=0; c<cells.length; c++){
            var cell = cells[c];
            cell.setAttribute("is_wall", 1);
            cell.style.border = "1px solid" + grid_color;
            cell.style.backgroundColor = wall_color;
        }
    }
}


function showMaze(){
    makeGridFullWall();
    var table = document.getElementById("grid_table");
    var rows = table.rows;
    var maze_array = [];
    for(i=0; i<the_maze.length; i++){
        maze_array.push(the_maze[i]);
    }
    var maze_array_length = maze_array.length;
    maze_array.forEach((cell_no, i) => {        
        setTimeout(() => {
            row_index = Math.floor(cell_no / one_row_cell_count);
            cell_index = cell_no % one_row_cell_count;
            var row = rows[row_index];
            var cells = row.cells;
            var cell = cells[cell_index];
            cell.style.backgroundColor = grid_color;
            cell.setAttribute("is_wall", 0);

            if(i == maze_array_length-1){
                var w;
                for(w=0; w<total_cell_count-1; w++){
                    row_index = Math.floor(w / one_row_cell_count);
                    cell_index = w % one_row_cell_count;
                    var row = rows[row_index];
                    var cells = row.cells;
                    var cell = cells[cell_index];
                    if(cell.getAttribute("is_wall")==1){
                        walls.push(cell.getAttribute("value"));
                    }
                    
                }
            }
        }, i);

    });
}



function showShortestPath(shortest_path){
    var table = document.getElementById("grid_table");
    var rows = table.rows;

    var shortest_path_array = [];
    for(i=0; i<shortest_path.length; i++){
        shortest_path_array.push(shortest_path[i]);
    }
    var shortest_path_array_length = shortest_path_array.length;
    shortest_path_array.forEach((cell_no, i) => {        
        setTimeout(() => {
            row_index = Math.floor(cell_no / one_row_cell_count);
            cell_index = cell_no % one_row_cell_count;
            var row = rows[row_index];
            var cells = row.cells;
            var cell = cells[cell_index];
            cell.style.backgroundColor = shortest_path_color;
            cell.setAttribute("is_in_shortest_path", 1);
        }, i*5);
    });
}





$(document).ready(function(){

    // Find Shortest Path Ajax call
    $(document).on('submit', '#fsp-form', function(e){
        e.preventDefault();
        if(start_point_selected && end_point_selected){
            var post_data = {
                "start": start_cell.getAttribute('value'),
                "end": end_cell.getAttribute('value'),
                "row_count": total_row_count,
                "col_count": one_row_cell_count,
                "walls": walls,
                "request_for": 1
            }
            var dfd = ajaxCall(post_data); //deferred object
            dfd.pipe(function(data){
                var seek_list = data.seek_list;
                the_seek_list = seek_list;
                var shortest_path = data.shortest_path;
                the_shortest_path = shortest_path;
                showProcess();
                return data;
            });
        }
    })


    // Create Random Maze Ajax call
    $(document).on('submit', '#maze-form', function(e){
        e.preventDefault();
        clearGrid();
        var post_data = {
            "row_count": total_row_count,
            "col_count": one_row_cell_count,
            "walls": walls,
            "request_for": 0
        }
        var dfd = ajaxCall(post_data); //deferred object
        dfd.pipe(function(data){
            var maze = data.maze;
            the_maze = maze;
            showMaze();
            return data;
        });
    })
});