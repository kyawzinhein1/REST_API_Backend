const express = require("express");
const router = express.Router();

const postController = require("../controllers/post");

router.get("/posts", postController.getPosts);
router.post("/posts", postController.createPost);

module.exports = router;
