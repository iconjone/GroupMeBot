var HTTPS = require('https');
var cool = require('cool-ascii-faces');
var giphy = require('giphy-api')();

var botID = process.env.BOT_ID;
function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\/cool guy$/;
      triggered = /^\/triggered$/;
      help = /^\/help$/;

var str = request.text;
// string and removes spaces and repeating
var norstr = str.replace(/[^\w\s]|(.)(?=\1)/g, "");
console.log(str);
//makes true false variables
var alecfind = new RegExp("ALEC");
var alecres = alecfind.test(norstr);
var chillfind = new RegExp("/chill");
var chillres = chillfind.test(str);
var aifind = new RegExp("ai");
var aires = aifind.test(str);
var giffind = new RegExp("/g");
var gifres = giffind.test(str);
var searchfind = new RegExp("/search");
var searchres = searchfind.test(str);
	var webfind = new RegExp(".com");
var webres = webfind.test(str);
//Fallbacks
//Checks if it contains a website
	if(!(webres))
  {
    webfind = new RegExp(".net");
    var webres = webfind.test(str);
    if(!(webres))
      {
        webfind = new RegExp(".org");
        var webres = webfind.test(str);
      }
  }
//Checks if it contains ai or Ai
  if(!(aires))
  {
     aifind = new RegExp("Ai");
     aires = aifind.test(str);
  }
  //Checks all the Chills
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
//End of fallbacks
//Checks for and initates Gif
if(gifres && request.name != 'Jonathan Samuel Bot' && !(webres))
{
    var query = str.substr(3);
    getGif(query);
}
//Checks for and initates Search
if(searchres && request.name != 'Jonathan Samuel Bot' && !(webres))
{
    var query = str.substr(8);
    search(query);
}
//Checks for and initates ApiAi
if(aires)
  {
    var query = str.substr(3);
    query = query.replace(/\s/g, "+");
    //Makes the query seperated by plus
    if(request.name != 'Jonathan Samuel Bot')
    apiai(query);
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
    }   else if(request.text && help.test(request.text)) {
          this.res.writeHead(200);
          var botResponse = "So you want to know how to use this? Look no further... If you want to trigger the AI type Ai or ai and whatever you want, try a slash and triggered, cool guy, or chill for special features... For Haana, she can type alec of any sort and it will post a GIF, a slash followed by g and a search term will return a gif, and a slash followed by search and a search term will return a Link."
          postMessage(botResponse);
          this.res.end();
  }    else { console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}
//Sends to ApiAi
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
          result=JSON.parse(body);
            callback(result);
            var resultspeech = result.result.speech;
            var botResponse = resultspeech;
            postMessage(botResponse);
        });
    }).on('error', function(e){
        console.log('Error: ' +e);
    });
  }
  //Sends to Giphy to get Gif
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
//Sends to Google Search(If you think it's broken, remember you only get 100 searches a day)
  function search(query)
  {
     urlsearch = "https://www.googleapis.com/customsearch/v1?key=AIzaSyBWUDEVg5rMp8sBWxZFWfnSm1ES38NetH0&cx=002141288598133749978:zrk0yz6qoee&q=" + query;
     var callback=function(data)
       {

       }
       HTTPS.get(urlsearch, function(res){
          body='';
           res.on('data', function(data){
               body+=data;
           });
           res.on('end', function(){
             result=JSON.parse(body);
               callback(result);
              var searchLink = result.items[0].link;
              var searchSnippet = result.items[0].snippet;
               var botResponse = searchSnippet + " The link is " + searchLink;
               postMessage(botResponse);
           });
       }).on('error', function(e){
           console.log('Error: ' +e);
       });
  }
//Post to Groupme
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
