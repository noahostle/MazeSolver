
//Note: y coordinate is top down in js, so y coordincate calculations will be 
//different from pseudocode.

//when the program encounters an error, close and reset everything
window.onerror = function() { window.alert("Sorry, something went wrong, please try again. Try to make sure the image isn't blurry and that the whole maze is in frame."); closePopup(); stopLoad(); };

window.borderentering=false;

//imageConvert function gets all pixels in image as coordinate system 
function imageConvert(event){
	//open pop up menu
	openPopup();
	//makes new Image object called userImage and makes it accessible from whole window
	window.userImage = new Image();
	//whenever an image is loaded:
	userImage.onload = function(){
		//find value that multiplies with the image height to give 400
		var scale = 400/userImage.height;
		//gets userImage max width and height coordinates
		//window. is here to make the variables usable outside of function
		window.maxX = userImage.width*scale;
		window.maxY = userImage.height*scale;

		//create canvas once image has loaded
		createCanvas();
	}

	//uses image from user event (uploading) passed in through upload button click
	userImage.src = URL.createObjectURL(event.target.files[0]);
	
}

//opens popup by setting all elements to visible using appropriate animations
function openPopup(){

	document.getElementById("popup").style.display = "inline";
	document.getElementById("error").style.display = "block";
	document.getElementById("popup").style.animation = "transition 1.25s ease-in-out";
	document.getElementById("grey").style.display = "block";
	document.getElementById("grey").style.animation = "fade 1s ease-in-out forwards";
	document.getElementById("startpointbutton").style.display="block";
	document.getElementById("error").style.display="block";
	//reset border (user lines)
	window.border=[];
	//allow user to enter points
	window.entering=true;


}

function exportsolution(){
	canvas.toDataURL('image/png')
	const link = document.createElement('a');
	link.download = 'solution.png';
	link.href = canvas.toDataURL();
	link.click();
	link.delete;
}

//closes popup by using apporpriate animations
function closePopup(){
	//clears user image so that if user closes popup, then uploads the same image,
	//oninput for file upload is still triggered and popup still opens
	//popup has to be opened on input so that the user closes the dialogue box before 
	//the animation starts
	document.getElementById("userimage").value=null;
	document.getElementById("print").style.animation="fadeMax .25s ease-in-out forwards";
	//clear start and endpoints
	startPoint=undefined;
	endPoint=undefined;
	//empty array of corners in solution
	try { window.solvedCorners.length=0;} catch{console.log("closing popup without any start points");}

	document.getElementById("popup").style.animation = "transitionOut 1.25s ease-in-out forwards";
	document.getElementById("grey").style.animation = "fadeOut 1s ease-in-out forwards";
	//wait until animation finishes, then clear grey div so user can click through it on the main screen
	setTimeout(function(){
		document.getElementById("grey").style.display = "none";
		//when user closes popup, set the text to say enter startpoint because thats what the user will have to
		//do when they open the popup again
		document.getElementById("instruction").textContent="Enter a start point";
		//set opacity of warning message to 0
		document.getElementById("error").style.animation=null;
		document.getElementById("error").style.opacity="0";
		//reset the visibility of buttons
		document.getElementById("endpointbutton").style.display="none";
	}, 1250);

	//redisable continue buttons until user puts in start/end point
	document.getElementById("endpointbutton").disabled=true;
	document.getElementById("startpointbutton").disabled=true;
	document.getElementById("endpointbutton").style.animation="greyout .5s ease-in-out forwards";
	document.getElementById("startpointbutton").style.animation="greyout .5s ease-in-out forwards";
	//hide asking if the maze finished completely
	document.getElementById("yesno").style.animation = "fadeMaxOut .5s ease-in-out forwards"
	document.getElementById("yesno").style.display = "none";

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
	context.drawImage(userImage, 0, 0, window.maxX, window.maxY);
	//set margins around canvas, if they were set before canvas was drawn, bigger canvas makes the margins
	//dissapear
	document.getElementById("userCanvas").style.margin="40px auto 50px auto";
	

}



function drawtool(){
	window.borderentering = true;
	document.getElementById("yesno").style.display="none";
	document.getElementById("contbutton").style.display="block";
}

function getStartPoint(){
	//clear the canvas so the if statement doesnt check the red dot
	//if the chosen point is on a "wall", dont let user enter it
	context.drawImage(userImage, 0, 0, window.maxX, window.maxY);
		//redraw maze border since canvas has been cleared
		drawborder(border);
	if (checkWall(tempX,tempY) == "black"){
		document.getElementById("error").style.animation=("fadeMax 1s ease-in-out forwards");
		return;
	}
	//draw the dot back on the canvas
	context.fillRect(tempPoint[0]-3, tempPoint[1]-3, 5, 5);
	//set start point to the last user click
	window.startPoint = tempPoint;
	//change visibility of confirmation buttons
	document.getElementById("startpointbutton").style.display="none";
	document.getElementById("endpointbutton").style.display="inline";

	//make text say enter end point and grey out continue button
	document.getElementById("endpointbutton").style.animation="greyout .5s ease-in-out forwards";
	document.getElementById("instruction").style.animation="fadeOut .25s ease-in-out forwards";
	setTimeout(function(){
		document.getElementById("instruction").textContent="Enter an end point";
		document.getElementById("instruction").style.animation="fade .25s ease-in-out forwards";
	}, 250);


}

function checkWall(x,y){
	//get pixel data of input coord
	var pixelData = context.getImageData(x, y, 1,1).data; 
	//if pixel color is below certain threshold (dark)
	if (pixelData[0] < 130 && pixelData[1] < 130 && pixelData[2] < 130){
		var color = "black";
	//if pixel color is above threshold (light)
	} else if (pixelData[0] > 170 && pixelData[1] > 170 && pixelData[2] > 170){
		var color = "white";
	} else {
		var color = "unknown";
	}
	return color
}

function getEndPoint(){
	//clear the canvas so the if statement doesnt check the red dot
	//if the chosen point is on a "wall", dont let user enter it
	context.drawImage(userImage, 0, 0, window.maxX, window.maxY);
	//redraw maze border since canvas has been cleared
	drawborder(border);
	context.fillStyle ="#FF0000";
	if (checkWall(tempX,tempY) == "black"){
		context.fillRect(window.startPoint[0]-3, window.startPoint[1]-3, 5, 5);
			//if the error message is not already present, put it there
			if (document.getElementById("error").style.animation != "fadeMax 1s ease-in-out forwards"){
				document.getElementById("error").style.animation=("fadeMax 1s ease-in-out forwards");
			}
		return;
	}
	//draw the dots back on the canvas
	context.fillRect(tempPoint[0]-3, tempPoint[1]-3, 5, 5);
	context.fillStyle ="#0000FF";
	context.fillRect(window.startPoint[0]-3, window.startPoint[1]-3, 5, 5);
	//set end point to the last user click
	window.endPoint = tempPoint;
	//hide the button
	document.getElementById("endpointbutton").style.display="none";
	//after end point has been generated, let user click solve button
	//dont let the user click any more boxes since theyve entered all points already
	entering="no";
	//start loading animation
	load();
	//wait for loading animation to start before doing anything
	setTimeout(function(){
					getToWall();
				}, 1000);

}

window.border=[]

//code to see where user clicks on canvas
function getCursorPosition(canvas, event) {
	//translates location of event from event to coordinate
	//this is used to determine start and end point
	const rect = canvas.getBoundingClientRect();
	//when user creates a start/end point, allow them to click continue button
	if (window.borderentering !== true){
		document.getElementById("endpointbutton").style.animation="greenout .5s ease-in-out forwards";
		document.getElementById("startpointbutton").style.animation="greenout .5s ease-in-out forwards";
		document.getElementById("endpointbutton").disabled=false;
		document.getElementById("startpointbutton").disabled=false;
	}

	window.tempX = event.clientX - rect.left;
	window.tempY = event.clientY - rect.top;
	//only draw boxes if entering = True
	if (entering==true){
		//clear canvas and draw box on pixel user clicked
		context.drawImage(userImage, 0 ,0,  window.maxX, window.maxY);
		context.fillStyle = "#0000FF";
		//if the user has already entered a startpoint, they are now entering endpoint, so color should be red
		if (typeof window.startPoint !== "undefined"){
				context.fillStyle ="#FF0000";
		}
		context.fillRect(tempX-3, tempY-3, 5, 5);
		//since canvas was cleared to remove the old box that wasn't submitted,
		//if they exist, redraw start/endpoints
		if (typeof window.startPoint !== "undefined"){
				context.fillStyle ="#0000FF";
			context.fillRect(startPoint[0]-3, startPoint[1]-3, 5, 5);
		}
		if (typeof window.endPoint !== "undefined"){
			context.fillStyle ="#FF0000";
			context.fillRect(endPoint[0]-3, endPoint[1]-3, 5, 5);
		}
		//if there is a maze border
		if (window.border !== []){
				//redraw maze border since canvas has been cleared
				drawborder(border);
		}
	}
	//variable needs to be accessible by other functions, bundling as array
	window.tempPoint = [tempX,tempY];
	console.log("user: "+tempPoint);


	if (window.borderentering==true){
		//append new point to list, so that they can be redrawn after canvas resets
		window.border.push(tempPoint);
		drawborder(border);
	}
}

//listens for user click on canvas
const canvas = document.querySelector('canvas') 
//when mouse click happens, run the cursor position function at event e
canvas.addEventListener('mousedown', function(e) {
	getCursorPosition(canvas, e);
})

//clear the canvas, remove the last two points (each end of one line), and then redraw the remaining lines
function undoborder(){
	context.drawImage(userImage, 0 ,0,  window.maxX, window.maxY);
	//if there is an odd amount of things, do the stuff, otherwise you need to remove two
	if (window.border.length%2==0){
		window.border.splice(window.border.length - 2, 2);
	}
	else{
		window.border.splice(window.border.length - 1, 1);
	}
	drawborder(window.border);

}

//toggle online help for border tool
function togglepopup(){
	if (document.getElementById("btooltip").style.animation=="0.5s ease-in-out 0s 1 normal forwards running fadeMax"){
		document.getElementById("btooltip").style.animation="fadeOutMax .5s ease-in-out forwards";
	}
	else {
		document.getElementById("btooltip").style.animation="fadeMax .5s ease-in-out forwards";
	}
}

//toggle the users ability to draw a border
function borderToolToggle(){
	if (window.borderentering == false){
		window.borderentering = true;
		window.entering = false;
		//toggle button colors
		document.getElementById("btoggle").style.animation="greenout .5s ease-in-out forwards";
		document.getElementById("bundo").style.animation="greenout .5s ease-in-out forwards";
	}
	else{
		window.borderentering = false;
		window.entering = true; 
		//toggle button colors
		document.getElementById("btoggle").style.animation="greyout .5s ease-in-out forwards";
		document.getElementById("bundo").style.animation="greyout .5s ease-in-out forwards";
	}
}
//draws all points in list of points, so the border can be redraw once the cavnas is reset
//also draws lines as user clicks during the drawborder function, as this is run onclick in the getCursor position function
function drawborder(points){
	for (x in points){
		if (typeof lastPoint!=="undefined"){
			//draw between every two clicks
			if (x%2!==0){
				context.beginPath();
				context.strokeStyle = "#000000";
				context.lineWidth = 3;
				context.moveTo(lastPoint[0], lastPoint[1]);
				console.log([lastPoint[0], lastPoint[1]] + " to " + [points[x][0], points[x][1]]);
				context.lineTo(points[x][0], points[x][1]);
				context.stroke();
			}
		}
		lastPoint=points[x];
	}
	//when the function ends, the last point should no longer exist, as when it is run again, lastpoint should = the first point
	//not the last point of the last line
	lastPoint="undefined";
}

function bordertoolprompt(){
	

	//bring user back to entering startpoints (and reset required variables)
	try{window.solvedCorners.length=0;}catch{console.log("spinning up");}
	startPoint=undefined;
	endPoint=undefined;
	context.drawImage(userImage, 0, 0,  window.maxX, window.maxY);

	//make text say use the border tool
	document.getElementById("yesno").style.animation="fadeOut .25s ease-in-out forwards";
	document.getElementById("instruction").style.animation="fadeOut .25s ease-in-out forwards";

	document.getElementById("startpointbutton").disabled=false;
	document.getElementById("startpointbutton").style.display="block";
	document.getElementById("startpointbutton").style.filter="grayscale(100%);";
	document.getElementById("startpointbutton").style.animation="fadeMax .5s ease-in-out forwards";


	setTimeout(function(){
		document.getElementById("instruction").textContent="Use the border tool";
		document.getElementById("instruction").style.animation="fade .25s ease-in-out forwards";
	}, 250);
	document.getElementById("yesno").style.display="none";document.getElementById("yesno").style.display="none";
	borderToolToggle();
	togglepopup();



}


//moves finder pixel forward in its direction
function move(){
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

	
	//whenever this function is run, add the corner it turned to a list of corners in the solution
	//(for route optimisation)

	//initial statements involving pushing corners are padding x,y outwards in order to make the line easier to see

	//set the distance displaced from the corner to some scaling based off the size of the image.
	var x=canvas.width/60;
	//if the finder pixel is turning left (there is no wall ahead), move forward
	//if the finder pixel is turning right (there is a wall ahead), move backwards
	//in order to get away from the wall
	if (bearing=="left"){
		y=x;
	} else {
		y=-x;
	}
	//move away from the wall based off direction of finder pixel
	switch(window.direction){
		case 0: corners.push([window.posX+x,window.posY-y]); break;
		case 90: corners.push([window.posX+y,window.posY+x]); break;
		case 180: corners.push([window.posX-x,window.posY+y]); break;
		case 270: corners.push([window.posX-y,window.posY-x]); break;
	}
	window.solvedCorners = corners;

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
}


//checks pixel either ahead or to left depending on reference input based on pixel direction
function facing(reference){
	//return value of pixel ahead of current position depending on current rotation
	//(relative "ahead" pixel changes when finder pixel turns: if pixel turns to left
	//then instead of the ahead pixel being above, it is now to the left of the pixel)
	if (reference == "forward"){
		switch(window.direction){
			case 0: return checkWall(window.posX,window.posY-1); break;
			case 90: return checkWall(window.posX+1,window.posY); break;
			case 180: return checkWall(window.posX,window.posY+1); break;
			case 270: return checkWall(window.posX-1,window.posY); break;
		}
	} 
	//same thing as above, but for the left instead of ahead
	if (reference == "left") {
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
	//clear the maze so red dots dont get in the way
	context.drawImage(userImage, 0, 0,  window.maxX, window.maxY);
	//redraw maze border since canvas has been cleared
		drawborder(border);
	//set finder pixel to starting point/direction
	window.posX = window.startPoint[0];
	window.posY = window.startPoint[1];
	//turn left to go to left wall
	window.direction=270;
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
		if (line[item][0] <130 && line[item][1] <130 && line[item][2] <130){
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

	var errorcounter=0;
	console.log(window.solvedCorners);
	//for each row of corners in solution do:
	while (index < window.solvedCorners.length-1){
		console.log(index + " out of " + window.solvedCorners.length);

		//each time the while loop runs, add 1 to errorcounter
		//whenever a corner is found, errorcounter is set to 0
		//if a corner isnt found, errorcounter will exceed 1
		errorcounter++;

		//for each solution after the one being used in loop above
		for (x=index+1; x<window.solvedCorners.length;x++){

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

				//if the program finds a corner, set errorcounter to 0
				errorcounter=0;

			}

		}
		//draw line between top corner and nested loop corner
		context.beginPath();
		context.strokeStyle = "#231bbf";
		context.lineWidth = 2;
		//draw from top loop corner
		context.moveTo(window.solvedCorners[index][0], window.solvedCorners[index][1]);
		//to nested loop corner
		console.log([solvedCorners[index], "to", corner]);
		context.lineTo(corner[0], corner[1]);
		context.stroke();
		//set index of top loop to last drawn corner
		index = window.newIndex;
		//redraw start and endpoints on top of line
		context.fillStyle = "#FF0000";
		//once whole process is over, redraw start and endpoint dots as they are removed to
		//process the maze
		context.fillRect(endPoint[0]-3, endPoint[1]-3, 5, 5);
			context.fillStyle ="#0000FF";
		context.fillRect(startPoint[0]-3, startPoint[1]-3, 5, 5);

		lastcorner = corner


		//if errorcounter >1 ie. while loop has run twice without a solution being found in the for loop
		//give error message 
		if (errorcounter>1){
			window.alert("sorry, something went wrong, please try again. Try to make sure the image isn't blurry and that the whole maze is in frame");
			break;
			break;
			break;
		}
	}

	//draw from last corner to endpoint
	context.beginPath();
	context.strokeStyle = "#231bbf";
	context.lineWidth = 2;
	context.moveTo(corner[0], corner[1]);

	context.lineTo(window.endPoint[0], window.endPoint[1]);
	context.stroke();
	


}

function load() {
	document.getElementById("load").style.display = "block";
	document.getElementById("load").style.animation = "fade 1s ease-in-out forwards";
	document.getElementById("loadGrey").style.display = "block";
	document.getElementById("loadGrey").style.animation = "fade 1s ease-in-out forwards";
}


function stopLoad(){
	document.getElementById("load").style.animation = "fadeOut 1s ease-in-out forwards";
	document.getElementById("loadGrey").style.animation = "fadeOut 1s ease-in-out forwards";
}

//main maze solving algorithm
function solveMaze (x,y){
	context.fillStyle = "#6f42f5";
	var i =1;
	var finished ="no";
	turn("right");

	//loop solve maze algorithm until finder pixel is at the endpoint
	while (finished!=="yes") {
		i++;
		//if pixel to left is white, turn left and move forward
		if (facing("left") == "white"){
			turn("left");
			move();

		//if pixel ahead is black, turn right, but dont moce forward because right pixel hasnt been checked
		} else if (facing("forward") == "black"){
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

				console.log("solution found! optimising path");
				//set flag to end loop
				finished = "yes";
				//optimise solution route
				window.corners.push([window.posX, window.posY]);
				checkCorners();
				//tell user maze is done and ask if the maze was solved correctly
				document.getElementById("instruction").style.animation="fadeOut .25s ease-in-out forwards";
				document.getElementById("yesno").style.animation = "fadeMax .5s ease-in-out forwards";
				document.getElementById("yesno").style.display = "block";
				document.getElementById("print").style.animation="fadeMax .25s ease-in-out forwards";
				setTimeout(function(){
					document.getElementById("instruction").textContent="Solved!"
					document.getElementById("instruction").style.animation="fade .25s ease-in-out forwards";
				}, 250);
				//fadeout error message
				if (document.getElementById("error").style.animation != '1s ease-in-out 0s 1 normal forwards running fadeMax'){
					document.getElementById("error").style.animation=("fadeOut 1s ease-in-out forwards");
				}
				//after maze is solved, reset start/endpoint so program can be run again
				startPoint=undefined;
				endPoint=undefined;
				//stop loading animation
				stopLoad();
			}
		}
	}

}