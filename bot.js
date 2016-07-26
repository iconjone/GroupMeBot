var HTTPS = require('https');
var cool = require('cool-ascii-faces');
var giphy = require('giphy-api')();

var botID = process.env.BOT_ID;
var botName = process.env.BOT_NAME;
var nameTarget = process.env.NAME_TARGET;
var specialMessage = process.env.SPECIAL_MESSAGE;
var aiClient = process.env.AI_CLIENT;
var aiDeveloper = process.env.AI_DEVELOPER;
var googleKey = process.env.GOOGLE_KEY;
var googleID = process.env.GOOGLE_ID;
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
var msgfind = new RegExp(specialMessage);
var msgres = msgfind.test(norstr);
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
if(gifres && request.name != botName && !(webres))
{
    var query = str.substr(3);
    getGif(query);
}
//Checks for and initates Search
if(searchres && request.name != botName && !(webres))
{
    var query = str.substr(8);
    if(googleID != undefined)
    search(query);
}
//Checks for and initates ApiAi
if(aires)
  {
    var query = str.substr(3);
    query = query.replace(/\s/g, "+");
    //Makes the query seperated by plus
    if(request.name != botName)
    if(aiClient != undefined)
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
  } else if(msgres && request.name == nameTarget) {
        this.res.writeHead(200);
        var botResponse = "https://i.groupme.com/500x307.gif.38bd79c0db38415cba0333c1120fbff3.large";
        postMessage(botResponse);
        this.res.end();
      } else if(chillres && (request.name != botName)) {
            this.res.writeHead(200);
            var botResponse = "https://i.groupme.com/245x292.gif.ca41bed2aaef478b886e0660730c80b2.large";
            postMessage(botResponse);
            this.res.end();
    }   else if(request.text && help.test(request.text)) {
          this.res.writeHead(200);
          var botResponse = "So you want to know how to use this? Look no further... If you want to trigger the AI type Ai or ai and whatever you want(Ai what is 24 + 18), try a slash and triggered, cool guy, or chill for special features...(/triggered, /cool guy, /chill) For a special person, they can type " + specialMessage + " of any sort and it will post a GIF, a slash followed by g and a search term will return a gif(/g puppies), and a slash followed by search and a search term will return a Link(/search How to bake a cake)."
          postMessage(botResponse);
          this.res.end();
  }    else { console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}
//Sends to ApiAi
function apiai(query){
var clientAccessToken=aiClient;
pathapi = "/v1/query?lang=EN&query=" + query; //replace with query
var options={
    hostname: 'api.api.ai',
    path: pathapi,
    method: 'GET',
    headers:{
        'Authorization': 'Bearer ' + aiDeveloper
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
      postMessage("No results, Sorry");
      else
      postMessage(res.data.images.original.url);
  });
  }
//Sends to Google Search(If you think it's broken, remember you only get 100 searches a day)
  function search(query)
  {
     urlsearch = "https://www.googleapis.com/customsearch/v1?key="+googleKey+"&cx="+googleID+"&q=" + query;
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
