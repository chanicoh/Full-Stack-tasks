class server {
  dbapi;
  logedinUsername;

  constructor() {
    this.dbapi = new db_api();
  }

  prossess_data(data, dispatcher = (x) => {}) {
    let recivedData = JSON.parse(data);
    if (recivedData["d"].method === "POST") {
      if (recivedData["body"].username) {
        if (
          this.addUser(
            recivedData["body"].username,
            recivedData["body"].password
          )
        ) {
          dispatcher("success");
        } else {
          dispatcher("user alredy exist");
        }
      } else if (recivedData["body"].task) {
        this.addTask(recivedData["body"].task);
      }else if (recivedData["body"].logout) {
        if(this.logout()){
          dispatcher("logout");
        }

      }
    } else if (recivedData["d"].method === "GET") {
      if (recivedData["body"].username && recivedData["body"].password) {
        if (
          this.getUserData(
            recivedData["body"].username,
            recivedData["body"].password
          )
        ) {
          dispatcher("login successfully");
        } else {
          dispatcher("Incorrect username or password");
        }
      } else if (recivedData["body"].tasks) {
        let taskslist = this.getUserTaskslist();
        dispatcher(taskslist);
      }else if (recivedData["body"].logedin){
        dispatcher(this.getLogedInUsername());


      }
    } else if (recivedData["d"].method === "PUT") {
      if (recivedData["body"].tasks) {
        this.updateUsertasks(recivedData["body"].tasks);
      }else if (recivedData["body"].task){
        this.updateTask(recivedData["body"].task, recivedData["body"].old);
      }
    } else if (recivedData["d"].method === "DELETE") {
        if (recivedData["body"].tasks) {
          this.deleteUserAllTasks();
        } else if (recivedData["body"].task) {
          this.deleteTask(recivedData["body"].toDelete);
          let taskslist = this.getUserTaskslist();
          dispatcher(taskslist);
        }
        
    }
  }

  logout(){
    this.dbapi.log_out();
    let currentPage = "sign-in";
    document.querySelector(".active").classList.remove("active");
    document.getElementById(currentPage).classList.add("active");
    console.log(currentPage);
    history.pushState({}, currentPage, `#${currentPage}`);
    document.getElementById(currentPage).dispatchEvent(app.show);
    

  }
  addUser(username, password) {
    if (!this.dbapi.add_user({ username, password })) {
      return false;
    } else {
      window.location.reload();
      return true;
    }
  }

  validation(name, pass) {
    let user = this.dbapi.get_user_data(name);
    if (user && user.username == name && user.password == pass) {
      return true;
    }
    return false;
  }

  getLogedInUsername(){
    return this.dbapi.get_logedin_username();
  }
  getUserData(username, password) {
    if (!this.validation(username, password)) {
      window.location.reload();
      return false;
    } else {
      this.dbapi.save_logedin_username(username);
      this.logedinUsername = username;
      //this.logedinUser = this.dbapi.get_user_data(username);

      let currentPage = "todo-list";
      document.querySelector(".active").classList.remove("active");
      document.getElementById(currentPage).classList.add("active");
      console.log(currentPage);
      history.pushState({}, currentPage, `#${currentPage}`);
      document.getElementById(currentPage).dispatchEvent(app.show);

      return true;
    }
  }

  getUserTaskslist() {
    let taskslist = this.dbapi.get_user_taskslist(this.getLogedInUsername());
    return taskslist;
  }

  getAllTaskslist() {
    let all_users_tasks = this.dbapi.get_all_users_taskslist();
    return all_users_tasks;
  }

  updateUsertasks(userTaskslist) {
   this.dbapi.update_user_taskslist(this.logedinUsername, userTaskslist);

   console.log("update list" , userTaskslist);
  }

  addTask(task) {
    this.dbapi.add_task(task);
  }

  updateTask(newTask, oldTask) {
    this.dbapi.update_task(newTask, oldTask);

  }

  deleteTask(taskToDelete){
    this.dbapi.delete_task(taskToDelete);
  }
  deleteUserAllTasks(){
    this.logedinUsername = this.getLogedInUsername(); 
    this.dbapi.delete_user_all_tasks(this.logedinUsername);
    console.log("delete all tasks");
  }
}
