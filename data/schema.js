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

# we need to tell the server which types represent the root query
# and root mutation types. We call them RootQuery and RootMutation by convention.
schema {
  query: Query
  mutation: Mutation
}

`;

const schema = makeExecutableSchema({ typeDefs });

export default schema;