async function getParams() {
  var params = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    otherParams: { host: process.env.DB_HOST, dialect: process.env.DIALECT },
  };
  return params;
}

exports.getParams = getParams;
