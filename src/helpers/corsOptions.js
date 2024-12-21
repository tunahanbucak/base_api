//izin verilen api lerin url leri burda olacak
//cors kutuphanesi ile istedigimiz urllere izin verip istemedikelrimize izin vermeyebilriiz.

const whiteList = ["http://localhost:3000"];

const corsOptions = (req, callback) => {
  let corsOptions;
  console.log(req.header("Origin"));
  if (whiteList.indexOf(req.header("Origin")) !== -1) {
    console.log("if icersiinde");
    corsOptions = { origin: true };
  } else {
    console.log("else icersiinde");
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

module.exports = corsOptions;
