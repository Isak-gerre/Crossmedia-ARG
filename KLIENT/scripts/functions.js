"use strict";

function get(category = "") {}

let fibb1 = 0;
let fibb2 = 1;
let temp = 0;
let fibbSTR = "";

for (let i = 0; i < 21; i++) {
  temp = fibb2 + fibb1;
  fibbSTR += temp;
  fibb1 = fibb2;
  fibb2 = temp;
}

console.log(fibbSTR);
