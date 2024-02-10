// to handle all other routes

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  console.log(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next();
};

module.exports = { notFound };
