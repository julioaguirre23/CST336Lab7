var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var request = require("request");

app.use(express.static("css"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


app.get("/", async function(req, res) {
    var arr = ['house', 'cat', 'mouse'];
    var ran = Math.floor(Math.random() * (3));
    let parsedData = await getImages(arr[ran], 'all');
    res.render("home", {"image":parsedData});
});

app.get("/results", async function(req, res) {
    let keyword = req.query.keyword;//gets the value that teh user typed in the form using the GET method
    let orientation = req.query.orientation;
    let parsedData = await getImages(keyword, orientation);
    res.render("results", {"images": parsedData});
});

function getImages(keyword, orientation){
    return new Promise(function(resolve, reject){
        request('https://pixabay.com/api/?key=15449265-ccf35f2c567f4efd163d8ff71&q='+ keyword + '&orientation=' + orientation, function(error, response, body){
        if(!error && response.statusCode == 200){
            let parsedData = JSON.parse(body);// converts string to JSON
            console.dir(parsedData);
            resolve(parsedData);
            // let randomIndex = Math.floor(Math.random() * parsedData.hits.length);
            // res.send(`<img src='${parsedData.hits[randomIndex].largeImageURL}'>`);
            // res.render("results", {"images":parsedData});
        }else{
            reject(error);
            console.log(response.statusCode);
            console.log(error);
        }
    });
});
}

app.get("*", function(req, res){
   //res.send("Page Not found"); 
   res.render("error");
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is up and running"); 
});