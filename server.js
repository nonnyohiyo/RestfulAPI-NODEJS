/*
Restful API 

coding by Piyaporn Saykaew
30 AUG 2016
*/
var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require("body-parser");
var connection = mysql.createConnection({
	host	: 'localhost',
	user	: 'root',
	password: 'qwertyui',
	database: 'task'
});

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


connection.connect();
var port = 2016;

function handleResponse(res, status, message, code){
	res.status(code || 201).json({"error": status, "message": message});
}

app.get('/', function(req, res){ // all items
	connection.query('SELECT * from tasks', function(err, rows, fields){
		if(err){
			handleResponse(res, true, "Error! cannot select data please check database");
		}else{
			// console.log(rows);
			res.status(201).json(rows);
		}
	});
});

app.get('/task/:id', function(req, res){ // single task
	connection.query('SELECT * from tasks where idtasks = ? limit 1', [req.params.id], function(err, rows, fields){
		if(err){
			handleResponse(res, true, "Error! cannot select data please check database");
		}else{
			if(rows.length == 0){
				handleResponse(res, false, "Sorry no data record", 201);
			}else{
				res.status(201).json(rows[0]);
			}
		}
	});
});

app.post('/task', function(req, res){ // new task
	connection.query('INSERT INTO tasks (subject, description, status, createdate, updatedate) VALUES (?, ?, 0, now(), null)', [req.body.subject, req.body.description], function(err, result){
		if(err){
			handleResponse(res, true, "Error! cannot insert data please check your information.");
		}else{
			connection.query('SELECT * FROM tasks where idtasks = ?', [result.insertId], function(err, rows, fields){
				if(err){
					handleResponse(res, true, "Error! cannot select data please check database");
				}else{
					if(rows.length == 1){
						res.status(201).json(rows[0]);
					}else{
						handleResponse(res, false, "Something went wrong, no data record", 201);
					}
				}
			});
		}
	});
});

app.put('/task/:id', function(req, res){ // edit task
	connection.query('UPDATE tasks set subject = ?, description = ?, updatedate = now() where idtasks = ?', [req.body.subject, req.body.description, req.params.id], function(err, result){
		if(err){
			handleResponse(res, true, "Error! cannot update data please check your information.");
		}else{
			connection.query('SELECT * FROM tasks where idtasks = ?', [req.params.id], function(err, rows, fields){
				if(err){
					handleResponse(res, true, "Error! cannot select data please check database");
				}else{
					if(rows.length == 1){
						res.status(201).json(rows[0]);
					}else{
						handleResponse(res, false, "Something went wrong, no data record", 201);
					}
				}
			});
		}
	});
});


app.put('/task/:id/:status', function(req, res){
	connection.query('UPDATE tasks set status = ? where idtasks = ?', [req.params.status, req.params.id], function(err, result){
		if(err){
			handleResponse(res, err.message, "Error! cannot update status please check your information.");
		}else{
			connection.query('SELECT * FROM tasks where idtasks = ?', [req.params.id], function(err, rows, fields){
				if(err){
					handleResponse(res, true, "Error! cannot select data please check database");
				}else{
					if(rows.length == 1){
						res.status(201).json(rows[0]);
					}else{
						handleResponse(res, false, "Something went wrong, no data record", 201);
					}
				}
			});
		}
	});
});

app.delete('/task/:id', function(req, res){ // delete task
	connection.query('DELETE FROM tasks WHERE idtasks= ?', [req.params.id], function(err, result){
		if(err){
			handleResponse(res, true, "Error! cannot delete data please check database");
		}else{
			handleResponse(res, false, "Data has been deleted", 201);
		}
	});

});


app.listen(port, function(){
	console.log('Application starting at port' + port);
});