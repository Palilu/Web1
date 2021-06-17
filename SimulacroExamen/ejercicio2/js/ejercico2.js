let personas = [];

document.querySelector("#submit").addEventListener("click", function() {
    let nombre = document.querySelector("#nombre").value;
    let apellido = document.querySelector("#apellido").value;
    let dni = document.querySelector("#dni").value;    

    personas.push({
        nombre: nombre,
        apellido: apellido,
        dni: dni
    })

    document.querySelector("#cuenta").innerHTML = personas.length;
})

document.querySelector("#mostrar").addEventListener("click", function() {
    let lista = document.querySelector("#lista");
    for (const persona of personas) {
        lista.innerHTML += `<li>${persona.nombre} ${persona.apellido} ${persona.dni}</li>`;    
    }
})