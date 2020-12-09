module.exports = ({ env }) => ({
  defaultConnection: "default",
  database: "crossroads",
  connections: {
    default: {
      connector: "mongoose",
      settings: {
        uri: env("DATABASE_URI"),
      },
      options: {
        ssl: env.bool("DATABASE_SSL", true),
      },
    },
  },
});
