const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress,graphiqlExpress } = require('apollo-server-express');
const { schema } = require('./schema/index');

const PORT = 3000;
const app = express();

// bodyParser is needed just for POST.
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: schema }));

app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql'
}));

app.listen(PORT);