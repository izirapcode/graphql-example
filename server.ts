import { ApolloServer, PubSub } from 'apollo-server';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { printSchema } from 'graphql';
import {resolvers} from "./resolvers"; // ✅ Import `printSchema`

// Create PubSub instance
const pubsub = new PubSub();

// Load schema from `schema.graphql` and convert to SDL
const schema = loadSchemaSync('./schema.graphql', {
    loaders: [new GraphQLFileLoader()]
});
const typeDefs = printSchema(schema);

// Create Apollo Server with WebSocket subscriptions
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({ pubsub }),
    subscriptions: {
        path: "/subscriptions",
    },
});

// Start server
server.listen().then(({ url, subscriptionsUrl }) => {
    console.log(`🚀 Server ready at ${url}`);
    console.log(`📡 Subscriptions ready at ${subscriptionsUrl}`);
});
