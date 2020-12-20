const axios = require("axios");
const fs = require("fs");
const path = require("path");

const downloadImg = async () => {
  const dirPath = path.join(__dirname, "/videos");

  const url =
    "http://crossroadcenter.org/wp-content/uploads/2020/09/IMG_8200.mov";

  const fileName = url.split("/").pop();

  const filetype = url.split(".").pop();

  const response = await axios({
    method: "get",
    url,
    responseType: "stream",
  });

  await response.data.pipe(fs.createWriteStream(`${dirPath}/${fileName}`));
};

downloadImg();
