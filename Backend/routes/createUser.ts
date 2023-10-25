import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import { Resend } from 'resend';
import { User } from "../typings/User";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function createUser(request: FastifyRequest, reply:FastifyReply) {
    const {email, password, name} = request.body as User;

    if(name.length < 3 || !name){
        reply.status(400);
        return {status: 400, error: "Invalid name, must have more than 3 characters"}
    }

    if(!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)){
        reply.status(400)
        return {status: 400, error: "Invalid Email"}
    }

    if(!password || password.length < 4){
        reply.status(400)
        return {status: 400, error: "Password must be longer than 3 characters"}
    }

    const prisma = new PrismaClient();

    const query = await prisma.user.findMany({where: {email: email}});

    if(query.length > 0){
        reply.status(409)
        return{status: 409, error: "Email already exists."}
    }

    const creation = await prisma.user.create({data: {name: name, email: email, password: password} });
    console.log(creation)

    await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: [email],
        subject: "Obrigado por se cadastrar.",
        html: `<p>Olá ${name}, obrigado por se cadastrar no nosso app, sua conta ja foi criada e pode ser acessada.</p>`
    })

    reply.status(200);
    return{staus: 200}
}