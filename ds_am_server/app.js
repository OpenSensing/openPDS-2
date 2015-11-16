var express = require('express')
  , path    = require('path')
  , fs      = require('fs')

var app = express()



// routes

app.get("/list/:resource", list)
app.get("/module/:name", send_module)
app.get("/source/:name", send_source)

// route handlers

function list(req, res) {
  var resource_name  = req.params.resource  
  if (!(resource_name in {'sources':0, 'modules':1})) return res.status(404).send('resource type '+resource_name+' not found')
  
  fs.readdir(path.join(__dirname, resource_name), function (e, ls) {
    var payload = ls
    res.header('Content-Type', 'application/json')
    res.send(payload)

  }) 

}


function send_module(req,res) {
  var module_name  = req.params.name
  //if (!(resource_name in {'sources':0, 'modules':1})) return res.status(404).send('resource type '+resource_name+' not found')
  console.log(module_name)

  res.sendFile(module_name, {"root": path.join(__dirname, 'modules')})
}

function send_source(req,res) {
  var source_name  = req.params.name
  //if (!(resource_name in {'sources':0, 'modules':1})) return res.status(404).send('resource type '+resource_name+' not found')
  console.log(source_name)

  res.sendFile(source_name, {"root": path.join(__dirname, 'sources')})

}


app.listen(8000)
