document.querySelector("#red").addEventListener("click", updateColor);
document.querySelector("#blue").addEventListener("click", updateColor);
document.querySelector("#green").addEventListener("click", updateColor);

function updateColor() {
    // adj. Dicho de un color: Semejante al de la sangre o al del tomate maduro, 
    // y que ocupa el primer lugar en el espectro luminoso.
    
    // adj. Dicho de un color: Semejante al del cielo sin nubes y el mar en un día soleado,
    // y que ocupa el quinto lugar en el espectro luminoso.

    //adj. Dicho de un color: Semejante al de la hierba fresca o al de la esmeralda, 
    //y que ocupa el cuarto lugar en el espectro luminoso.
    
    document.querySelector("#color").innerHTML = this.value;    
}