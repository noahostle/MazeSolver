
//Note: y coordinate is top down in js, so y coordincate calculations will be 
//different from pseudocode.

//allow user to enter
var entering = true;

//imageConvert function gets all pixels in image as coordinate system 
function imageConvert(event){

	//makes new Image object called userImage and makes it accessible from whole window
	window.userImage = new Image();
	//whenever an image is loaded:
	userImage.onload = function(){

		//gets userImage max width and height coordinates
		//window. is here to make the variables usable outside of function
		window.maxX = userImage.height;
		window.maxY = userImage.width;

		//console.log(maxX,maxY)
	}

	//uses image from user event (uploading) passed in through upload button click
	userImage.src = URL.createObjectURL(event.target.files[0]);
	//hides upload button
	document.getElementById("userImage").style.display="none";
	
}



//initializes canvas to image size
function createCanvas (){


	var canvas = document.getElementById("userCanvas");
	context = canvas.getContext('2d');  
	//sets canvas to visible, and correct width and height
	canvas.style.display = "block"
	canvas.width = window.maxX;
	canvas.height = window.maxY;
	//draw maze image onto canvas
	context.drawImage(userImage, 0, 0);
	window.alert("enter start point by clicking on maze")
	//hide create canvas button, show start point button
	document.getElementById("canvasbutton").style.display="none";
	document.getElementById("startpointbutton").style.display="inline";
	

}

function getStartPoint(){
	//clear the canvas so the if statement doesnt check the red dot
	//if the chosen point is on a "wall", dont let user enter it
	context.drawImage(userImage, 0, 0);
	if (checkWall(tempX,tempY) == "black"){
		window.alert("please select an empty space on the maze")
		return;
	}
	//draw the dot back on the canvas
	context.fillRect(tempPoint[0]-3, tempPoint[1]-3, 5, 5);
	//set start point to the last user click
	window.startPoint = tempPoint;
	//change visibility of confirmation buttons
	document.getElementById("startpointbutton").style.display="none";
	document.getElementById("endpointbutton").style.display="inline";

}

function checkWall(x,y){
	//get pixel data of input coord
	var pixelData = context.getImageData(x, y, 1,1).data; 
	//if pixel color is 0,0,0
	if (pixelData[0] == 0 && pixelData[1] == 0 && pixelData[2] == 0){
		var color = "black";
	//if pixel color is 255,255,255
	} else if (pixelData[0] == 255 && pixelData[1] == 255 && pixelData[2] == 255){
		var color = "white";
	} else {
		var color = "unknown";
	}
	return color
}

function getEndPoint(){
	//clear the canvas so the if statement doesnt check the red dot
	//if the chosen point is on a "wall", dont let user enter it
	context.drawImage(userImage, 0, 0);
	if (checkWall(tempX,tempY) == "black"){
		context.fillRect(window.startPoint[0]-3, window.startPoint[1]-3, 5, 5);
		window.alert("please select an empty space on the maze")
		return;
	}
	//draw the dots back on the canvas
	context.fillRect(window.startPoint[0]-3, window.startPoint[1]-3, 5, 5);
	context.fillRect(tempPoint[0]-3, tempPoint[1]-3, 5, 5);
	//set end point to the last user click
	window.endPoint = tempPoint;
	//hide the button
	document.getElementById("endpointbutton").style.display="none";
	//console.log(startPoint,endPoint)
	//after end point has been generated, let user click solve button
	document.getElementById("solvebutton").style.display="inline";
	//dont let the user click any more boxes since theyve entered all points already
	entering="no";

}



//code to see where user clicks on canvas
function getCursorPosition(canvas, event) {
	//translates location of event from event to coordinate
	//this is used to determine start and end point
	const rect = canvas.getBoundingClientRect();
	window.tempX = event.clientX - rect.left;
	window.tempY = event.clientY - rect.top;
	//only draw boxes if entering = True
	if (entering==true){
		//clear canvas and draw box on pixel user clicked
		context.drawImage(userImage, 0 ,0);
		context.fillStyle = "#0000FF";
		context.fillRect(tempX-3, tempY-3, 5, 5);
		//since canvas was cleared to remove the old box that wasn't submitted,
		//if they exist, redraw start/endpoints
		if (typeof window.startPoint !== "undefined"){
			context.fillRect(startPoint[0]-3, startPoint[1]-3, 5, 5);
		}
		if (typeof window.endPoint !== "undefined"){
			context.fillRect(endPoint[0]-3, endPoint[1]-3, 5, 5);
		}
	}
	//variable needs to be accessible by other functions, bundling as array
	window.tempPoint = [tempX,tempY];
	console.log("user: "+tempPoint);
}

//listens for user click on canvas
const canvas = document.querySelector('canvas') 
//when mouse click happens, run the cursor position function at event e
canvas.addEventListener('mousedown', function(e) {
	getCursorPosition(canvas, e);
})


//moves finder pixel forward in its direction
function move(){
	//console.log("moving");
	switch(window.direction){
		//move one pixel depending on direction (eg. if direction 0, move upward)
		case 0: window.posY=window.posY-1; break;
		case 90: window.posX=window.posX+1; break;
		case 180: window.posY=window.posY+1; break;
		case 270: window.posX=window.posX-1; break;
	}

}

//initialise corners array outside of function so it doesn't reset when function is run
//corners contains list of all times finder pixel turns, used for route optimisation as its
//an array of coordinates that should have line of sight to eachother
var corners=[];
//turns the finder pixel left or right depending on bearing input
function turn(bearing){
	//if turning left, subtract 90 degrees from direction, if else (right) add 90 degrees
	if (bearing == "left"){
		window.direction = window.direction - 90;
	} else {
		window.direction = window.direction + 90;
	}
	//if the direction is 360 set it to 0, -90 to 270, in both cases both values are the 
	//same direction, but other if statements want direction in format 0,90,180,270, 
	//so 360 and -90 are not allowed
	if (window.direction == 360){
		window.direction =0;
	}
	if (window.direction == -90){
		window.direction = 270;
	}
	//whenever this function is run, add the corner it turned to a list of corners in the solution
	//(for route optimisation)
	corners.push([window.posX,window.posY]);
	//console.log("turning "+bearing+window.direction);
	window.solvedCorners = corners;
}


//checks pixel either ahead or to left depending on reference input based on pixel direction
function facing(reference){
	//return value of pixel ahead of current position depending on current rotation
	//(relative "ahead" pixel changes when finder pixel turns: if pixel turns to left
	//then instead of the ahead pixel being above, it is now to the left of the pixel)
	if (reference == "forward"){
		//console.log("checking: " +reference)
		switch(window.direction){
			case 0: return checkWall(window.posX,window.posY-1); break;
			case 90: return checkWall(window.posX+1,window.posY); break;
			case 180: return checkWall(window.posX,window.posY+1); break;
			case 270: return checkWall(window.posX-1,window.posY); break;
		}
	} 
	//same thing as above, but for the left instead of ahead
	if (reference == "left") {
		//console.log("checking: " +reference)
		switch(window.direction){
			case 0: return checkWall(window.posX-1,window.posY); break;
			case 90: return checkWall(window.posX,window.posY-1); break;
			case 180: return checkWall(window.posX+1,window.posY); break;
			case 270: return checkWall(window.posX,window.posY+1); break;
		}
	}
}


//when the maze solver is started, the finder pixel needs to attach itself to the left wall,
//otherwise it will spin indefinitely in 4 white pixels not touching the wall
function getToWall(){
	//console.log("getting to wall");
	//clear the maze so red dots dont get in the way
	context.drawImage(userImage, 0, 0);
	//set finder pixel to starting point/direction
	window.posX = window.startPoint[0];
	window.posY = window.startPoint[1];
	//face left to get onto the left wall
	window.direction = 270;
	//until the pixel ahead is black move forward
	while (facing("forward") == "white"){
		move();
	}

	//now that wall has been gotten, solve maze using coordinates on wall
	solveMaze(window.posX,window.posY);
}


//Function uses Bresenhams algorithm,
//gives a list of all the pixels between x,y and the endpoint
//which I can use to check if the finder pixel has line of sight from startxy to endxy,
//and also for route optimisation
function getPath(startx, starty, endx, endy){
	//get canvas information
	var data = context.getImageData(0,0,canvas.width,canvas.height).data;
	//intialise list of pixels from startxy to endxy
	var line = [];

	//round start x and y
	var y = Math.floor(starty);
	var x = Math.floor(startx);
	//round endx and y
	var xx = Math.floor(endx);
	var yy = Math.floor(endy);
	//difference between end and start x
	var dx = Math.abs(xx - x); 
	var sx = x < xx ? 1 : -1;
	//difference between end and start y
	var dy = -Math.abs(yy - y);
	var sy = y < yy ? 1 : -1;
	var err = dx + dy;
	var e2;
	var end = false;

	while (!end) {
		//on every loop, add pixels in bresenham line to line array
		line.push(context.getImageData(x, y, 1,1).data);
		//if new xy = end xy then stop
		if ((x === xx && y === yy)) {
			end = true;
		} 
		//Bresenhams algorithm, steps through all pixels that will touch line
		//from xy to endxy
		else {
			e2 = 2 * err;
			if (e2 >= dy) {
				err += dy;
			x += sx;
			}
			if (e2 <= dx) {
				err += dx;
				y += sy;
			}
		}
	}
	//for every pixel in bresenham line from startxy to endxy,
	var flag=true;
	for (item in line){
		//if any pixel is black (ie. line from startxy to endxy doesnt have line of sight) then
		//return false
		if (line[item][0] == 0 && line[item][1] == 0 && line[item][2] == 0){
			flag = false;
		}
		//otherwise, flag remains true; all pixels between startxy and endxy are white,
		//start point has clear line of sight (no black pixel walls) to end point
	}
	return flag;
	}

//this generates a more efficient solution by connecting corners in the original solution together
//producing a shorter path to the solution
function checkCorners(){
	var index=0;
	//console.log("corners in solution"); console.log(solvedCorners);
	//for each row of corners in solution do:
	while (index < window.solvedCorners.length-1){
		//for each solution after the one being used in loop above
		for (x=index+1; x<window.solvedCorners.length;x++){
			//console.log("path: "+[window.solvedCorners[index][0], window.solvedCorners[index][1]]+"::" +[window.solvedCorners[x][0], window.solvedCorners[x][1]] +" is "+getPath(window.solvedCorners[index][0], window.solvedCorners[index][1], window.solvedCorners[x][0], window.solvedCorners[x][1]));
			//console.log(index+" to "+x);

			//see if the top loops corner has line of sight to each corner in nested loop
			//if it does have line of sight, add it to the list.

			//for each corner down the second loop, if it has line of sight, this will override corner variable
			//this works because corners further down the list are closer to the end,
			//since corners further up the list didnt get to the endpoint, otherwise the list 
			//would have stopped there
			if (getPath(window.solvedCorners[index][0], window.solvedCorners[index][1], window.solvedCorners[x][0], window.solvedCorners[x][1]) == true){
				var corner = window.solvedCorners[x];
				//set a varible for the index of the top loop so it can jump to the new corner,
				//since there is a pathfrom the last corner to this one
				//so checking corners inbetween that would draw extra lines and mess up the 
				//solution
				window.newIndex = x;

			}

		}
		//draw line between top corner and nested loop corner
		context.beginPath();
		context.strokeStyle = "#6f42f5";
		//draw from top loop corner
		context.moveTo(window.solvedCorners[index][0], window.solvedCorners[index][1]);
		//to nested loop corner
		context.lineTo(corner[0], corner[1]);
		context.stroke();
		//set index of top loop to last drawn corner
		index = window.newIndex;
		//redraw start and endpoints on top of line
		context.fillStyle = "#0000FF";
		//once whole process is over, redraw start and endpoint dots as they are removed to
		//process the maze
		context.fillRect(endPoint[0]-3, endPoint[1]-3, 5, 5);
		context.fillRect(startPoint[0]-3, startPoint[1]-3, 5, 5);
	}
	


}

//main maze solving algorithm
function solveMaze (x,y){
	context.fillStyle = "#6f42f5";
	//console.log("solving maze");
	var i =1;
	var finished ="no";
	turn("right");

	//loop solve maze algorithm until finder pixel is at the endpoint
	while (finished!=="yes") {
		i++;
		//if pixel to left is white, turn left and move forward
		if (facing("left") == "white"){
			//console.log("pixel to left is white");
			turn("left");
			move();

		//if pixel ahead is black, turn right, but dont moce forward because right pixel hasnt been checked
		} else if (facing("forward") == "black"){
			//console.log("pixel ahead is black");
			turn("right");
		//if pixel to left is black, and pixel ahead is white, then the pixel must be following left
		//wall, so just move forward
		} else{
			//try to move, this catches the pixel if it tries to go outside the canvas
			try {
				move();
			} 
			//if try{ move } fails, then finder pixel is at a wall, so it should just turn right
			catch {
				turn("right");
			}
		}
		//runs bresenham algorithm every ten loops since bresenham algorithm takes long time 
		//to process
		if (i%10==0){
			//checks finder pixels current location as startxy, and the endpoint as endxy
			//if bresenham line from finer pixel to maze exit has no black in it (no walls)
			if (getPath(window.posX, window.posY, endPoint[0], endPoint[1]) == true){
				//draw line to finish
				context.beginPath();
				context.strokeStyle = "#6f42f5";
				context.moveTo(window.posX, window.posY);
				context.lineTo(endPoint[0], endPoint[1]);
				context.stroke();
				console.log("solution found! optimising path");
				//set flag to end loop
				finished = "yes";
				//optimise solution route
				checkCorners();
				window.alert("solution found!");
			}
		}
		//console.log([posX,posY]);
		//console.log(direction);
	}

}
