document.querySelector("#add-task").addEventListener("click", agregarTarea);

function agregarTarea() {
    document.querySelector("#tasks").innerHTML += "<li>" + document.querySelector("#task").value + "</li>";     
}