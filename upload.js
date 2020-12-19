const {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
} = require("@aws-sdk/client-s3");

const fs = require("fs").promises;

require("dotenv").config();

// let data;
// const keyName = "hello_world.txt";
// const objectParams = { Bucket: bucketName, Key: keyName, Body: data };

const run = async function () {
  const bucketName = "crossroads-center-for-children";

  const s3 = new S3Client({ region: "us-east-1" });
  const data = await fs.readFile("./IMG_7212.jpg");

  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: "test-image7.jpg",
      Body: data,
      ACL: "public-read",
      ContentDisposition: "inline",
    })
  );
};

run();

// const run = async () => {
//   try {
//     const res = await s3.send(new PutObjectCommand(objectParams));
//   } catch (err) {
//     console.log(err);
//   }
// };

// run();
