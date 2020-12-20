const posts = require("./posts.js");

const axios = require("axios");
const fs = require("fs");
const path = require("path");
const {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
} = require("@aws-sdk/client-s3");
require("dotenv").config();

const identifyRelevantRooms = (post) => {
  // Manually exploring data I found sole author of posts consistently referred to classes as rooms and not classrooms or classes. E.g., 'Room 1', not 'Classroom 1' or 'Class 1'.

  const rooms = [
    "room 1",
    "room 2",
    "room 3",
    "room 4",
    "room 5",
    "room 6",
    "room 7",
    "room 8",
    "room 11",
    "room 12",
    "room 13",
    "room 14",
  ];

  const relevantRooms = [];

  for (const room of rooms) {
    if (
      post.Title.toLowerCase().includes(room) ||
      post.Tags.toLowerCase().includes(room) ||
      post.Content.toLowerCase().includes(room)
    ) {
      relevantRooms.push(room);
    }
  }

  return relevantRooms;
};

async function migratePosts(posts) {
  for (const post of posts) {
    try {
      await migratePost(post);
    } catch (err) {
      console.log(err);
    }
  }
}

const getIDsOfRelevantRooms = async (rooms) => {
  const url = "https://crossroads-backend.herokuapp.com/graphql";

  const slugs = rooms.map((room) => room.split("").pop());

  try {
    const data = await axios.post(url, {
      query: `query GET_CLASSES ($slugs:[String]){
        classes(where: {slug_in:$slugs}){
          id
        }
      }
      `,
      variables: {
        slugs: slugs,
      },
    });

    return (await data).data.data.classes.map((room) => room.id);
  } catch (err) {
    console.log(err);
  }
};

const getIDsOfTags = async (tags) => {
  const url = "https://crossroads-backend.herokuapp.com/graphql";

  try {
    const data = await axios.post(url, {
      query: `query GET_TAGS ($tags:[String]){
        tags(where: {tag_in:$tags}){
          id
        }
      }
      `,
      variables: {
        tags: tags.split(","),
      },
    });

    return (await data).data.data.tags.map((tag) => tag.id);
  } catch (err) {
    console.log(err);
  }
};

const createPhotos = async (urls, title) => {
  const photoIDs = [];
  if (urls[0] === "") return photoIDs;

  for (const [i, url] of urls.entries()) {
    try {
      const filePath = await downloadPhoto(url);
      const awsURL = await uploadPhoto(filePath, i, title);
      const photoID = await createPhoto(awsURL);
      photoIDs.push(photoID);
    } catch (err) {
      console.log(err);
    }
  }
  return photoIDs;
};

const createAttachments = async (urls, title) => {
  const attachmentIDs = [];
  for (const [i, url] of urls.entries()) {
    try {
      const filePath = await downloadAttachment(url);
      const awsURL = await uploadAttachment(filePath, i, title);
      const attachmentID = await createAttachment(awsURL);
      attachmentIDs.push(attachmentID);
    } catch (err) {
      console.log(err);
    }
  }
  return attachmentIDs;
};

const createPhoto = async (link) => {
  const url = "https://crossroads-backend.herokuapp.com/graphql";

  try {
    const data = await axios.post(url, {
      query: `mutation ($link:String){
        createPhoto(input:{
          data:{
            link:$link
          }
        }) {
          photo {
            id
          }
        }
      }
      `,
      variables: {
        link: link,
      },
    });
    return (await data).data.data.createPhoto.photo.id;
  } catch (err) {
    console.log(err);
  }
};

const createAttachment = async (link) => {
  const url = "https://crossroads-backend.herokuapp.com/graphql";

  try {
    const data = await axios.post(url, {
      query: `mutation ($link:String){
        createVideo(input:{
          data:{
            link:$link
          }
        }) {
          video {
            id
          }
        }
      }
      `,
      variables: {
        link: link,
      },
    });
    return (await data).data.data.createVideo.video.id;
  } catch (err) {
    console.log(err);
  }
};

const downloadPhoto = async (url) => {
  const dirPath = path.join(__dirname, "/images");
  const fileName = url.split("/").pop();
  console.log(url);
  console.log(fileName);

  try {
    const res = await axios({
      method: "get",
      url,
      responseType: "stream",
    });

    await res.data.pipe(fs.createWriteStream(`${dirPath}/${fileName}`));

    return `${dirPath}/${fileName}`;
  } catch (err) {
    console.log(err);
  }
};

const downloadAttachment = async (url) => {
  const dirPath = path.join(__dirname, "/attachments");
  const fileName = url.split("/").pop();

  try {
    const res = await axios({
      method: "get",
      url,
      responseType: "stream",
    });

    await res.data.pipe(fs.createWriteStream(`${dirPath}/${fileName}`));

    return `${dirPath}/${fileName}`;
  } catch (err) {
    console.log(err);
  }
};

const uploadPhoto = async (filePath, i, title) => {
  const bucketName = "crossroads-center-for-children";

  const s3 = new S3Client({ region: "us-east-1" });

  try {
    const data = await fs.promises.readFile(filePath);
    const key = `${title.toLowerCase().replace(" ", "-").slice(0, 40)}-${
      i + 1
    }.${filePath.split(".").pop()}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: data,
        ACL: "public-read",
        ContentDisposition: "inline",
      })
    );

    return `https://crossroads-center-for-children.s3.amazonaws.com/${key}`;
  } catch (err) {
    console.log(err);
  }
};

const uploadAttachment = async (filePath, i, title) => {
  const bucketName = "crossroads-center-for-children";

  const s3 = new S3Client({ region: "us-east-1" });

  try {
    const data = await fs.promises.readFile(filePath);
    const key = `${title.toLowerCase().replace(" ", "-").slice(0, 40)}-${
      i + 1
    }.${filePath.split(".").pop()}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: data,
        ACL: "public-read",
      })
    );

    return `https://crossroads-center-for-children.s3.amazonaws.com/${key}`;
  } catch (err) {
    console.log(err);
  }
};

const createPost = async ({
  title,
  date,
  content,
  classes,
  tags,
  photos,
  attachments,
  authors,
}) => {
  const url = "https://crossroads-backend.herokuapp.com/graphql";

  try {
    const data = await axios.post(url, {
      query: `mutation ($title:String, $date:DateTime, $content:String, $classes:[ID], $tags:[ID], $photos:[ID], $attachments:[ID], $authors:[ID]){
        createPost(input:{
          data:{
            title:$title,
            date:$date,
            content:$content,
            classes: $classes,
            tags: $tags,
            photos: $photos,
            attachments: $attachments,
            authors: $authors,
          }
        }) {
          post {
            id
            date
            title
            content
            classes {
              name
            }
          }
        }
      }
      `,
      variables: {
        title: title,
        date: date,
        content: content,
        classes: classes,
        tags: tags,
        photos: photos,
        attachments: attachments,
        authors: authors,
      },
    });

    return (await data).data.data.createPost.post.id;
  } catch (err) {
    console.log(err);
  }
};

async function migratePost(post) {
  try {
    console.log("post", post);
    // Parse post to identify relevant rooms
    const relevantRooms = identifyRelevantRooms(post);
    console.log("relevant rooms", relevantRooms);

    // Get IDs of relevant rooms

    let roomIDs = [];

    if (relevantRooms.length > 0) {
      roomIDs = await getIDsOfRelevantRooms(relevantRooms);
    }

    let tagIDs = [];

    // Get IDs of tags

    if (post.Tags.length > 0) {
      tagIDs = await getIDsOfTags(post.Tags);
    }

    console.log("tags", tagIDs);

    // Create photos

    let photoIDs = [];

    if (post["Image URL"].length > 0) {
      photoIDs = await createPhotos(post["Image URL"].split("||"), post.Title);
    }

    // Create attachments

    let attachmentIDs = [];

    if (post["Attachment URL"].length > 0) {
      attachmentIDs = await createAttachments(
        post["Attachment URL"].split("||"),
        post.Title
      );
    }

    // Set author

    const authorIDs = ["5fdbf75083ca900df09f5b29"];

    // Create post object
    const postId = await createPost({
      title: post.Title,
      date: new Date(post.Date),
      content: post.Content,
      classes: roomIDs,
      tags: tagIDs,
      photos: photoIDs,
      attachments: attachmentIDs,
      authors: authorIDs,
    });
  } catch (err) {
    console.log(err);
  }
}

migratePosts([
  {
    ID: "4736",
    Title: "Our School Calendar",
    Content:
      '<h4>Print out a copy of our school calendar here:</h4>\r\n<h4><a href="http://crossroadcenter.org/wp-content/uploads/2019/06/2020-2021-SCHOOL-CALENDAR.pdf">2020 2021 SCHOOL CALENDAR</a></h4>\r\n<ul>\r\n \t<li>Please be sure to check in on our site posts for news and events.\u00a0\u00a0Follow us on Facebook, too!</li>\r\n \t<li>Weather related school closings and delays\u00a0are always found on the local TV stations and on our Facebook page!</li>\r\n \t<li>Our school year runs July 1st \u00a0to June 30th!</li>\r\n</ul>',
    Excerpt: "",
    Date: "September 18, 2020",
    "Post Type": "post",
    Permalink: "http://crossroadcenter.org/our-school-calendar/",
    Categories: "Events,Parents,Seasonal activities",
    Tags: "calendar,school calendar",
    "Prominent words": "calendar,facebook,school,school calendar",
    "Image URL":
      "http://crossroadcenter.org/wp-content/uploads/2020/02/cadownload.jpg",
    "Images Filename": "cadownload.jpg",
    "Images Path":
      "/home/guildernet47/public_html/crossroadcenter.org/wp-content/uploads/2020/02/cadownload.jpg",
    "Images Title": "cadownload",
    "Images Caption": "",
    "Images Description": "",
    "Images Alt Text": "",
    "Attachment URL":
      "http://crossroadcenter.org/wp-content/uploads/2019/06/2020-2021-SCHOOL-CALENDAR.pdf||http://crossroadcenter.org/wp-content/uploads/2019/01/2019-2020-SCHOOL-CALENDAR.pdf",
    "Attachments Filename":
      "2020-2021-SCHOOL-CALENDAR.pdf||2019-2020-SCHOOL-CALENDAR.pdf",
    "Attachments Path":
      "/home/guildernet47/public_html/crossroadcenter.org/wp-content/uploads/2019/06/2020-2021-SCHOOL-CALENDAR.pdf||/home/guildernet47/public_html/crossroadcenter.org/wp-content/uploads/2019/01/2019-2020-SCHOOL-CALENDAR.pdf",
    "Attachments ID": "16271||12915",
    "Attachments Title": "2020 2021 SCHOOL CALENDAR||2019 2020 SCHOOL CALENDAR",
    "Attachments Caption": "",
    "Attachments Description": "",
    "Attachments Alt Text": "",
    "Author ID": "2",
    "Author Username": "vramotar2",
    "Author Email": "Vickir@crossroadcenter.org",
    "Author First Name": "Vicki",
    "Author Last Name": "Ramotar",
    Parent: "0",
    "Parent Slug": "0",
  },
]);
