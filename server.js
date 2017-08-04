const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress,graphiqlExpress } = require('apollo-server-express');
const { schema } = require('./schema/index');
const cors = require('cors');

const PORT = 3000;
const app = express();

app.use('*', cors({ origin: 'http://localhost:3001' }));

// bodyParser is needed just for POST.
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: schema }));

app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql'
}));

app.listen(PORT);