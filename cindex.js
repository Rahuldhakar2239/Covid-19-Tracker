
const http = require("http");
const fs = require("fs");
const requests = require("requests");

const homefile = fs.readFileSync("chome.html", "utf-8");

const replaceValue = (temporaryval, orgval) => {
  let CovidCases = temporaryval.replace("{%gActive%}", orgval.Global.TotalConfirmed);
  CovidCases = CovidCases.replace("{%gRecovered%}", orgval.Global.TotalRecovered);
  CovidCases = CovidCases.replace("{%gDeath%}", orgval.Global.TotalDeaths);
  CovidCases = CovidCases.replace("{%Active%}", orgval.Global.NewConfirmed);
  CovidCases = CovidCases.replace("{%recovered%}", orgval.Global.NewRecovered);
  CovidCases = CovidCases.replace("{%death%}", orgval.Global.NewDeaths);

  CovidCases = CovidCases.replace("{%iActive%}", orgval.Countries[76].TotalConfirmed);
  CovidCases = CovidCases.replace("{%iRecovered%}", orgval.Countries[76].TotalRecovered);
  CovidCases = CovidCases.replace("{%iDeath%}", orgval.Countries[76].TotalDeaths);
  CovidCases = CovidCases.replace("{%INactive%}", orgval.Countries[76].NewConfirmed);
  CovidCases = CovidCases.replace("{%INrecovered%}", orgval.Countries[76].NewRecovered);
  CovidCases = CovidCases.replace("{%INdeath%}", orgval.Countries[76].NewDeaths);
  return CovidCases;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests("https://api.covid19api.com/summary")
      .on('data', (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrdata = [objdata];
        const realData = arrdata.map((val) => replaceValue(homefile, val)).join("");
        res.write(realData);
      })
      .on('end', function (err) {
        if (err) return console.log('connection closed due to errors', err);
        res.end();
      });
  }

  else {
    res.end("file not found");
  }

});

server.listen(3000, "127.0.0.1");
console.log("listening port");

