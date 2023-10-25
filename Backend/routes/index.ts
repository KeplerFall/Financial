import fastify from 'fastify'

import cors from '@fastify/cors'

export function routes(){
    const server = fastify();
    server.register(cors, {origin: "*"});

    return server;
}