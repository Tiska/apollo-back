import {makeExecutableSchema} from 'graphql-tools';

const typeDefs = `

type News {
  id: ID!
  title: String
  url: String
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
}

`;

const schema = makeExecutableSchema({ typeDefs });

export default schema;