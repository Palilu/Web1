document.querySelector("#submit-name").addEventListener("click", customizarTitulo);

function customizarTitulo() {
    document.title = document.querySelector("#fname").value + " " + document.querySelector("#lname").value;
}