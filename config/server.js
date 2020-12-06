module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', '5e68a3eb5e5fc4fb5aa610915bb0ac8c'),
    },
  },
});
