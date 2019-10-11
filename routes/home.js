const express = require("express");
const router = express.Router();
const sequelize = require("sequelize");
const Op = sequelize.Op;

const { authenticated } = require("../config/auth");

// 載入Model
const db = require("../models");
const Record = db.Record;
const User = db.User;

router.get("/", authenticated, (req, res) => {
  console.log(req.user.id);
  // 定義category_selected
  let category_selected = "%"; // 下面SQL query用LIKE '%' 會選到全部category
  if (req.query.category && req.query.category !== "所有類別") {
    category_selected = req.query.category;
  }
  // 儲存選定的月份
  let month_selected = req.query.month;

  // query database
  User.findByPk(req.user.id)
    .then(user => {
      if (!user) throw new Error("user not found");
      // 特定月份的資料
      if (month_selected && month_selected !== "選擇一個月份") {
        return Record.findAll({
          where: {
            UserId: req.user.id,
            category: { [Op.like]: category_selected },
            $and: sequelize.where(
              sequelize.fn("MONTH", sequelize.col("date")),
              month_selected.slice(0, -1)
            )
          }
        });
      } else {
        // 全部月份的資料
        return Record.findAll({
          where: {
            UserId: req.user.id,
            category: { [Op.like]: category_selected }
          }
        });
      }
    })
    .then(records => {
      // 計算總金額
      let totalAmount = 0;
      for (i = 0; i < records.length; i++) {
        totalAmount += records[i].amount;
      }

      return res.render("index", {
        records: records,
        totalAmount,
        category: category_selected,
        month: month_selected
      });
    })
    .catch(error => {
      return res.status(422).json(error);
    });
});

module.exports = router;
