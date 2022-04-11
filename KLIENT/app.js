document.getElementById("login-form").addEventListener("click", (e) => {
  e.preventDefault();
  let data = new FormData(document.getElementById("login-form"));
  console.log(data.getAll());
});
