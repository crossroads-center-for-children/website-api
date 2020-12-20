# Migrating from WordPress to Strapi

## Parse content of post to identify relevant classrooms

```js
const identifyRelevantRooms = (post) => {
  ["room 1", "room 2", "room 3", "room 4", "room 5", "room 6", "room 7", "room 8", "room 11", "room 12", "room 13", "room 14"].filter(room => post.Title.toLowerCase().includes(room) ||
      post.Tags.toLowerCase().includes(room) ||
      post.Content.toLowerCase().includes(room)
  });
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

### Request

```js
const data = await axios.post(url, {
    query: `mutation ($title:String, $date:DateTime, $content:String, $classes:[ID]){
        createPost(input:{
          data:{
            title:$title,
            date:$date,
            content:$content,
            classes: $classes
          }
        }) {
          id
          date
          title
          content
          classes {
            name
          }
        }
      }
    `,
    variables: {
      title,
      date,
      content,
      classes,
    },
  });
```

### Successful Response

Server will respond with new Post object:

``` json
{
  "data": {
    "createPost": {
      "post": {
        "id": "5fdea39e96a8f23659a3f880",
        "date": "2020-12-20T00:53:18.448Z",
        "title": "Reading with Tugg",
        "content": "<h1>Tuggy's Here!</h1>",
        "classes": [
          {
            "name": "Classroom 1"
          },
          {
            "name": "Classroom 2"
          },
          {
            "name": "Classroom 3"
          }
        ]
      }
    }
  }
}
```
