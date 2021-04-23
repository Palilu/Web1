let captcha = "3E4pP";
document.querySelector("#captcha").innerHTML = captcha;
document.querySelector("#submit-captcha").addEventListener("click", validate);

function validate() {
    if (captcha != document.querySelector("#captcha-response").value) {
        document.querySelector("#message").innerHTML = "Invalid captcha";
        return;
    }
    document.querySelector("#captcha-form").submit();   
}