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

    static addTodo({ title, dueDate, UserId }) {
      return this.create({ title, dueDate, completed: false, UserId });
    }

    static async removeTodo({ id, UserId }) {
      const delTodo = await this.findOne({
        where: {
          id,
          UserId,
        },
      });
      return delTodo.destroy();
    }

    static overdueTodos(UserId) {
      return this.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date().toLocaleDateString("en-CA"),
          },
          completed: {
            [Op.eq]: false,
          },
          UserId,
        },
      });
    }

    static todayTodos(UserId) {
      return this.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date().toLocaleDateString("en-CA"),
          },
          completed: {
            [Op.eq]: false,
          },
          UserId,
        },
      });
    }

    static laterTodos(UserId) {
      return this.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date().toLocaleDateString("en-CA"),
          },
          completed: {
            [Op.eq]: false,
          },
          UserId,
        },
      });
    }

    static completedTodos(UserId) {
      return this.findAll({
        where: {
          completed: {
            [Op.eq]: true,
          },
          UserId,
        },
      });
    }

    setCompletionStatus(status) {
      return this.update({ completed: status });
    }
  }

  Todo.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        allowEmpty: false,
        validate: {
          notNull: {
            msg: "Title is required",
          },
          notEmpty: {
            msg: "Title is required",
          },
        },
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        allowEmpty: false,
        validate: {
          notNull: {
            msg: "Due date is required",
          },
          isDate: {
            msg: "Due date must be a valid date",
          },
          notEmpty: {
            msg: "Due date is required",
          },
        },
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
