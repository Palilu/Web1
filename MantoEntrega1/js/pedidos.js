
"use strict";
const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
const captcha_length = 5;
const invalid_captcha_msg = "Captcha inválido";

document.querySelector("#submit-btn").addEventListener("click", validate);

let captcha = getRandomString();
document.querySelector("#captcha-txt").innerHTML = captcha;

/**
 * Valida el captcha, si no es válido muestra un mensaje en el formulario.
 * Si es válido hace submit al formulario. 
 */
function validate() {
    let captchaInput = document.querySelector("#captcha-inp");
    if (captcha != captchaInput.value) {
        document.querySelector("#captcha-msg").innerHTML = invalid_captcha_msg;
        captchaInput.focus();
        return;
    }
    document.querySelector("#form").submit();
}

/**
 * Retorna un String aleatorio.
 */
function getRandomString() {
    let randomstring = '';
	for (let i=0; i<captcha_length; i++) {
		let randomNumber = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(randomNumber, randomNumber + 1);
	}
	return randomstring;
}