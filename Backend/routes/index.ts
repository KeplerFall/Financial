import fastify from 'fastify'
import { createUser } from './createUser';

import cors from '@fastify/cors'

export function routes(){
    const server = fastify();
    server.register(cors, {origin: "*"});

    server.post("/createuser", async (request, reply)=> {return await createUser(request, reply)})

    return server;
}