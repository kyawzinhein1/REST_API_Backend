exports.getPosts = (req, res) => {
  res.status(200).json([
    { id: 1, title: "First Post", description: "First Post Description" },
    { id: 2, title: "Second Post", description: "Second Post Description" },
  ]);
};

exports.createPost = (req, res) => {
  res.status(201).json({
    message: "Post Created",
    data: req.body,
  });
};
