const todoList = () => {
  let all = [];
  const add = (todoItem) => {
    all.push(todoItem);
  };
  const markAsComplete = (index) => {
    all[index].completed = true;
  };

  const overdue = () => {
    // Write the date check condition here and return the array
    // of overdue items accordingly.
    return all.filter(
      (items) => items.dueDate.split("-")[2] < new Date().getDate()
    );
  };

  const dueToday = () => {
    // Write the date check condition here and return the array
    // of todo items that are due today accordingly.
    return all.filter(
      (items) => items.dueDate.split("-")[2] === String(new Date().getDate())
    );
  };
  const dueLater = () => {
    // Write the date check condition here and return the array
    // of todo items that are due later accordingly.
    return all.filter(
      (items) => items.dueDate.split("-")[2] > new Date().getDate()
    );
  };

  const toDisplayableList = (list) => {
    // Format the To-Do list here, and return the output string
    // as per the format given above.
    const lst = list.map((items) => {
      const it = items.completed ? "[x]" : "[ ]";
      const dt =
        items.dueDate.split("-")[2] === String(new Date().getDate())
          ? ""
          : items.dueDate;
      return `${it} ${items.title} ${dt}`;
    });
    return lst.join("\n");
  };

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
};

module.exports = todoList;
