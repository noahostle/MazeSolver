//the easiest way to make the tutorial is to create seperate functions for each box
//I could set up a listener and several breakpoints to allow the user to progress through the tutorial
//but it wouldn't make any difference to the user and would take longer to develope
//this code isn't as pretty looking, but it is simpler, easier to make and gets the job done.


//i seperated all tutorial functions into a seperate file to not clutter the mainline of my script.js file.
//a single text box is being moved around and animated (the text changes too), and when it is clicked it changes its click
//value to the next function and does all of its animation stuff.
const tut = document.getElementById("tuttext");

//takes text to replace, and new position of the box, and fades out box, waits till animation is done, replaces
//text, and moves the position, then fades the box back in.
function transition(width,text,top,left){
	tut.style.animation="fadeOut .25s ease-in-out forwards";

	setTimeout(function(){
		tut.innerHTML=text;
		if (width!=="no"){ tut.style.width=width; }
		tut.style.top=top;
		tut.style.left=left;
		tut.style.animation="fadeMax .25s ease-in-out forwards";
	}, 250);
}


function tutorial(){
	tut.textContent="Maze solver allows you to upload an image of a maze, or take one with your camera, and show you the solution on your device. Some mazes may not work if they are brightly coloured or have high contrast patterns in the background, greyscale mazes work the best. (Click to continue)";
	tut.style.animation="fadeMax .25s ease-in-out forwards";
	tut.style.top="60px";
	tut.style.left="700px";
	tut.onclick=function(){ stepone(); };
}

function stepone(){
	transition("no","Step 1. Uploading your maze. <br><br> Click the “+” button to upload an image of a maze. If you are on a device with a camera, you will be prompted to either select an image to upload, or take a photo with your camera. The maze you upload must be an image, in either png or jpeg format. Your image should be displayed in a new window.","30px","300px");
	//the step two transition will automatically happen when the user clicks the plus button
	tut.onclick="";
}

function steptwo(){
	transition("350px","Step 2. (optional) border drawing <br><br> If your maze has an open entrance or exit, the software may try to escape your maze, go around the outside and then straight to the exit without solving it. To stop this from happening, draw a border to seal of the entrances before solving. The border tool lives to the right of your maze, and is on when the emoji has color, and off when it is grey. Click one to start drawing a line, then again to finish it. There is also an undo button to the right of the border tool.","150px","30px");
	tut.onclick=function(){ stepthree(); };
}

function stepthree(){
	transition("no","Step 3. Entering your points <br><br> The first point you will have to enter is the start point. Click on the image at the entrance to the maze, and a blue dot should appear wherever you click. This is your start point and you can move it around as much as youd want before continuing. Repeat this process with the red end point dot, and then click the green tick to begin solving the maze. Solving can take a couple of seconds for mid sized ranges and if you have a really complex image, up to a minute.","150px","30px");
	tut.onclick="";
}

function stepfour(){
	transition("no","Step 4. Exporting the maze <br> <br> If you wish to download the image of your maze with the solution drawn onto it, wait until your maze has finished solving, and select the share button located to the right of the image. This will automatically download solution as a png image file.","310px","900px");
	document.getElementById("closepopup").style.opacity="0%";
	tut.onclick=function() { stepfive(); };
}

function stepfive(){
	document.getElementById("closepopup").style.opacity="100%";
	closePopup();
	var x = "100px";
	var y = "455px";

	setTimeout(function(){
		transition("500px","Step 5. Handling errors<br><br>Because of the way Maze solver has to handle and process images, the software may encounter an error while it is running. This can be due to a number of reasons, including but not limited to: <br> <br> Your maze is not solvable, make sure the edges of the maze aren’t cropped off. It is also possible that your maze might be unconventional. For a maze to be solvable by algorithm, all walls inside the maze must connect to the wall. Some mazes with islands, or perhaps even joke mazes may not be solvable by the computer. If all other issues are not present in your image, this might be the cause. <br> Your image is too large. Because we need to limit the size of images your image might be getting scaled down and become blurry. <br> Your image is blurry. This could cause the walls of the maze to not be read by the software as solid, and it will draw through them. <br><br>Whenever you encounter any of these issues, it is recommended that you try to resolve them by recropping or retaking the image. If issues persist, it may be Maze Solvers fault, if this is the case, please make a bug complaint at https://github.com/noaho1411/MazeSolver.",x,y);
	});

	tut.onclick=function() { endtut(); };

}

function endtut(){
	tut.style.animation="FadeOut .25s ease-in-out forwards";
}







