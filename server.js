/** 
 *  import all modules
 * 
 *  @ core node modules
 * **/

 var express = require('express');
 var http = require('http');
 var mysql = require('mysql');
 var app = express();
 var bodyParser = require('body-parser');

 /**
  * Parse all from data
  */

  app.use(bodyParser.urlencoded({extended:true}));

  /**
   *  @ Used for formating dates
   */

   var dateFormat = require('dateformat');
   var moment = require('moment');
   var now = new Date();

   /**
    * 
    * This is new engine 
    * Templating
    * Template parsing
    * Here Using EJS types
    * 
    */
app.set('view engine','ejs');

/**
 *   Import all related Javascript and CSS files to inject in this App
 */

 app.use('/js',express.static(__dirname + '/node_modules/bootstrap/dist/js'));
 app.use('/js',express.static(__dirname + '/node_modules/tether/dist/js'));
 app.use('/js',express.static(__dirname + '/node_modules/jquery/dist'));
 app.use('/css',express.static(__dirname + '/node_modules/bootstrap/dist/css'));


 /**
  * 
  * Connect Mysql Database
  * 
  */

 const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'articles'
  })
  
  connection.connect()

/**
 * 
 * Global site Title and base url
 * 
 */

 const siteTitle = "ExpressJS CRUD App";
 const baseURL = "http://localhost:4000/";


 // Index page routing
 app.get('/',function(req,res){

  var queryStrin = 'SELECT * FROM e_events ORDER BY e_start_date DESC';
    connection.query(queryStrin,function(err,result){
      res.render('pages/index',{
        siteTitle:siteTitle,
        pageTitle:"Event list",
        items:result,
        moment:moment
    });
  });
  
 });

// event add page 
 app.get('/event/add',function(req,res){
    res.render('pages/add_event',{
      siteTitle:siteTitle,
      pageTitle:"Event Add",
      items:'',
      moment:moment
    });
 });

 //event add post method
 app.post('/event/add',function(req,res){

    response = {
      e_name        : req.body.e_name, 
      e_start_date  : dateFormat(req.body.e_start_date,'yyyy-mm-dd'), 
      e_end_date    : dateFormat(req.body.e_end_date,'yyyy-mm-dd'),
      e_desc        : req.body.e_desc
    };

    connection.query('INSERT INTO e_events SET ?',[response], function(err, result){
      if(!err) {
        // console.log(result);
        res.redirect(baseURL);
      }
      else{
      throw err;
      }
  });   
});


// Event edit page

app.get('/event/edit/:id',function(req,res){
  connection.query("SELECT * FROM e_events WHERE e_id = '"+ req.params.id +"'",function(err,result){
    result[0].e_start_date = dateFormat(result[0].e_start_date,'yyyy-mm-dd');
    result[0].e_end_date   = dateFormat(result[0].e_end_date,'yyyy-mm-dd');

    res.render('pages/edit-event',{
      siteTitle:siteTitle,
      pageTitle:"Editing Event :"+ result[0].e_name,
      item:result,
      moment:moment
  });

  });
});

app.post('/event/edit/:id',function(req,res){
  
  var now_time = dateFormat(now,'yyyy-mm-dd');

  var query = "UPDATE `e_events` SET `e_name` = '" + req.body.e_name + "', `e_desc` = '" + req.body.e_desc + "', `e_start_date` = '" + req.body.e_start_date + "', `e_end_date` = '" + req.body.e_end_date + "',`e_date_modified` = '" + now_time + "' WHERE `e_events`.`e_id` = '" + req.body.e_id + "'";
  connection.query(query,function(err,result){
      if(!err){
        res.redirect(baseURL);
      }else{
        console.log(err);
      }
  });

});


// Delete Events

app.get('/event/delete/:id',function(req,res){
  connection.query("DELETE FROM e_events WHERE e_id = '"+ req.params.id +"'",function(err,result){
    if(!err){
       res.redirect(baseURL);
    }else{
      console.log(err);
    }
  });
});

 /**
  * 
  * connect to the server
  * 
  */

  var server = app.listen(4000,function(res,req){
    console.log('Server Started at http://localhost:4000/');
  });