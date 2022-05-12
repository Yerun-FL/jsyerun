// let's Go..
// function listadd() {
//   window.location.href = "http://127.0.0.1:5500/IndexTodo.html";
// }

// Add of todo...
const plus = document.querySelector(".plus");
const myTodoInput = document.querySelector(".mytodoInput");
const addTodo = document.querySelector(".addtodo");

function listAdding(todo) {
  // console.log("here");
  const li = document.createElement("li");
  li.setAttribute("uniqueId", todo.id);
  li.innerHTML = todo.name;
  document.querySelector("ul").appendChild(li);

  // creating cross..
  const span = document.createElement("span");
  span.classList.add("crossMark");
  span.innerHTML = `<i class='bx bxs-message-square-x bx-tada bx-rotate-90' style='color:#fa1111'></i>`;
  li.appendChild(span);
  span.addEventListener("click", deleteToDo);
  span.style.marginLeft = "20px";
  span.style.cursor = "pointer";
  span.style.fontSize = "30px";

  // creating tick..
  const div = document.createElement("div");
  div.classList.add("tick");
  div.innerHTML = `<i class='bx bxs-checkbox-checked bx-tada' style='color:#2bcf09'></i>`;
  li.appendChild(div);
  div.style.marginLeft = "20px";
  div.style.cursor = "pointer";
  div.style.fontSize = "40px";
  div.addEventListener("click", updateState);

  //creating editSVg..
  const section = document.createElement("section");
  section.classList.add("editSvg");
  section.innerHTML = `<i class='bx bxs-edit-alt tickmarkzz'  style='color:#cdb807' onclick='openModal()' ></i>`;
  li.appendChild(section);
  section.style.marginLeft = "20px";
  section.style.cursor = "pointer";
  section.style.fontSize = "40px";
}

// Edit state
async function updateState(event) {
  const targetLi = event.target.closest("li");
  const targetId = targetLi.getAttribute("uniqueId");
  const url = `http://localhost:3000/lists/` + targetId;
  const backendElement = await fetch(url);
  const backendLi = await backendElement.json();
  const updatedTodo = {
    name: backendLi.name,
    completed: !backendLi.completed,
    id: backendLi.id,
  };

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTodo),
  });

  getData();
}
// delete functionality..
async function deleteToDo(event) {
  const id = event.target.closest("li").getAttribute("uniqueid");
  const url = `http://localhost:3000/lists/` + id;
  const del = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  getData();
}

// get and display Data
async function getData() {
  document.querySelector("ul").innerHTML = "";
  const gettingData = await fetch(`http://localhost:3000/lists`);
  const todoData = await gettingData.json();
  // console.log(todoData);
  todoData.forEach((each) => listAdding(each));
}
getData();

//Add todo Input to backend
async function postData() {
  const url = `http://localhost:3000/lists`;
  // console.log(myTodoInput.value);
  data = { name: myTodoInput.value, completed: false };
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  myTodoInput.value = "";
  getData();
}

let editTodoId;

// edit..
const overlay = document.querySelector(".overlay");
const modalEdit = document.querySelector(".editModal");
const openModal = function (event) {
  editTodoId = this.event.target.closest("li").getAttribute("uniqueId");
  modalEdit.classList.remove("hidden");
  document.querySelector(".wholeBody").classList.add("hidden");
  overlay.classList.remove("hidden");
  // document.querySelector(".wholeBody").style.filter = "blur(20px)";
};
overlay.addEventListener("click", () => {
  modalEdit.classList.add("hidden");
  overlay.classList.add("hidden");
  document.querySelector(".wholeBody").classList.remove("hidden");
  // document.querySelector(".wholeBody").style.filter = "blur(20px)";
});

// fetch data
fetch`http://localhost:3000/lists/`
  .then(function (db) {
    return db.json();
  })
  .then(function (obj) {
    console.log(obj);
  })
  .catch(function (error) {
    console.log("Error");
  });

// Completed button..
let taskFinished = false;
async function completeFun() {
  document.querySelector("ul").innerHTML = "";
  const gettingData = await fetch(
    `http://localhost:3000/lists?completed=${taskFinished}`
  );
  console.log(gettingData);
  const todoData = await gettingData.json();
  console.log(todoData);
  todoData.forEach((each) => listAdding(each));
}

// completed list
const completed = document.querySelector(".completed");
completed.addEventListener("click", () => {
  taskFinished = true;
  completeFun();
});

//incompleted list
const incomplete = document.querySelector(".incompleted");
incomplete.addEventListener("click", () => {
  console.log("incomplete");
  taskFinished = false;
  completeFun();
});

// all ToDo..
const allTodo = document.querySelector(".alltodo");
allTodo.addEventListener("click", () => {
  getData();
});

// for updating card in db
const url = `http://localhost:3000/lists/`;
async function EditFun(url, data) {
  try {
    let res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.log(error);
    alert(error);
  }
}

// Edit Todo..
const editTodoText = document.querySelector("#username");

async function editTodo() {
  console.log(editTodoId);
  const url = `http://localhost:3000/lists/` + editTodoId;
  console.log("hello");
  const backendElement = await fetch(url);
  const backendLi = await backendElement.json();
  const updatedTodo = {
    name: editTodoText.value,
    completed: backendLi.completed,
    id: backendLi.id,
  };

  console.log(updatedTodo);

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTodo),
  });
  getData();
}

// Duplicate ToDo..
plus.addEventListener("click", async function () {
  if (myTodoInput.value !== "") {
    const listTodo = await fetch(`http://localhost:3000/lists`);
    const jsonlist = await listTodo.json();
    const errorDuplicate = jsonlist.find(
      (each) => each.name === myTodoInput.value
    );
    if (errorDuplicate === undefined) {
      postData();
      // getData();
    } else {
      alert("User already exist ❌");
    }
  }
});
