"use strict";
document.addEventListener("DOMContentLoaded", function(event) {

    loadContent("portada");

    /**
     * Aplica la clase highlighted al link del nav clickeado
     */
    function selectTab(id) {
        // Remueve la clase highlighted a todos los links del nav
        document
            .querySelectorAll(".route")
            .forEach((item) => item.classList.remove("highlighted"));
        // Busca el id pasado por parámetro y le pone la clase selected a ese link
        document
            .querySelectorAll("#" + id)
            .forEach((item) => item.classList.add("highlighted"));
    }

    /**
     * Carga el contenido del main segun el link del nav clickeado
     */
    async function loadContent(id) {
        console.log(`Loading content for id=${id}`);
        let response = await fetch(`${window.location.origin}/${id}.html`);
        try {
            if (response.ok) {
                let content = await response.text();
                document.querySelector("#main").innerHTML = content;
                if (id == "pedidos") {
                    initOrders();
                }    
            } else {
                console.log("Error loading" + id);
            }
        } catch(error) {
            console.log(error);
        }   
    }

    function push(event) {
        event.preventDefault();
        // Guarda el id del link clickeado
        let id = event.target.id;
        console.log("El id clickeado es " + id);
        selectTab(id);
        loadContent(id);
        // Pushea el estado y agrega el id a la URL
        window.history.pushState({ id }, `${id}`, `/${id}.html`);
    }

    /**
     * Al cargar la página agrega un evento push a cada link del nav
     */
    window.addEventListener("load", function(event) {
        document.querySelector("#portada").addEventListener("click", (event) => push(event));
        document.querySelector("#productos").addEventListener("click", (event) => push(event));
        document.querySelector("#pedidos").addEventListener("click", (event) => push(event));
    })

    /**
     * Agrega un evento PopState (cuando se clickearon los botones atrás/adelante)
     */
     window.addEventListener("popstate", (event) => {
        // Guarda el id del estado anterior
        console.log(event);
        let stateId = event.state.id;
        console.log("stateId = ", stateId);
        selectTab(stateId);
        loadContent(stateId);
    });
});