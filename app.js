const express=require('express');
const bodyParser=require('body-parser');
const mysql=require('mysql');
const handlebars=require('express-handlebars');
const app=express();

// Config padrão bodyParser
const urlencodeParser=bodyParser.urlencoded({extended:false});

// Config Banco de Dados (conexão com o banco de dados)
const sql=mysql.createPool({
	user: 'b3895615445291',
	password: '2ffe8300',
	host: 'us-cdbr-east-02.cleardb.com',
	database: 'heroku_6e83a5aeeaaead2?reconnect'
});
// Codigo necessário antes de colocar bd online(heroku):
//sql.query("use crud"); // Aqui estou dizendo para o MySQL que quero usar o banco de dados crud (criado no terminal MySQL)

let port=process.env.PORT || 3000;

// Link para importar os arquivos externos JS e CSS. 
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/img', express.static('img'));

// Config Template engine
app.engine("handlebars",  handlebars({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

// Routes and Templates
app.get("/",function(req,res){
	//res.send("Essa é minha pagina!");
	//res.sendFile(__dirname+"/index.html");
	//console.log(req.params.id);
	res.send('index');
});

// Route insert
app.get("/insert", function(req,res){
	res.render("insert");
});
app.post("/controllerForm", urlencodeParser, function(req,res){
	sql.query("insert into user values (?,?,?)",[req.body.id, req.body.name, req.body.age])
	res.render('controllerForm', {name:req.body.name});
});

// Route Select
app.get("/select/:id?", function(req,res){
	if(!req.params.id){
		sql.getConnection(function(err, connection){
			connection.query("select * from user order by id asc", function(err,results,fields){
				res.render('select',{data:results});
			});
		});	
	}else{
		sql.getConnection(function(err, connection){
			sql.query("select * from user where id=? order by id asc",[req.params.id], function(err,results,fields){
				res.render('select',{data:results});
		  });	
		});
	}
});

// Route Update
app.get("/update/:id", function(req,res){
	sql.query("select * from user where id=?",[req.params.id], function(err,results,fields){
		res.render('update',{id:req.params.id, name:results[0].name, age:results[0].age});
	});
	
	app.post("/controllerUpdate", urlencodeParser, function(req,res){
		sql.query("update user set name=?,age=? where id=?",[req.body.name, req.body.age, req.body.id]);
		res.render('controllerUpdate', {name:req.body.name});
	});
});

// Route Delete
app.get("/delete/:id", function(req,res){
	sql.query("delete from user where id=?",[req.params.id]);
	res.render('delete');
});

// Start server
app.listen(port, function(req, res){
  console.log('Servidor esta rodando!');
});