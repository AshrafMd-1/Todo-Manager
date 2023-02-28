// models/todo.js
"use strict";
const { Model, Op, where } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todo.create(params);
    }

    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      // FILL IN HERE
      const ov = await Todo.overdue();
      const ovString = ov.map((items) => items.displayableString()).join("\n");
      console.log(ovString);
      console.log("\n");

      console.log("Due Today");
      // FILL IN HERE
      const to = await Todo.dueToday();
      const toString = to.map((items) => items.displayableString()).join("\n");
      console.log(toString);
      console.log("\n");

      console.log("Due Later");
      // FILL IN HERE
      const dl = await Todo.dueLater();
      const dlString = dl.map((items) => items.displayableString()).join("\n");
      console.log(dlString);
    }

    static async overdue() {
      // FILL IN HERE TO RETURN OVERDUE ITEMS
      return Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date().toLocaleDateString("en-CA"),
          },
        },
      });
    }

    static async dueToday() {
      // FILL IN HERE TO RETURN ITEMS DUE TODAY
      return Todo.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date().toLocaleDateString("en-CA"),
          },
        },
      });
    }

    static async dueLater() {
      // FILL IN HERE TO RETURN ITEMS DUE LATER
      return Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date().toLocaleDateString("en-CA"),
          },
        },
      });
    }

    static async markAsComplete(id) {
      // FILL IN HERE TO MARK AN ITEM AS COMPLETE
      await Todo.update(
        { completed: true },
        {
          where: {
            id: id,
          },
        }
      );
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      let date =
        new Date(this.dueDate).toLocaleDateString() ===
        new Date().toLocaleDateString("en-CA")
          ? ""
          : this.dueDate;
      return `${this.id}. ${checkbox} ${this.title} ${date}`.trim();
    }
  }

  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
