require("dotenv").config();
const fs = require("fs");
const prompt = require("prompt-sync")();
const axios = require("axios");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 4000;
const API_URL = process.env.API_URL;

app.use(express.json());

console.log("Welcome to the project idea generator! ");
console.log("If you would like to see multiple ideas enter an integer");
console.log("Other wise, would you like to generate an idea? (Y/N) ");

let run = true;
let res = prompt("$ ");
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
				if 
					(isNumeric(res)) console.log(await getIdea("nogenre", res));
				else 
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
