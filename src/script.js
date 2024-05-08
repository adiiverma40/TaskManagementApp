// variables

//DOM variables
const addTodayTask = document.querySelector("#addTodayTask");
const main = document.querySelector("main");
const midSection = document.querySelector("#todaySchedule");
const secSection = document.querySelector("#midSection");
const userSection = document.querySelector("#userSection");
const root = document.documentElement;
//when the window is loaded.

window.addEventListener("load", () => {
  loadTask();
  loadWeeklyTask();
  loadSettings();
  
});

//add task event listeners
addTodayTask.addEventListener("click", () => {
  console.log("today task clicked");
  createModal();
});

function createModal() {
  const modal = document.createElement("div");
  modal.classList.add("modalContainer");
  modal.style.display = "block";
  modal.innerHTML = `
    <div class="modalContent" >
    <span id="cancelBtn" >X</span>
    <p style="font-size:20px; text-align:center; font-weight:bold;" >Add today's Tasks</p>
       
        <form>
        <input id="titleTask" placeholder="Task Title" type="text" required>
        <input id="taskDescription" placeholder="Task Description" type="text">
        <input id="timeInput" placeholder="Enter Time" type="time" required >
        <button id="formBtn"  type="submit">Add Task</button>
      </form>
      
    </div>
    `;
  main.appendChild(modal);
  const form = modal.querySelector("form");
  const cancelBtn = modal.querySelector("#cancelBtn");
  const titleTask = modal.querySelector("#titleTask");
  const taskDescription = modal.querySelector("#taskDescription");
  const timeInput = modal.querySelector("#timeInput");

  cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    modal.style.display = "none";
    console.log("form submitted");
    let titleTaskVal = titleTask.value;
    let taskDescriptionVal = taskDescription.value;
    let timeInputVal = timeInput.value;
    let [hours, minutes] = timeInputVal.split(":");
    hours = parseInt(hours);
    let period = hours >= 12 ? "PM" : "AM";
    if (hours > 12) {
      hours -= 12;
    } else if (hours === 0) {
      hours = 12;
    }
    let taskTimeCom = `${hours}:${minutes} ${period}`;
    storeTask(titleTaskVal, taskDescriptionVal, taskTimeCom);
    createTaskSection(titleTaskVal, taskDescriptionVal, taskTimeCom);
  });
}

function createTaskSection(taskName, taskDescription, taskTime) {
  let cardDiv = document.createElement("div");
  cardDiv.classList.add("cardDiv", "incompleteTask");
  if (taskDescription === "") {
    cardDiv.innerHTML = `<div class="taskContainer">
            <span class="todayDp"><i class="fa-regular fa-clock"></i></span>
          <p class="taskName">${taskName}</p>
          <p class="taskTime">${taskTime}</p>
        </div>`;
  } else if (taskDescription !== "") {
    cardDiv.innerHTML = `
      
            <div class="taskContainer">
      <span class="todayDp"><i class="fa-regular fa-clock"></i></span>
      <p class="taskName">${taskName}</p>
      <p class="taskTime">${taskTime}</p>
      </div>
      <p class="todayDescription">${taskDescription}</p>
  </div>
      `;
  }

  midSection.appendChild(cardDiv);
}

function storeTask(taskName, taskDescription, taskTime) {
  let taskData = {
    name: taskName,
    description: taskDescription,
    time: taskTime,
  };
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.push(taskData);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function loadTask() {
  let storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  if (storedTasks.length === 0) {
    console.log("no tasks");
    createModal();
  }
  storedTasks.forEach((task) => {
    createTaskSection(task.name, task.description, task.time);
  });
}

// first section

let addWeeklyTask = document.querySelector("#addWeeklyTask");
let addWeeklyTaskBtn = document.querySelector("#nowIamTierd");
let firstSection = document.querySelector("#weeklyTaskContent");
addWeeklyTask.addEventListener("click", () => {
  createWeeklyModal();
});
addWeeklyTaskBtn.addEventListener("click", () => {
  createWeeklyModal();
});

function createWeeklyModal() {
  const modal = document.createElement("div");
  modal.classList.add("modalContainer");
  modal.style.display = "block";
  modal.innerHTML = `
    <div class="modalContent" >
    <span id="cancelBtn" >X</span>
        <form>
        <p style="font-size:20px; text-align:center; font-weight:bold;" >Weekly Tasks</p>
        <input id="titleTask" placeholder="Task Title" type="text" required>
        <input id="taskDescription" placeholder="Task Description" type="text">
        <label for="date">Select Task Date&Time:</label>
        <input type="date" id="taskDate" name="taskDate">
        <input id="timeInput" placeholder="Enter Time" type="time" >
        <button id="formBtn"  type="submit">Add Task</button>
      </form>
    </div>
    `;
  main.appendChild(modal);
  const form = modal.querySelector("form");
  const cancelBtn = modal.querySelector("#cancelBtn");
  const titleTask = modal.querySelector("#titleTask");
  const taskDescription = modal.querySelector("#taskDescription");
  const timeInput = modal.querySelector("#timeInput");
  const taskDate = modal.querySelector("#taskDate");
  cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    modal.style.display = "none";
    console.log("form submitted");
    let titleTaskVal = titleTask.value;
    let taskDescriptionVal = taskDescription.value;
    let timeInputVal = timeInput.value;
    let taskDateVal = taskDate.value;
    let [hours, minutes] = timeInputVal.split(":");
    hours = parseInt(hours);
    let period = hours >= 12 ? "PM" : "AM";
    if (hours > 12) {
      hours -= 12;
    } else if (hours === 0) {
      hours = 12;
    }
    if (!isNaN(hours)) {
      var taskTimeCom = `-${hours}:${minutes} ${period}`;
    } else {
      var taskTimeCom = "";
    }

    let selectedDate = new Date(taskDateVal);

    // Get the day, month, and year
    let day = selectedDate.getDate();
    let month = selectedDate.toLocaleString("default", { month: "short" });
    let year = selectedDate.getFullYear();

    // Format the date string
    let formattedDate = day + " " + month + " " + year;

    saveWeeklyTask(
      titleTaskVal,
      formattedDate,
      taskDescriptionVal,
      taskTimeCom
    );
    createWeeklyTask(
      titleTaskVal,
      formattedDate,
      taskDescriptionVal,
      taskTimeCom
    );
  });
}

function createWeeklyTask(taskName, taskDate, taskDescription, taskTime) {
  let cardDiv = document.createElement("div");
  let existingDivs = firstSection.querySelectorAll(".weeklyTask").length;
  if (existingDivs >= 2) {
    return;
  }
  if (taskDescription === "") {
    cardDiv.innerHTML = `
    <div class="weeklyTask">
    <span class="weeklyTaskDp"><i class="fa-solid fa-user-doctor"></i></span>
    <div class="content">
      <h3 class="weeklyTaskHeading">${taskName}</h3>
      <p class="date">${taskDate} ${taskTime}</p>
    </div>
  </div>
  `;
  } else if (taskDescription !== "") {
    cardDiv.innerHTML = `
    <div class="weeklyTask">
    <span class="weeklyTaskDp"><i class="fa-solid fa-user-doctor"></i></span>
    <div class="content">
      <h3 class="weeklyTaskHeading">${taskName}</h3>
      <p class="date">${taskDate} ${taskTime}</p>
      <p class="taskType">Personal</p>
      <p class="taskDescription">${taskDescription}</p>
    </div>
  </div>
      `;
  }
  firstSection.appendChild(cardDiv);
}

function saveWeeklyTask(taskName, taskDate, taskDescription, taskTime) {
  let taskData = {
    name: taskName,
    description: taskDescription,
    taskDate: taskDate,
    time: taskTime,
  };
  let weeklyTasks = JSON.parse(localStorage.getItem("weeklyTask")) || [];
  console.log(weeklyTasks);
  weeklyTasks.push(taskData);
  localStorage.setItem("weeklyTask", JSON.stringify(weeklyTasks));
}

function loadWeeklyTask() {
  let storedTasks = JSON.parse(localStorage.getItem("weeklyTask")) || [];
  console.log("Stored tasks:", storedTasks);
  storedTasks.forEach((task) => {
    createWeeklyTask(task.name, task.taskDate, task.description, task.time);
  });
}
// view all weekly tasks
const viewWeeklyTask = document.querySelector("#viewAllWeekly");

viewWeeklyTask.addEventListener("click", () => {
 viewWeeklyModal()
 console.log("View all weekly tasks")
});

function viewWeeklyModal() {
  const modal = document.createElement("div");
  modal.classList.add("modalContainer");
  modal.style.display = "block";
  modal.innerHTML = `
    <div class="modalContent" style="max-height: 26rem;overflow-x: auto;background-color: var(--bluishWhiteColor);">
    <span id="cancelBtn" >X</span>
        <div id="tasksWeekly" style="background-color: var(--bluishWhiteColor); ">
        <p style="font-size:20px; text-align:center; font-weight:bold;" >All Weekly Tasks</p>
        <div id="taskHere">
        </div>
        </div>
    </div>
    `;
  main.appendChild(modal);

  const tasksList = modal.querySelector("#taskHere");
  const cancelBtn = modal.querySelector("#cancelBtn");
  cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  let tasks = JSON.parse(localStorage.getItem("weeklyTask")) || [];
  tasks.forEach((task) => {
    let taskHTML = '';
    if (task.description === "") {
      taskHTML = `
      <div class="weeklyTask" >
      <span class="weeklyTaskDp"><i class="fa-solid fa-user-doctor"></i></span>
      <div class="content" >
        <h3 class="weeklyTaskHeading">${task.name}</h3>
        <p class="date">${task.taskDate} ${task.time}</p>
      </div>
    </div>
    `;
    } else {
      taskHTML = `
      <div class="weeklyTask">
      <span class="weeklyTaskDp"><i class="fa-solid fa-user-doctor"></i></span>
      <div class="content">
        <h3 class="weeklyTaskHeading">${task.name}</h3>
        <p class="date">${task.taskDate} ${task.time}</p>
        <p class="taskType">Personal</p>
        <p class="taskDescription">${task.description}</p>
      </div>
    </div>
    `;
    }
    tasksList.innerHTML += taskHTML; // Append task HTML to existing content
  });
}


///settings
const settings = document.querySelector("#mySettings");

settings.addEventListener("click", () => {
  openSettingsMenu();
});

function openSettingsMenu() {
  let settingMenu = document.createElement("div");
  settingMenu.classList.add("modalContainer");
  settingMenu.style.display = "block";
  settingMenu.innerHTML = `
    <div class="modalContent">
      <span id="cancelBtn">X</span>
      <p style="font-size:20px; text-align:center; font-weight:bold;">Settings</p>
      <div>
        <div>
          <label for="username">Username:</label>
          <input type="text" id="username" placeholder="Enter your username">
        </div>
        <div>
          <label  for="userImage">User Image:</label>
          <input type="text" id="userImage" placeholder="Enter URL/Path of image.">
        </div>
        <div>
          <label   for="theme">Change Theme:</label>
          <select id="theme">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <button class="settingBtn" id="clearTasksBtn">Clear All Tasks</button>
        <button class="settingBtn" id="changeSettings">Change Settings</button>
      </div>
    </div>
  `;
  const username = settingMenu.querySelector("#username");
  const userImage = settingMenu.querySelector("#userImage");
  const theme = settingMenu.querySelector("#theme");
  const changeSettingsBtn = settingMenu.querySelector("#changeSettings");
  changeSettingsBtn.addEventListener("click", ()=>{
    changeSettings(username);
    saveSettings(username, userImage, theme);
    settingMenu.style.display = "none";
    
    if(isDark){
      whiteTheme();
    }
    else{darkTheme();}

  })
  const cancelBtn = settingMenu.querySelector("#cancelBtn");
  cancelBtn.addEventListener("click", () => {
    settingMenu.style.display = "none";
  });

  const clearTasksBtn = settingMenu.querySelector("#clearTasksBtn");
  clearTasksBtn.addEventListener("click", () => {
    clearAllTasks();
  });
  
  main.appendChild(settingMenu);
}

function clearAllTasks() {
  localStorage.removeItem("tasks");
  localStorage.removeItem("weeklyTask");
  location.reload();
}

function changeSettings(username){
  document.querySelector("#userName").textContent = username.value;

}
function saveSettings(username, userImage, theme) {
  let settingsData = {
    username: username.value,
    userImage: userImage.value,
    theme: theme.value,
  };

  let settings = JSON.parse(localStorage.getItem("settings")) || [];

  if (username.value && userImage.value !== "") {
    settings.push(settingsData);
  }
  else if(username.value !== ""){
    settings.forEach((setting) => {
      setting.username = username.value;
      setting.theme = theme.value;
    });
  }
  
  else if(userImage.value !== ""){
    settings.forEach((setting) => {
      setting.userImage = userImage.value;
      setting.theme = theme.value;
    });
  }
   else {
    // Only update the theme value for existing settings
    settings.forEach((setting) => {
      setting.theme = theme.value;
    });
  }

  localStorage.setItem("settings", JSON.stringify(settings));
  location.reload();
}



let isDark = false;


function loadSettings(){
  let storedSettings = JSON.parse(localStorage.getItem("settings")) || [];
  console.log("Stored settings:", storedSettings);
  storedSettings.forEach((setting) => {
    document.querySelector("#userName").textContent = setting.username;
    document.querySelector("#userPic").src = setting.userImage;
    if(setting.theme ==="light"){
      whiteTheme();
      isDark = false;
    }
    else if(setting.theme ==="dark"){
      darkTheme();
      isDark = true;
    }
    // document.querySelector("#theme").textContent = setting.theme;
  });
}

function whiteTheme() {
  secSection.style.backgroundColor = "white";
  userSection.style.backgroundColor = "white";
  main.style.backgroundColor = "white";
  document.querySelector("#fixed").style.color = "black";
  root.style.setProperty("--cardDivColor", "black");
  root.style.setProperty("--cardDivBg", "#fafbfd");
  root.style.setProperty("--colorBlack", "black");
  root.style.setProperty("--bluishWhiteColor", "#fafbfd");
  root.style.setProperty("--weeklyTaskBg", "white");
  let todayDp = document.querySelectorAll(".todayDp");
  todayDp.forEach(dp =>{
    dp.style.backgroundColor = "white";
    dp.style.color = "black";
  })
}

function darkTheme(){
  secSection.style.backgroundColor ="#272829";
  userSection.style.backgroundColor ="#272829";
  main.style.backgroundColor ="#272829";
  document.querySelector("#fixed").style.color = "#FFF6E0";
  root.style.setProperty("--cardDivColor","#FFF6E0");
  root.style.setProperty("--cardDivBg","#61677A");
  root.style.setProperty("--colorBlack","#FFF6E0");
  root.style.setProperty("--bluishWhiteColor","#61677A");
  root.style.setProperty("--weeklyTaskBg","#272829")
}


