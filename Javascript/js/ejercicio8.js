document.querySelector("#squareUp").addEventListener("click", squareUp);

function squareUp() {
    document.querySelector("#noMeLaContainer").innerHTML = "<div class='bordeRojo'>" + document.querySelector("#noMeLaContainer").innerHTML + "</div>";
    document.querySelector("#squareUp").addEventListener("click", squareUp);
    document.querySelector("#inner").classList.toggle("black");
}