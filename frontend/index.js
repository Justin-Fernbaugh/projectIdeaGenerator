require("dotenv").config();
const fs = require("fs");
const prompt = require("prompt-sync")();
const axios = require("axios");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 4000;
const API_URL = process.env.API_URL;

app.use(express.json());

console.log('-----------------------------------------')
console.log("Welcome to the project idea generator! ");
console.log('-----------------------------------------')
console.log('\n\n');

console.log('-----------------------------------------')
console.log("1. If you would like to see multiple ideas enter a number\n");
console.log("2. Other wise, enter (Y/N) to generate single idea. ");
console.log('----------------------------------------- \n')

console.log("Would you like to generate an idea? (Y/N)");

let run = true;
let res = prompt("$ ");
if(res.toLowerCase() == 'n') run = false;

(async () => {
	while (run) {
		switch (res.toLowerCase()) {
			case "y":
				console.log(await getIdea("nogenre", 1));
				break;
			case "n":
				console.log("Okay see you later! ");
				run = !run;
				break;
			default:
				if (isNumeric(res)) {
					if(res > 5) {
						console.log(`Are you sure you want to generate ${res} ideas? (Y/N)`);
						let howSure = prompt("$ ");
						if(howSure.toLowerCase() == 'n') continue;
					}
					console.log(await getIdea("nogenre", res));
				} else 
					console.log("Error: Invalid input try again ");
				break;
		}
		console.log("Would you like to see another idea? (Y/N) ");
		res = prompt("$ ");
		if(res.toLowerCase() == 'n') run = false;
	}
})();

async function getIdea(genre, howMany) {
	const res = await axios({
		method: "get",
		url: API_URL + "/idea",
		params: {
			limit: howMany,
		},
	});

	return res.data;
}

function isNumeric(str) {
	if (typeof str != "string") return false; // we only process strings!
	return (
		!isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
		!isNaN(parseFloat(str))
	); // ...and ensure strings of whitespace fail
}
