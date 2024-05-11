const { validationResult } = require("express-validator");

// models
const Note = require("../models/note");

// utils
const { unlink } = require("../utils/unlink");

exports.getNotes = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 6;
  let totalNotes;

  Note.find()
    .countDocuments()
    .then((counts) => {
      totalNotes = counts;
      // total note = 8
      // 8 / 6 =
      totalPages = Math.ceil(totalNotes / perPage);
      return Note.find()
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((notes) => {
      res.status(200).json({ notes, totalNotes, totalPages });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        message: "Something went wrong.",
      });
    });
};

exports.createNote = (req, res, next) => {
  const { title, content } = req.body;
  const cover_image = req.file;

  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({
      message: "Validation Failed.",
      errorMessage: error.array(),
    });
  }

  Note.create({
    title,
    content,
    cover_image: cover_image ? cover_image.path : "",
    author: req.userId,
  })
    .then((_) => {
      res.status(201).json({
        message: "Note created.",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        message: "Something went wrong.",
      });
    });
};

exports.getNote = (req, res, next) => {
  const { id } = req.params;
  Note.findById(id)
    .populate("author", "username")
    .then((note) => {
      return res.status(200).json(note);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        message: "Something went wrong.",
      });
    });
};

exports.deleteNote = (req, res, next) => {
  const { id } = req.params;
  Note.findById(id)
    .then((note) => {
      if (note.author.toString() !== req.userId) {
        return res.status(401).json({ message: "Auth failed!" });
      }
      if (note.cover_image) {
        unlink(note.cover_image);
      }
      return Note.findByIdAndDelete(id).then((_) => {
        return res.status(204).json({
          message: "Note deleted",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        message: "Something went wrong.",
      });
    });
};

exports.getOldNote = (req, res, next) => {
  const { id } = req.params;
  Note.findById(id)
    .then((note) => {
      if (note.author.toString() !== req.userId) {
        return res.status(401).json({ message: "Auth failed!" });
      }
      return res.status(200).json(note);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        message: "Something went wrong.",
      });
    });
};

exports.updateNote = (req, res, next) => {
  const { note_id, title, content } = req.body;
  const cover_image = req.file;

  Note.findById(note_id)
    .then((note) => {
      if (note.author.toString() !== req.userId) {
        return res.status(401).json({ message: "Auth failed!" });
      }
      note.title = title;
      note.content = content;
      if (cover_image) {
        if (note.cover_image) {
          unlink(note.cover_image);
        }
        note.cover_image = cover_image.path;
      }
      return note.save();
    })
    .then((_) => {
      return res.status(200).json({
        message: "Note Updated.",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        message: "Something went wrong.",
      });
    });
};
