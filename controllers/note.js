const { validationResult } = require("express-validator");

exports.getNotes = (req, res, next) => {
  const notes = [
    {
      title: "first note",
      content: "First content",
    },
  ];
  res.json(notes);
};

exports.createNote = (req, res, next) => {
  const { title, content } = req.body;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({
      message: "Validation Failed.",
      errorMessage: error.array(),
    });
  }
  res.status(201).json({
    message: "Note Created",
    data: {
      title,
      content,
    },
  });
};
