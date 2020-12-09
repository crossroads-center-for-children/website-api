const resources = require("../../../client/src/content/resources/index");
const axios = require("axios");

async function createResources() {
  for (const resource of resources) {
    await axios.post("http://localhost:1337/resources", resource);
  }
}

createResources();
