const { News } = require('./mongodb-connector');
const ObjectId = (require('mongoose').Types.ObjectId);

const resolvers = {
    Query: {
        news: () => {
            return News.find()
        },
    },
    Mutation: {
        upvoteNews: (_, { newsId }) => {
            return News.findByIdAndUpdate (
                { _id : new ObjectId(newsId) },
                { $inc: { votes : 1 }},
                { new : true }
            )

        },
        downvoteNews: (_, { newsId }) => {
            return News.findByIdAndUpdate (
                { _id : new ObjectId(newsId) },
                { $inc: { votes : -1 }},
                { new : true }
            )
        },
        addNews: (root, args) => {
            let newNews = new News({ title: args.title, url: args.url, votes: 0 });
            newNews.save();
            return newNews;
        }
    },
};

module.exports = {
    resolvers
};