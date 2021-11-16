/* eslint-disable @typescript-eslint/indent */
/* eslint-disable prettier/prettier */
import { createAuth } from '@keystone-next/auth';
import { config, createSchema } from '@keystone-next/keystone/schema';
import { withItemData, statelessSessions } from '@keystone-next/keystone/session';
import { User } from './schemas/User';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
import 'dotenv/config';

const databaseURL =
    process.env.DATABASE_URL || 'mongodb://localhost/keystone-sick-fits-tutorial';

const sessionConfig = {
    maxAge: 60 * 60 * 24 * 360, // how long should user stay signed in
    secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
    // we use User bc its the user that logs in -- could be customer, company, etc
    listKey: 'User',
    identityField: 'email',
    secretField: 'password',
    initFirstItem: {
        fields: ['name', 'email', 'password'],
        // todo add intial roles here
    }
});

// boilerplate

export default withAuth(config({
    server: {
        cors: {
            origin: [process.env.FRONTEND_URL],
            credentials: true,
        },
    },
    db: {
        adapter: 'mongoose',
        url: databaseURL,
        // add data seeding here
    },
    lists: createSchema({
        // schema items go here
        User,
        Product,
        ProductImage,
    }),
    ui: {
        // show ui only for people who have session and are logged in
        isAccessAllowed: ({ session }) =>
            // console.log(session);
            !!session?.data
        ,
    },
    session: withItemData(statelessSessions(sessionConfig), {
        // graphql query
        User: 'id',
    }),
})
);
