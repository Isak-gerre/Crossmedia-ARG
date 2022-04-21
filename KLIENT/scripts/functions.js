"use strict";

function get(category = "") {}

async function createUser() {
  let formData = new FormData(document.getElementById("login-form"));
  formData.append("group", "0");
  formData.append("team", "0");
  formData.append("session", "0");
  formData.append("points", "0");

  let res = await fetch(localhost + "players", postData(formData));
  if (res.ok) {
    let data = await res.json();
    console.log(data);
  }
}

async function getUser(username) {
  let res = await fetch(`${localhost}players?username=${username}`);
  if (res.ok) {
    let data = await res.json();
    console.log(data);
  }
}
async function getSessions() {
  let res = await fetch(`${localhost}sessions`);
  if (res.ok) {
    let data = await res.json();
    console.log(data);
  }
}

function postData(formData) {
  let postData = JSON.stringify(Object.fromEntries(formData));
  let settings = {
    method: "POST",
    body: postData,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  return settings;
}
function logFormData(formData) {
  for (var pair of formData.entries()) {
    console.log(pair[0] + ", " + pair[1]);
  }
}
document.getElementById("sign-up").addEventListener("click", async (e) => {
  e.preventDefault();
  await createUser();
});
