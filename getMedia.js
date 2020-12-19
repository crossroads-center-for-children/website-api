const axios = require("axios");
const fs = require("fs");
const path = require("path");

const downloadImg = async () => {
  const dirPath = path.join(__dirname, "/images");

  const url =
    "http://crossroadcenter.org/wp-content/uploads/2017/02/IMG_7212.jpg";

  const fileName = url.split("/").pop();

  const filetype = url.split(".").pop();

  const response = await axios({
    method: "get",
    url,
    responseType: "stream",
  });

  console.log(response.data);

  await response.data.pipe(fs.createWriteStream(`${__dirname}/${fileName}`));
};

downloadImg();
