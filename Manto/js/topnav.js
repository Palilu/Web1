"use strict";
document.addEventListener("DOMContentLoaded", function(event) {
    document.querySelector("#topNav").addEventListener("click", function() {
        document.querySelector("nav").classList.toggle("visible");
    });
});
