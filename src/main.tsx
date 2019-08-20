import React from 'react';
import ReactDOM from 'react-dom';

import gql from 'graphql-tag';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider, useQuery } from 'react-apollo';

const TYPE_DEFS = gql`
type RecentLog {
    name: String!
    text: String!
}
extend type Query {
    recentLog: RecentLog!
}
`;
const QUERY = gql`
query TestQuery {
    recentLog @client {
        name
        text
    }
}
`;

interface RecentLogData {
    __typename?: 'RecentLog',
    name: string;
    text: string;
}
interface Query {
    recentLog: RecentLogData;
}

const RecentLog: React.FC = () => {
    const result = useQuery<Query>(QUERY, {
        notifyOnNetworkStatusChange: true
    });

    let body;
    if (result.loading) {
        body = <p>Loading...</p>;
    } else if (result.error) {
        body = <p>Error: {JSON.stringify(result.error)}</p>;
    } else {
        body = <p>name: {result.data!.recentLog.name}, text: {result.data!.recentLog.text}</p>;
    }

    return (
        <>
            {body}
            <p><button onClick={() => result.refetch()}>Refetch</button></p>
        </>
    );
};

const App: React.FC<{ client: ApolloClient<unknown> }> = ({ client }) => {
    return (
        <ApolloProvider client={client}>
            <RecentLog />
        </ApolloProvider>
    );
};

let nextRaiseErrorFlag = false;
let callCount = 0;
// local resolver (for each calls, returns individual (different) value or throws an error)
function recentLogResolver(): RecentLogData {
    const raiseErrorFlag = nextRaiseErrorFlag;

    // update status
    nextRaiseErrorFlag = !nextRaiseErrorFlag;
    ++callCount;

    console.log(`** recentLogResolver called: callCount = ${callCount}, raiseErrorFlag = ${raiseErrorFlag}`);
    if (raiseErrorFlag) {
        // if error with same message is thrown, 'loading' keeps true
        throw new Error(`Something occurred.`);
        // if error with different message is thrown, 'loading' changes to false
        // throw new Error(`Something occurred. (callCount = ${callCount})`);
    }
    return {
        __typename: 'RecentLog',
        name: 'Anonymous',
        text: `Hello, world! (callCount = ${callCount})`
    };
}

function main() {
    // initialize ApolloClient with local resolver
    const cache = new InMemoryCache();
    const client = new ApolloClient({
        cache: cache,
        resolvers: {
            Query: {
                recentLog: recentLogResolver
            }
        },
        typeDefs: TYPE_DEFS
    });

    ReactDOM.render(<App client={client} />, document.getElementById('root'));
}

main();
