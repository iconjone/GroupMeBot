var HTTPS = require('https');
//var request = require('request');
var cool = require('cool-ascii-faces');
var giphy = require('giphy-api')();
var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\/cool guy$/;
      triggered = /^\/triggered$/;
      testapi = /^\/apiai$/;


var str = request.text;
var norstr = str.replace(/[^\w\s]|(.)(?=\1)/g, "");
console.log(str);

var alecfind = new RegExp("ALEC");
var alecres = alecfind.test(norstr);
var chillfind = new RegExp("/chill");
var chillres = chillfind.test(str);
var aifind = new RegExp("ai");
var aires = aifind.test(str);
var giffind = new RegExp("/g");
var gifres = giffind.test(str);
console.log(gifres);
if(gifres && request.name != 'Jonathan Samuel Bot')
{
    var query = str.substr(3);
    getGif(query);
}

if(aires)
  {
    var query = str.substr(3);
    query = query.replace(/\s/g, "+");
    if(request.name != 'Jonathan Samuel Bot')
    apiai(query);
  }
if(!(chillres))
  {
    chillfind = new RegExp("/Chill");
    var chillres = chillfind.test(str);
    if(!(chillres))
      {
        chillfind = new RegExp("/CHILL");
        var chillres = chillfind.test(str);
      }
  }

  if(request.text && botRegex.test(request.text)) {
    this.res.writeHead(200);
    var botResponse = cool();
    postMessage(botResponse);
    this.res.end();
  } else if(request.text && triggered.test(request.text)) {
      this.res.writeHead(200);
      var botResponse = "https://i.groupme.com/500x281.gif.9aa0ae471663485c962fdf04fe4dffdc.large";
      postMessage(botResponse);
      this.res.end();
  } else if(alecres && request.name == 'Haana Janmohamed') {
        this.res.writeHead(200);
        var botResponse = "https://i.groupme.com/500x307.gif.38bd79c0db38415cba0333c1120fbff3.large";
        postMessage(botResponse);
        this.res.end();
      } else if(chillres) {
            this.res.writeHead(200);
            var botResponse = "https://i.groupme.com/245x292.gif.ca41bed2aaef478b886e0660730c80b2.large";
            postMessage(botResponse);
            this.res.end();
    }   else if(request.text && testapi.test(request.text)) {
          this.res.writeHead(200);
          var query = "test";
          apiai(query);
          this.res.end();
  }    else { console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}
//delete from here

function apiai(query){
var clientAccessToken='fd17db86686e41f780f909df26db2d32';
pathapi = "/v1/query?lang=EN&query=" + query; //replace with query
var options={
    hostname: 'api.api.ai',
    path: pathapi,
    method: 'GET',
    headers:{
        'Authorization': 'Bearer 4f800336a78f4c97a83bf333bed66ccf'
    }
};
	var callback=function(data)
    {
    	console.log(data);
    }
    HTTPS.get(options, function(res){
       body='';
        res.on('data', function(data){
            body+=data;
        });
        res.on('end', function(){
          //replace with var result if not work
          result=JSON.parse(body);
            delete body;
            //if(result.result == '')
            callback(result);
            var resultspeech = result.result.speech;
            var botResponse = resultspeech;
            delete result;
            delete pathapi;
            postMessage(botResponse);
        });
    }).on('error', function(e){
        console.log('Error: ' +e);
    });
  }
  function getGif(query)
  {
  giphy.translate({
      s: query,
      rating: 'g',
      fmt: 'json'
  }, function(err, res) {
      // Res contains gif data!
      console.log(res);
      if(res.data == "")
      postMessage("Lol no results");
      else
      postMessage(res.data.images.original.url);
  });
  }

function postMessage(botResponse) {
  var options, body, botReq;



  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}




exports.respond = respond;
