const errorHandler = (err, req, res, next) => {
  console.error(' [ERROR LOG]:', err.stack); // Log the full error for you to see in the terminal

  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Only show the stack trace if you are in development mode
    stack: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
};

module.exports = errorHandler;