const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
var db = require('./db/db.json');
var fs = require('fs');
const bodyParser = require('body-parser');

app.use(express.static('public'))
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//{title: "test2", text: "note2"}


router.delete('/api/notes/:id',function(req,res){
  var id = parseInt(req.params.id);  
  
  fs.readFile('./db/db.json', 'utf8', function (err, data) {
   if (err) {
       console.log(err)
   } else {
        const file = JSON.parse(data);
        const items = file.items;
        
        if(items.length > 0){
                
            var index = items.findIndex(obj => {
                return  obj.id == id
            });
            //var index = index_ + 1;
            console.log('index: ',index);
            if (index > -1) {
                items.splice(index, 1);
            }
            console.log('items',items);
            const stringData = JSON.stringify(file);
            console.log('stringData: ',stringData);
            //res.json(stringData);

            fs.writeFile('./db/db.json', stringData, 'utf8', function(err){
                if(err){ 
                    console.log(err); 
                } else {
                    //Everything went OK!
                    res.end();
                    console.log('file ',file);
                }
            });

        }
        
   }

  });
  
  /*
  console.log('id',id + 'db',db.length);
  if(db.length > 0){
      
    var index = db.findIndex(obj => {
        return JSON.parse( obj.id) == id
    })
    console.log('index',index);
    db.splice(0, index);
  }
  console.log('db',db);
  res.end();
*/
  res.end();
});

router.post('/api/notes',function(req,res){
  //check array length
    /*
  var myData = req.body;
  if(db.length - 1 >= 0){
    var id = db.length;
    myData["id"] = id;
    
    console.log('new id',db.length);
    console.log('data: ',myData);
    }
  */
  fs.readFile('./db/db.json', 'utf8', function (err, data) {
   if (err) {
       console.log(err)
   } else {
       
       var ok = false;
       const file = JSON.parse(data);
       console.log('file: ',file.items.length);
       
       var myData = req.body;
       console.log('myData: ',myData);
       
       if(file.items.length >= 0){
        var id = file.items.length + 1;
        myData["id"] = id;
        
        console.log('new id',id);
        file.items.push(myData);
        console.log('data: ',file);
        //return ok = true;
        }
       
        //if (ok){
           const stringData = JSON.stringify(file);

            fs.writeFile('./db/db.json', stringData, 'utf8', function(err){
                if(err){ 
                    console.log(err); 
                } else {
                    //Everything went OK!
                    res.end(myData);
                    console.log('file ',file);
                }
            });
        //}
       
        /*
       const stringData = JSON.stringify(file);

       fs.writeFile('./db/db.json', stringData, 'utf8', function(err){
            if(err){ 
                console.log(err); 
            } else {
                  //Everything went OK!
                res.json(myData.items);
                console.log('db',db);
            }
        });
  */
   }

  });


  res.end();
  
  
});

router.get('/api/notes',function(req,res){
  fs.readFile('./db/db.json', 'utf8', function (err, data) {
   if (err) {
       console.log(err)
   } else {
        const file = JSON.parse(data);
        console.log('db',file.items);
        res.json(file.items);
   }

  });
});

router.get('/notes',function(req,res){
  res.sendFile(path.join(__dirname+'/public/notes.html'));
});

router.get('*',function(req,res){
  res.sendFile(path.join(__dirname+'/public/index.html'));
  //__dirname : It will resolve to your project folder.
});

/*
router.get('/sitemap',function(req,res){
  res.sendFile(path.join(__dirname+'/sitemap.html'));
});
*/

//add the router
app.use('/', router);
app.listen(process.env.PORT||3000);

console.log('Running at Port 3000'); 
