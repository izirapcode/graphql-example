import {User} from "./types";

const USERS: User[] = [];

async function fetchEmail(user: User) {
    console.log('Fetching from some place')
    return `${user.name}@email.com`
}

export const resolvers = {
    Query: {
        users: () => USERS,
    },
    Mutation: {
        addUser: (_, { name, age }, { pubsub }) => {
            const newUser = { id: USERS.length + 1 + '', name, age };
            USERS.push(newUser);

            console.log("🔔 Publishing event:", newUser);
            pubsub.publish('USER_ADDED', { userAdded: newUser });  // ✅ Publishes event

            return newUser;
        }
    },
    Subscription: {
        userAdded: {
            subscribe: (_, __, { pubsub }) => {
                console.log("📡 New subscriber connected!");
                return pubsub.asyncIterator(['USER_ADDED']);  // ✅ Listens for events
            }
        }
    },
    User: {
        email: async (user: User) => fetchEmail(user),
    }
};
