# Migrating from WordPress to Strapi

## Parse content of post to identify relevant classrooms

- [ ] Check title

- [ ] Check tags

- [ ] Check body

```js
const identifyRelevantRooms = (post) => {
  // Manually exploring data I found sole author of posts
  // consistently referred to classes as rooms and not classrooms or classes.
  // E.g., 'Room 1', not 'Classroom 1' or 'Class 1'.

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
```

### Get IDs of classrooms

### Request

```js
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
```

### Successful Response

```json
{
  "data": {
    "classes": [
      {
        "id": "5fce4500088eeeb90c9e4e7b"
      },
      {
        "id": "5fce4525088eeeb90c9e4e7c"
      },
      {
        "id": "5fce4536088eeeb90c9e4e7d"
      }
    ]
  }
}
```

## Create Post

### Successful Response

Server will respond with new Post object:

``` json
{
    "authors": [],
    "media": [],
    "_id": "5fde67e3769617137f33140c",
    "date": "2020-12-19T20:50:06.252Z",
    "title": "Reading with Tugg",
    "content": "<h1>Tuggy's here!</h1>",
    "published_at": "2020-12-19T20:51:47.216Z",
    "createdAt": "2020-12-19T20:51:47.228Z",
    "updatedAt": "2020-12-19T20:51:47.228Z",
    "__v": 0,
    "tags": [],
    "comments": [],
    "collections": [],
    "photos": [],
    "videos": [],
    "classes": [],
    "id": "5fde67e3769617137f33140c"
}
```
