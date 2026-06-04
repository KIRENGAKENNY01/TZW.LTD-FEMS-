export const validate = (schema) => {
  return (req, res, next) => {
    const isMultiSource = schema.shape && (schema.shape.body || schema.shape.query || schema.shape.params);
    
    let dataToValidate = req.body;
    if (isMultiSource) {
      dataToValidate = {
        body: req.body,
        query: req.query,
        params: req.params
      };
    }

    const result = schema.safeParse(dataToValidate);
    if (!result.success) {
      return next(result.error);
    }

    if (isMultiSource) {
      if (result.data.body) req.body = result.data.body;
      if (result.data.query) req.query = result.data.query;
      if (result.data.params) req.params = result.data.params;
    } else {
      req.body = result.data;
    }

    next();
  };
};
