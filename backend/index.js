require("dotenv").config();
const fs = require("fs");
const mongoose = require('mongoose');
const axios = require("axios");
const prompt = require("prompt-sync")();
const AllIdeas = require("./models/ideasSchema");
const express = require("express");
const { resolve4 } = require("dns/promises");
const { format } = require("path");
const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());

let savedIdeas = [];
const PARTNER_API = "https://portfolio.tincaniam.com/projects"

mongoose.connect(`mongodb+srv://root:${process.env.PASSWORD}@cluster0.nu5wqgm.mongodb.net/IdeaGenerator?retryWrites=true&w=majority`, {
   useNewUrlParser: true,
   useUnifiedTopology: true
});


app.get("/", (req, res) => {
	res.send("App is healthy");
});

app.get('/genres', async (req, res) => {
	const { limit } = req.query;

	let genres = await AllIdeas.find().select("genre -_id").limit(limit);

	for(let i = 0; i < genres.length; i++)
		genres[i] = genres[i].genre;

	console.log('GET /genres: ', genres);

	res.send(genres);
});

//Takes params limit(Integer), genre(String) && returns array of ideas
app.get("/ideas", async (req, res) => {
	const { limit, genre } = req.query;
	console.log(`params: ${limit}, ${genre}`);
	
	let ideas;
	if(!genre)
		ideas = await AllIdeas.find({}).select("idea -_id").limit(limit);
	else
		ideas = await AllIdeas.find({"genre": genre}).select("idea -_id").limit(limit);
	console.log('returned ideas: ', ideas);

	for(let i = 0; i < ideas.length; i++)
		ideas[i] = ideas[i].idea;

	console.log('GET /ideas: ', ideas);
	res.send(ideas);
});

//Takes param limit && returns array of inProgress ideas
app.get("/save", async (req, res) => {
	const { limit } = req.query;
	let retIdeas = [];

	const ideas = await axios({
		method: "get",
		url: PARTNER_API + "/",
	});

	for(let i=0; i < ideas.data.length; i++) {
		if(ideas.data[i].status == "In Progress")
			retIdeas.push(ideas.data[i].description);
	}

	console.log('GET /save: ', retIdeas);
	res.send(retIdeas);
});

//takes an array of objects with two values idea(String) && inProgress(Boolean)
app.post("/save", async (req, res) => {
	const ideas = req.body;
	console.log("Saving: ", ideas);

	let projRes;
	let modifiedCount = 0;
	
	//get today's date in mm-dd-yy format
	const today = new Date();
	const yy = today.getFullYear().toString().slice(2);
	let mm = today.getMonth() + 1; // Months start at 0!
	let dd = today.getDate();
	if (dd < 10) dd = '0' + dd;
	if (mm < 10) mm = '0' + mm;
	const formattedToday = `${mm}-${dd}-${yy}`;
	console.log('format date: ', formattedToday);

	for(let i=0; i < ideas.length; i++) {
		const project = {
			name: ideas[i].idea, 
			status: "In Progress", 
			description: ideas[i].idea, 
			date: formattedToday
		};

		projRes = await axios({
			method: "post",
			url: PARTNER_API + "/",
			data: project,
		});
		console.log(`POST /save: \n ${project.description} \n ${project.date} \nwith status ${projRes.status}`);
		modifiedCount++;
	}

	res.send({"modifiedCount": modifiedCount});
});

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}
