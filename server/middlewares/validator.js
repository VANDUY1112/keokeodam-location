export function validate(schema, source = 'body') {
  return (req, res, next) => {
    try {
      const dataToValidate = req[source];
      const parsed = schema.parse(dataToValidate);
      req[source] = parsed; // Replace with sanitized & typed data
      next();
    } catch (err) {
      if (err.errors) {
        return res.status(400).json({
          success: false,
          error: 'Dữ liệu không hợp lệ (Validation Error)',
          details: err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      }
      next(err);
    }
  };
}
