const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress,graphiqlExpress } = require('apollo-server-express');
const { schema } = require('./schema/index');
const cors = require('cors');
const { execute, subscribe } = require('graphql');
const { createServer } = require('http');
const { SubscriptionServer } = require('subscriptions-transport-ws');

const PORT = 4000;
const app = express();
const ws = createServer(app);

app.use('*', cors({ origin: 'http://localhost:3000' }));

// bodyParser is needed just for POST.
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: schema }));

app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: 'ws://localhost:4000/subscriptions'
}));

ws.listen(PORT, () => {
    // Set up the WebSocket for handling GraphQL subscriptions
    new SubscriptionServer({
        execute,
        subscribe,
        schema
    }, {
        server: ws,
        path: '/subscriptions',
    });
});