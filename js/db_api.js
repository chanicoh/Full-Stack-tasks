class db_api {
  users = [];
  tasks = [];

  add_user(new_user) {
    this.users = JSON.parse(localStorage.getItem("users"));
    if (!this.users) {
      this.users = []; // Initialize as an empty array if null
    }
  if (this.is_user_exists(new_user)) {
      return false;
   }
  this.users.push(new_user);
  localStorage.setItem("users", JSON.stringify(this.users));
  return true;
  }

 

  is_user_exists(user_to_serch) {
    let users = JSON.parse(localStorage.getItem("users"));
    if (!users) {
      users = [];
      return false;
    }
    for (const user of users) {
      if (user.username == user_to_serch.username) {
        return true;
      }
    }
    return false;
  }

  save_logedin_username(username) {
    localStorage.setItem("logedin_user", JSON.stringify(username));
  }
  get_logedin_username() {
    return JSON.parse(localStorage.getItem("logedin_user"));
  }

  get_user_data(username_to_get) {
    let users = JSON.parse(localStorage.getItem("users"));
    for (const user of users) {
      if (user.username == username_to_get) {
        return user;
      }
    }
    return null;
  }

  get_user_taskslist(username_to_get) {
    this.tasks = JSON.parse(localStorage.getItem("tasks"));
    if (!this.tasks) {
      this.tasks = [];
    }
    let users_tasks = [];
    for (const task of this.tasks) {
      if (task.username == username_to_get) {
        users_tasks.push(task);
      }
    }
    return users_tasks;
  }

  get_all_users_taskslist() {
    this.tasks = JSON.parse(localStorage.getItem("tasks"));
    if (!this.tasks) {
      this.tasks = [];
    }
    return this.tasks;
  }

  //delete the old user's tasks list and push the new list
  update_user_taskslist(username, updatedList) {
    this.delete_user_all_tasks(username);
    this.save_user_taskslist(updatedList);
  }

  save_user_taskslist(userTaskslist) {
    this.tasks = JSON.parse(localStorage.getItem("tasks"));
    for (const task of userTaskslist) {
      this.tasks.push(task);
    }
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  add_task(task) {
    this.tasks = this.get_all_users_taskslist();
    this.tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  update_task(newTask, oldTask) {
    this.tasks = JSON.parse(localStorage.getItem("tasks"));
    for (const task of this.tasks) {
      if (
        task.username == oldTask.username &&
        task.username == newTask.username &&
        task.name == oldTask.name &&
        task.status == oldTask.status
      ) {
        task = newTask;
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
        break;
      }
    }
  }
  delete_task(taskToDelete) {
    //fill this.tasks
    this.get_all_users_taskslist();
    this.tasks = this.tasks.filter((task) => task.username!== taskToDelete.username || task.name!== taskToDelete.name || task.status!== taskToDelete.status);
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }
  delete_user_all_tasks(username) {
    this.get_all_users_taskslist();

    // Filter out tasks that do not belong to the specified username
    this.tasks = this.tasks.filter((task) => task.username !== username);

    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  log_out() {
    localStorage.removeItem("logedin_user");
  }
}
