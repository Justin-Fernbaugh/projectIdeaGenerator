require("dotenv").config();
const fs = require("fs");
const prompt = require("prompt-sync")();
const express = require("express");
const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());

const ideas = [
	"Uber but on the blockchain.",
	"A search engine but for privacy.",
	"Doordash but delivered by wind animals.",
];

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.get("/idea", (req, res) => {
	const limit = req.query.limit;
	let resIdeas = [];
	for(let i = 0; i < limit; i++) {
		const randInt = getRandomInt(ideas.length);
		resIdeas.push('Alright hear me out ... ' + ideas[randInt]);
	}

	// const idea = 'Alright hear me out ... ' + ideas[getRandomInt(ideas.length)];
	console.log(resIdeas);
	res.send(resIdeas);
});

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}
