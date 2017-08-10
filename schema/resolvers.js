const {News} = require('./mongodb-connector');
const ObjectId = (require('mongoose').Types.ObjectId);
const {PubSub, withFilter} = require('graphql-subscriptions');

const pubsub = new PubSub();

const resolvers = {
    Query: {
        news: () => {
            return News.find()
        },
    },
    Mutation: {
        upvoteNews: async (_, {newsId}) => {
            let newsQuery = News.findByIdAndUpdate({_id: new ObjectId(newsId)}, {$inc: {votes: 1}}, {new: true});
            const news = await newsQuery.exec();
            pubsub.publish('newsVoted', {newsVoted: news});
            return news;
        },
        downvoteNews: async (_, {newsId}) => {
            let newsQuery = News.findByIdAndUpdate({_id: new ObjectId(newsId)}, {$inc: {votes: -1}}, {new: true});
            const news = await newsQuery.exec();
            pubsub.publish('newsVoted', {newsVoted: news});
            return news;
        },
        addNews: (root, args) => {
            let newNews = new News({title: args.title, url: args.url, votes: 0});
            newNews.save();
            pubsub.publish('newsAdded', {newsAdded: newNews});
            return newNews;
        }
    },
    Subscription: {
        newsAdded: {
            subscribe: () => pubsub.asyncIterator('newsAdded'),
        },
        newsVoted: {
            subscribe: () => pubsub.asyncIterator('newsVoted'),
        }
    }

};

module.exports = {
    resolvers
};