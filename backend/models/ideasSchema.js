const mongoose = require('mongoose');

const ideasSchema = new mongoose.Schema({
	idea: {type: String},
	genre: {type: String},
	inProgress: {type: Boolean}
}, { collection: 'ideas' });

 const Ideas = mongoose.model("ideas", ideasSchema);
 module.exports = Ideas;
