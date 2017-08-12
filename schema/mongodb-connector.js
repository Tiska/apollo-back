const Mongoose = require('mongoose');
const ObjectId = (require('mongoose').Types.ObjectId);
const mongo = Mongoose.connect('mongodb://localhost:27017/news');

const NewsSchema = Mongoose.Schema({
    votes: Number,
    url: String,
    title: String,
});

const News = Mongoose.model('news', NewsSchema);

module.exports = { News };