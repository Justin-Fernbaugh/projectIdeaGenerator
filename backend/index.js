require("dotenv").config();
const fs = require("fs");
const mongoose = require('mongoose');
const prompt = require("prompt-sync")();
const AllIdeas = require("./models/ideasSchema");
const express = require("express");
const { resolve4 } = require("dns/promises");
const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());

let savedIdeas = [];

mongoose.connect(`mongodb+srv://root:${process.env.PASSWORD}@cluster0.nu5wqgm.mongodb.net/IdeaGenerator?retryWrites=true&w=majority`, {
   useNewUrlParser: true,
   useUnifiedTopology: true
});


app.get("/", (req, res) => {
	res.send("App is healthy");
});

//Takes params limit(Integer), genre(String) && returns array of ideas
app.get("/ideas", async (req, res) => {
	const { limit, genre } = req.query;
	let ideas;
	if(!genre)
		ideas = await AllIdeas.find({}).select("idea -_id").limit(limit);
	else
		ideas = await AllIdeas.find({"genre": genre}).select("idea -_id").limit(limit);

	for(let i = 0; i < ideas.length; i++)
		ideas[i] = ideas[i].idea;

	res.send(ideas);
});

//Takes param limit && returns array of inProgress ideas
app.get("/save", async (req, res) => {
	const { limit } = req.query;

	const ideas = await AllIdeas.find({"inProgress": true}).select("idea -_id").limit(limit);

	for(let i = 0; i < ideas.length; i++)
		ideas[i] = ideas[i].idea;

	console.log('GET /save: ', ideas);
	res.send(ideas);
});

//takes an array of objects with two values idea(String) && inProgress(Boolean)
app.post("/save", async (req, res) => {
	const ideas = req.body;
	console.log("Saving: ", ideas);

	let modifiedCount = 0;
	for(let i = 0; i < ideas.length; i++) {
		const response = await AllIdeas.updateOne({"idea": ideas[i].idea},
			{ "inProgress": ideas[i].inProgress }
		);
		modifiedCount += response.modifiedCount;
	}

	res.send({"modifiedCount": modifiedCount});
});

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}
