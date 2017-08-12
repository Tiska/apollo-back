const {News} = require('./mongodb-connector');
const ObjectId = (require('mongoose').Types.ObjectId);
const {PubSub, withFilter} = require('graphql-subscriptions');
const rp = require('request-promise-native');
const cheerio = require('cheerio');

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
        addNews: async (root, args) => {

            let title = 'No title';

            try {
                if(!args.title){
                    let body = await rp(args.url);
                    let $ = cheerio.load(body);
                    title = $("title").text();
                }
            }
            catch(e) {
                console.log('there was an error getting title page');
            }

            let newNews = new News({title: args.title ? args.title : title, url: args.url, votes: 0});
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