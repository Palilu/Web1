document.querySelector("#calculate").addEventListener("click", showResult);

function showResult() {
    document.querySelector("#result").innerHTML = calculate();    
}

function calculate() {
    let number1 = parseInt(document.querySelector("#number1").value);
    let number2 = parseInt(document.querySelector("#number2").value);
    switch(document.querySelector("#operation").value) {
        case '+': return number1 + number2;
        case '-': return number1 - number2;
        case '*': return number1 * number2;
        case '/': return number1 / number2;
    }
}
