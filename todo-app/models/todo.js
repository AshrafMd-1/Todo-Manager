"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Todo.belongsTo(models.User, { foreignKey: "UserId" });
      // define association here
    }

    static addTodo({ title, dueDate }) {
      return this.create({ title, dueDate, completed: false });
    }

    static async removeTodo({ id }) {
      const delTodo = await this.findByPk(id);
      return delTodo.destroy();
    }

    static overdueTodos() {
      return this.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date().toLocaleDateString("en-CA"),
          },
          completed: {
            [Op.eq]: false,
          },
        },
      });
    }

    static todayTodos() {
      return this.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date().toLocaleDateString("en-CA"),
          },
          completed: {
            [Op.eq]: false,
          },
        },
      });
    }

    static laterTodos() {
      return this.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date().toLocaleDateString("en-CA"),
          },
          completed: {
            [Op.eq]: false,
          },
        },
      });
    }

    static completedTodos() {
      return this.findAll({
        where: {
          completed: {
            [Op.eq]: true,
          },
        },
      });
    }

    setCompletionStatus(status) {
      return this.update({ completed: status });
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
