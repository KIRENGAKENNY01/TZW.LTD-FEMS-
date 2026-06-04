export const sendSuccess = (res, data = {}, message = 'Operation completed successfully', meta = {}, status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
    meta
  });
};

export const sendError = (res, message = 'Something went wrong', error = {}, status = 500) => {
  return res.status(status).json({
    success: false,
    message,
    error: typeof error === 'string' ? { message: error } : error
  });
};
