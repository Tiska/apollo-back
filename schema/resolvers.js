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
        upvoteNews: (_, {newsId}) => {
            return News.findByIdAndUpdate(
                {_id: new ObjectId(newsId)},
                {$inc: {votes: 1}},
                {new: true}
            )

        },
        downvoteNews: (_, {newsId}) => {
            return News.findByIdAndUpdate(
                {_id: new ObjectId(newsId)},
                {$inc: {votes: -1}},
                {new: true}
            )
        },
        addNews: (root, args) => {
            let newNews = new News({title: args.title, url: args.url, votes: 0});
            newNews.save();
            pubsub.publish('newsAdded', {newsAdded: newNews, newsId: newNews.id});
            return newNews;
        }
    },
    Subscription: {
        newsAdded: {
            subscribe: withFilter(
                () => pubsub.asyncIterator('newsAdded'),
                (payload, variables) => {
                    return payload.newsId === variables.newsId;
                }
            )
        }
    }

};

module.exports = {
    resolvers
};