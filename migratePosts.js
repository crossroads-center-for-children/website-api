const posts = require("./posts.js");

const axios = require("axios");

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

async function migratePosts() {
  for (const post of posts) {
    await migratePost(post);
  }
}

const getIDsOfRelevantRooms = async (rooms) => {
  const url = "https://crossroads-backend.herokuapp.com/graphql";

  const slugs = rooms.map((room) => room.split("").pop());

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
};

async function migratePost(post) {
  // Parse post to identify relevant rooms
  const relevantRooms = identifyRelevantRooms(post);

  // Get IDs of relevant rooms
  const roomIDs = getIDsOfRelevantRooms(relevantRooms);

  // create post object

  const newPost = {
    title: post.Title,
    date: new Date(post.Date),
    content: post.Content,
  };

  // make
  // {title: '', subtitle: '', date: date, content: md, tags: [], authors: [], collections: [], photos: [], videos: [], classes: []}
  // upsert tags
  // {tag: '', posts: [], photos: [], videos: []}
  // create photos
  // {posts: [], tags: [], link: '', title: '', caption: ''}
  // create videos
  // {classes: [], tags: [], link: '', title: ''}
  //
}

// migratePosts();

getIDsOfRelevantRooms(["1", "2", "3"]);
