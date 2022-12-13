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
console.log("1. To see in-progress ideas press p\n");
console.log("1. To view ideas by genre select g\n");
console.log("2. Other wise, enter (Y/N) to generate single idea. ");
console.log('----------------------------------------- \n')

console.log("Would you like to generate a single idea? (Y/N)");

let cachedIdeas = [];
let run = true;
let res = prompt("$ ");
if(res.toLowerCase() == 'n') run = false;

(async () => {
	while (run) {
		switch (res.toLowerCase()) {
			case "y":
				await printIdeas(1, "");
				break;
			case "n":
				console.log("Okay see you later! ");
				run = !run;
				break;
			case "p":
				console.log('The following ideas are currently in progress: ');
				const inProgress = await getInProgress(5);
				for(let i = 0; i < inProgress.length; i++)
					console.log(`${i}. ${inProgress[i]}`);
				break;
			case "g":
				const genres = await getGenres();
				for(let i = 0; i < genres.length; i++)
					console.log(`${i}. ${genres[i]}`);

				const idx = selectGenre(genres);
				await printIdeas(0, genres[idx]);
				break;
			default:
				if (isNumeric(res)) {
					if(res > 5) {
						console.log(`Are you sure you want to generate ${res} ideas? (Y/N)`);
						let howSure = prompt("$ ");
						if(howSure.toLowerCase() == 'n') continue;
					}
					await printIdeas(res, "");
				} else 
					console.log("Error: Invalid input try again ");
				break;
		}
		console.log("Would you like to see another idea? (Y/N) ");
		res = prompt("$ ");
		if(res.toLowerCase() == 'n') run = false;
	}
})();

async function printIdeas(limit, genre) {

	const ideas = await getIdea(genre, 0);

	let k = 0;
	for(i = 0; i < ideas.length; i++) {
		if(k >= limit) break;
		if(cachedIdeas.includes(ideas[i])) continue;

		console.log(`${i}.  Alright hear me out ... ${ideas[i]}`);

		cachedIdeas.push(ideas[i]);
		k++;
	}
	checkSave(ideas);
	return 201;
}

async function checkSave(ideas) {
	console.log('\nDo you want to start idea as in-progress? ');
	console.log('Select idea with number or multiple separated by commas or N for no.')
	let idx = prompt("$ ");

	if(idx.toLowerCase() == "n") return;
	
	//Check if input is integer && greater than idea length
	if(!isNumeric(idx) || idx > ideas.length ) {
		console.log('Invalid input');
		return;
	}
	
	idx = [idx];
	let save = [];
	for(let i = 0; i < idx.length; i++)
		save.push({"idea": ideas[i], "inProgress": true});

	const res = await axios({
		method: "post",
		url: API_URL + "/save",
		data: save,
	});
}
function selectGenre(genres) {
	console.log("Select genre by number or N to cancel ");

	let idx = prompt("$ ");
	if(idx.toLowerCase() == "n") return;

	//Check if input is integer && greater than idea length
	if(!isNumeric(idx) || idx > genres.length ) {
		console.log('Invalid input');
		return;
	}

	return idx;
}

async function getIdea(genre, limit) {
	if(!limit) limit = 0;

	const res = await axios({
		method: "get",
		url: API_URL + "/ideas",
		params: {
			limit: limit,
			genre: genre
		},
	});

	return res.data;
}

async function getInProgress(limit) {
	const res = await axios({
		method: "get",
		url: API_URL + "/save",
		params: {
			limit: limit,
		},
	});

	return res.data;
}

async function getGenres(limit) {
	if(!limit) limit = 0;
	const res = await axios({
		method: "get",
		url: API_URL + "/genres",
		params: {
			limit: limit,
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

function sleep(ms) {
	return new Promise((resolve) => {
	  setTimeout(resolve, ms);
	});
  }
