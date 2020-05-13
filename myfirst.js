var http = require('http');
var url = require('url');
var querystring = require('querystring');
var fs = require('fs');

http.createServer(function (req, res) {
  if(req.method=='POST'){
    var post = "";
    req.on('data',function(chunk){
      post += chunk;
    });
    req.on('end',function(){
      post = querystring.parse(post);
      res.writeHead(200, {'Content-Type': 'text/html'});
      if(post.name){
        res.write("Hello" + post.name);
      }
      else{
        res.statusCode = 400;
      }
    });
  }
  else{
    var params = url.parse(req.url,true).pathname;
    var q = url.parse(req.url,true).query;
    res.writeHead(200, {'Content-Type': 'text/html'});
    if(params=="/byebye"&&q.name){
      res.write("Byebye " + q.name);
    }
    else if(params=="/"&&q.name){
      res.write("Hello " + q.name);
    }
    else if(params=="/byebye"){
      res.statusCode = 400;
    }
    else if(params=="/"){
      res.write("Hello World");
    }
    else{
      var filename = "."+params;
      fs.readFile(filename, function(err, data) {
        if (err) {
          res.writeHead(404, {'Content-Type': 'text/html'});
          return res.end("404 Not Found");
        } 
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
      });
    }
  }
  res.end();
  
}).listen(8080);