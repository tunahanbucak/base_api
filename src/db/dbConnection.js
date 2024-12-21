const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("veritabanina basariyla baglandi");
  })
  .catch((err) => {
    console.log(err);
  });
