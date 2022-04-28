document.getElementById("sign-up").addEventListener("click", async (e) => {
  e.preventDefault();
  const username = document.querySelector("#username");
  const password = document.querySelector("#password");
  const confirmPassword = document.querySelector("#confirm-password");
  if (password.value == confirmPassword.value && username != "") {
    await createPlayer();
  } else {
    if (password.value != confirmPassword.value) {
      displayLoginErrorMessage("Passwords do not match!");
    }
    if (username.value == "") {
      displayLoginErrorMessage("Please fill in your username!");
    }
    console.log("does not match");
  }
});

document.getElementById("login").addEventListener("click", async (e) => {
  e.preventDefault();
  let formData = new FormData(document.getElementById("login-form"));
  if (await logInPlayer(postFormData(formData))) {
    console.log(true);
    window.location.replace("html/sessions.html");
  } else {
    console.log(false);
    displayLoginErrorMessage("Username and Passwords does not match!");
  }
});

document.querySelector("#confirm-password").addEventListener("keyup", () => {
  checkPasswordFields();
});
document.querySelector("#password").addEventListener("keyup", () => {
  checkPasswordFields();
});

function checkPasswordFields() {
  const password = document.querySelector("#password");
  const confirmPassword = document.querySelector("#confirm-password");
  if (password.value != confirmPassword.value) {
    confirmPassword.style.outline = "3px solid red";
    password.style.outline = "3px solid red";
    displayLoginErrorMessage("Passwords do not match!");
  } else {
    confirmPassword.style.outline = "3px solid green";
    password.style.outline = "3px solid green";
    displayLoginErrorMessage("");
  }
}
