
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var users = require('./db/users.json');

var app = express();

var user_name; // имя текущего пользователя

app.set('port',3000);

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'template'));
app.set('view engine', 'ejs');

//Обработака favicon.ico
//app.use(express.favicon());


app.get('/',function(req, res, next) {
	res.render("index", {
		title: 'foreigner'

	});
})

// Обработака get запроса
app.get('/sign',function(req, res, next) {
	
	user_name = req.url.split("=")[1];
	
	if (users[user_name]) {
		res.render("user", {
			title: user_name

		});
	} else {
		res.render("error");
	}
	
})

//Обработка post запроса
app.post('/sign',function(req, res, next) {
	
	var result = "";
	user_name = req.body['login'];

	if (users[user_name]) {
		
		for (var i in users[user_name]) {
			result+=i + ": " + users[user_name][i] + "\n";
		}

		if (user_name == "User1") {

			res.render("user", {
			title: user_name, // имя пользователя в ситсеме(слева сверху)
			objects: result, // Вывод доступных пользователю объектов
			administrate: '<button class="btn btn-primary btn-lg" data-toggle="modal" data-target="#administrate">Администрирование</button>', // Администрирование пользователей(назначение новых прав пользователям)
			users: users,
			user_name: user_name	
		});

		} else {
			res.render("user", {
			title: user_name, // имя пользователя в ситсеме(слева сверху)
			objects: result, // Вывод доступных пользователю объектов
			administrate: '<button class="btn btn-primary btn-lg" data-toggle="modal" data-target="#administrate">Администрирование</button>', // Администрирование пользователей(назначение новых прав пользователям)
			users: users,
			user_name: user_name
		});

		}

	} else {
		res.render("error");
	}
})

app.post('/changeproperty',function(req, res, next) {
	var read = false;
	var write = false;
	var change = false;
	var result = ""; // Содержит новые права доступа
	var name = req.body['login']; // Имя пользователя для которого меняются права доступа
	var obj = req.body['object']; // Имя объекта для которого меняются права доступа
 
	if (req.body['read']) {read = true;};
	if (req.body['write']) {write = true;};
	if (req.body['change']) {change = true;};

	if (name == "User1") {

		res.render("res", {
			color: "background-color:red",
			answer: "Вы не имеете полномочий изменять права админестратора"
		})
	} else if (users[name]) {
		if ((users[user_name][obj].indexOf("Полный доступ") != -1) || (users[user_name][obj].indexOf("Передача прав") != -1)) {
			if (read) result+="Чтение ";
			if (write) result+="Запись ";
			if (change) result+="Передача прав ";
			users[name][obj]=result;
			res.render("res", {
				color: "background-color:green",
				answer: "Права доступа " + user_name + " к объекту " + obj + " успешно изменены"
				
			})
		} else {
			res.render("res", {
				color: "background-color:red",
				answer: "Вы не имеете достаточно полномочий, чтобы изменить доступ " + user_name + " к объекту " + obj	
			})
		}
	} else {
		res.render("res", {
			color: "background-color:red",
			answer: "Указанного пользователя не существует в системе"
		});
	}
})


app.post('/actions',function(req, res, next) {

	var result = ""; // Содержит новые права доступа
	var obj = req.body['object']; //Имя объекта над которым необходимо выполнить действия 
	var action = req.body['options'];
	var allow_action;

	// Назначение выбранного действия
	switch(action) {
		case "read":
			action = "Чтение";
			break;
		case "write":
			action = "Запись"

	}

	if (users[user_name][obj].indexOf(action) != -1) {
		allow_action = true;
	} else {
		allow_action = false;
	}

	if (allow_action) {
		res.render("res", {
			color: "background-color:green",
			answer: "Вы успешно выполнили действие"
		})
	} else {
		res.render("res", {
			color: "background-color:red",
			answer: "Вы не имеет прав доступа на выбранное действие"
		})
	}
	
})


app.use(express.static(path.join(__dirname, 'public')));


http.createServer(app).listen(3000, function(){
  console.log('Express server listening on port 3000');
});
