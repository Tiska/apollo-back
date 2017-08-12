const typeDefs = `

type News {
  id: ID!
  title: String
  url: String!
  votes: Int
}

# the schema allows the following query:
type Query {
  news: [News]
}

# this schema allows the following mutation:
type Mutation {
  upvoteNews (
    newsId: ID!
  ): News
  
  downvoteNews (
    newsId: ID!
  ): News
  
  addNews(url: String!, title: String, votes: Int): News
}

type Subscription {
  newsAdded: News
  newsVoted: News
}

schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}

`;

module.exports = {
    typeDefs
};