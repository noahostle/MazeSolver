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
	tut.innerHTML="Step 1. <br> <br> Click the '+' button to upload an image.";
	tut.style.animation="fadeMax .25s ease-in-out forwards";
	tut.style.top="60px";
	tut.style.left="700px";
	tut.onclick="";
}

function steptwo(){
	transition("350px","Step 2. (optional) border drawing <br><br> If the software tries to go around the outside of your maze, you might need to use the border tool to close the entrance and exits of your maze. Click the pencil icon to start drawing, and click it again once you are done. <br> (Click to continue)","150px","30px");
	tut.onclick=function(){ stepthree(); };
}

function stepthree(){
	transition("no","Step 3. Entering your points <br><br> Enter your startpoint by clicking the entrance of your maze, and then click the green tick button. Then set the endpoint and click the green tick to solve the maze.","150px","30px");
	tut.onclick="";
}

function stepfour(){
	transition("no","Step 4. Exporting the maze <br> <br> Click the export button to download a png of your maze with the solution included.","310px","900px");
	tut.onclick=function() { endtut(); };
}

function endtut(){
	tut.style.animation="FadeOut .25s ease-in-out forwards";
}







