
const http = require('http');
const fs = require('fs');
var requests = require('requests');

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal  = (tempVal, orgVal) => {
    console.log(orgVal);
    let t = orgVal.main.temp-273.15;
    t = Math.round(t * 100) / 100;
    let temprature = tempVal.replace("{%temprature%}",t);

    t = orgVal.main.temp_min-273.15;
    t = Math.round(t * 100) / 100;
    temprature = temprature.replace("{%temprature_min%}",t);

    t = orgVal.main.temp_max-273.15;
    t = Math.round(t * 100) / 100;
    temprature = temprature.replace("{%temprature_max%}",t);

    temprature = temprature.replace("{%location%}",orgVal.name);
    temprature = temprature.replace("{%country%}",orgVal.sys.country);
    
    temprature = temprature.replace("{%tempStat%}",orgVal.weather[0].main);
    return temprature;
}

const server = http.createServer((req,res) => {

    if(req.url == "/")  
    {
        requests(
         "https://api.openweathermap.org/data/2.5/weather?q=Bharthana&appid=9257744dac16cd3e06c733531d410ce2"
        )

        .on("data", (chunk) => {
            const objdata = JSON.parse(chunk);
            const arrData = [objdata];
            //console.log(arrData[0].main.temp - 273.15);

            const realtimeData = arrData.map((val) => replaceVal(homeFile, val))
            .join("");
            
            res.write(realtimeData);
            //console.log(realtimeData);
            res.end();
        })

        .on("end", (err) => {
            if(err) return console.log("Connection closed due to error ", err);
            res.end();
        });
    }
});

server.listen(8000,"localhost");