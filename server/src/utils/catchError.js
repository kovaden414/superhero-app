export const catchError = (action) => {
  return async function (req, res, next) {
    try {
      await action(req, res, next);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message || "Something went wrong" });
    }
  };
};
