const CustomError = (name, message, status, details) => {
  const error = new Error(message);
  error.name = name || error.name;
  error.status = status;
  if (details) error.details = details;
  return error;
}

module.exports = CustomError