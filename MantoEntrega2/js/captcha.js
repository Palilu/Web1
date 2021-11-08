"use strict";
document.addEventListener("DOMContentLoaded", function(event) {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    const captchaLength = 5;
    const invalidCaptchaMsg = "Captcha inválido";

    let form = document.querySelector("#form");
    form.addEventListener("submit", validate);

    let captcha = getRandomString();
    document.querySelector("#captcha-txt").innerHTML = captcha;

    /**
     * Valida el captcha, si no es válido muestra un mensaje en el formulario.
     * Si es válido hace submit al formulario. 
     */
    function validate(e) {
        e.preventDefault();
        let formData = new FormData(this);
        if (captcha != formData.get("captcha")) {
            document.querySelector("#captcha-msg").innerHTML = invalidCaptchaMsg;
            document.querySelector("#captcha-inp").focus();
            return;
        }
        document.querySelector("#form").submit();
    }

    /**
     * Retorna un String aleatorio.
     */
    function getRandomString() {
        let randomString = '';
        for (let i = 0; i < captchaLength; i++) {
            let randomNumber = Math.floor(Math.random() * chars.length);
            randomString += chars.substring(randomNumber, randomNumber + 1);
        }
        return randomString;
    }
});
