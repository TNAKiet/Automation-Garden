PORT=2323;
var express = require("express");
var fs=require('fs');
var url=require("url");
var querystring=require('querystring');
var app = express();
var database=[];
ip=require("ip");
app.use(express.static("./public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);// goi thu vien socket io 
server.listen(PORT);
console.log("Server nodejs chay tai dia chi: "+ip.address()+":"+PORT);

io.on("connection", function(socket){
	
  console.log("Co nguoi ket noi:" +socket.id);
	
  socket.on("disconnect", function(){
    	console.log(socket.id + " ngat ket noi!!!!!");
  	});
	socket.on("auto", function(data){
		console.log(data);	
	});
		
		
		socket.on("byhand", function(data){
		console.log(data);
		});
		socket.on("BatDen", function(data){
			console.log(data);
			socket.broadcast.emit("BatDen", data);
		});
		socket.on("BatQuat", function(data){
			console.log(data);
			socket.broadcast.emit("BatQuat", data);
		});
		socket.on("NodeMCU_send_data", function(data){
			const string =JSON.stringify(data);
			const obj = JSON.parse(string);
			console.log(string);
			var ThongSo={
			"NhietDo":obj.NhietDo,
			"DoAm":obj.DoAm,
			"time": new Date()
			};
			database.push(ThongSo);
			socket.broadcast.emit("Server_send_data",ThongSo);
			});
	
	
	
});

app.get("/", function(req, res){
 res.render("trangchu");
});