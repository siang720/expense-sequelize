const express = require("express");
const router = express.Router();

const { authenticated } = require("../config/auth");

// 載入Model
const db = require("../models");
const Record = db.Record;
const User = db.User;

// routes

// 導回首頁
router.get("/", authenticated, (req, res) => {
  res.redirect("/");
});

// New record page
router.get("/new", authenticated, (req, res) => {
  res.render("new");
});

// Add a new record
router.post("/", authenticated, (req, res) => {
  Record.create({
    name: req.body.name,
    category: req.body.category,
    date: req.body.date,
    amount: req.body.amount,
    UserId: req.user.id
  })
    .then(record => {
      return res.redirect("/");
    })
    .catch(error => {
      return res.status(422).json(error);
    });
});

// Edit record page
router.get("/:id/edit", authenticated, (req, res) => {
  User.findByPk(req.user.id)
    .then(user => {
      if (!user) throw new Error("user not found");
      return Record.findOne({
        where: {
          UserId: req.user.id,
          Id: req.params.id
        }
      });
    })
    .then(record => {
      return res.render("edit", { record: record });
    })
    .catch(error => {
      return res.status(422).json(error);
    });
});

// Edit a record
router.put("/:id", authenticated, (req, res) => {
  Record.findOne({
    where: {
      Id: req.params.id,
      UserId: req.user.id
    }
  })
    .then(record => {
      record.name = req.body.name;
      record.category = req.body.category;
      record.date = req.body.date;
      record.amount = req.body.amount;
      return record.save();
    })
    .then(record => {
      return res.redirect("/");
    })
    .catch(error => {
      return res.status(422).json(error);
    });
});

// delete a record
router.delete("/:id/delete", authenticated, (req, res) => {
  User.findByPk(req.user.id)
    .then(user => {
      if (!user) throw new Error("user not found");
      return Record.destroy({
        where: {
          UserId: req.user.id,
          Id: req.params.id
        }
      });
    })
    .then(record => {
      return res.redirect("/");
    })
    .catch(error => {
      return res.status(422).json(error);
    });
});

module.exports = router;
