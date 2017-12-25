

MAX_WIDTH = 50;
MAX_HEIGHT = 50;
var app  = angular.module("GameOfLifeApp",[])
app.controller("GameOfLifeController",["$scope","$interval",GameOfLifeController]);
function GameOfLifeController($scope,$interval){

	$scope.init = function(){
	   $scope.c = document.getElementById("GamePanel");
	   $scope.ctx = $scope.c.getContext("2d");
	   $scope.reset();
	}

	$scope.drawGrid = function(){
		$scope.ctx.fillStyle = "#00FF00";
		for(var x = 0;x<=MAX_WIDTH;x++){
			$scope.ctx.beginPath();
			$scope.ctx.moveTo(x*10, 0);
			$scope.ctx.lineTo(x*10,10*MAX_HEIGHT);
			$scope.ctx.stroke();
		}
		for(var y = 0;y<=MAX_HEIGHT;y++){
			$scope.ctx.beginPath();
			$scope.ctx.moveTo(0,y*10);
			$scope.ctx.lineTo(10*MAX_HEIGHT,y*10);
			$scope.ctx.stroke();	
		}
	}

	$scope.reset = function(){
	   $scope.oldcells = new Array();
	   $scope.cells = new Array();
	   for(var x=0;x<50;x++){
	      $scope.oldcells[x] = new Array();
	      $scope.cells[x] = new Array();
	      for(var y=0;y<50;y++){
	      	$scope.oldcells[x][y] = false;
	      	$scope.cells[x][y] = false;
	      }
	   }

	   $scope.drawCanvas();
	}

	$scope.addNewLife = function(event){
 		var rect = $scope.c.getBoundingClientRect();
		var x = Math.round(((event.clientX-10-rect.left)/10));
		var y = Math.round(((event.clientY-10-rect.top)/10));
		if($scope.cells[x][y]==false){
			$scope.oldcells[x][y] = true;
			$scope.cells[x][y]=true;
		}else{
			$scope.oldcells[x][y] = false;
			$scope.cells[x][y]=false;
		}
		$scope.drawCanvas();
	}

	$scope.drawLife = function(x,y){
		if($scope.cells[x][y]==true){
			$scope.ctx.fillStyle = "#FFFF00";
			$scope.ctx.fillRect(x*10,y*10,10,10);
		}
		else{
			$scope.ctx.fillStyle = "#FFFFFF";
			$scope.ctx.fillRect(x*10,y*10,10,10);
		}
	}

	$scope.drawCanvas = function(){
		for(var x=0;x<$scope.cells.length;x++){
			for(var y=0;y<$scope.cells[x].length;y++){
				$scope.drawLife(x,y);
			}
		}
		$scope.drawGrid();
	}

	$scope.play = function(){
		for(var i=0;i<$scope.cells.length;i++){
			$scope.oldcells[i] = $scope.cells[i].slice();
		}
		for(var x = 0; x < $scope.cells.length; x++){
			for(var y = 0; y < $scope.cells[x].length; y++){
				$scope.cells[x][y] = false;
				if($scope.isAlive(x,y)){
					$scope.cells[x][y] = true;
				}
			}
		}
		$scope.drawCanvas();
		if($scope.cells.length==0){
			$scope.stop();
		}
	}

	$scope.start =  function(){
		$scope.loop = $interval($scope.play,400);
	}

	$scope.isAlive = function(x,y){
		var minX = x==0?0:x-1;
		var maxX = x==MAX_WIDTH-1?x:x+1;
		var minY = y==0?0:y-1;
		var maxY = y==MAX_HEIGHT-1?y:y+1;;
		var neighbors = 0;
		for(var i=minX;i<=maxX;i++){
			for(var j=minY;j<=maxY;j++){
			
				if((!(x==i&&j==y))&&$scope.oldcells[i][j]==true){
					neighbors++;
				}
			}
		}
		if(($scope.oldcells[x][y]==true&&(neighbors>1&&neighbors<4))
		  ||($scope.oldcells[x][y]==false&&neighbors==3)){
		  	return true;
		}
		return false;
	}

	$scope.stop = function(){
		$interval.cancel($scope.loop);
	}

}
