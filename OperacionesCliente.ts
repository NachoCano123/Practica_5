import express, {Request, Response} from "npm:express@4.18.2"
import mongoose from "npm:mongoose@7.6.3"

import { clientModel } from "./client.ts"

export const addclient = async(req:Request, res:Response) => {
    try {
        //Aqui solo debe de estar la creacion del modelo cliente. 
        const {firstName, lastName, email, phoneNumber, DNI, bookings} = req.body 

        const char = await clientModel.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        DNI,
        bookings
    })

    res.send({
        firstName,
        lastName,
        email,
        phoneNumber,
        DNI,
        bookings,
        id: char.id,
    })
    } catch (e) {
        res.status(500).send(e)
    }
}

/*
Plantilla de ejemplo para crear cliente
{
    "firstName": "Carlos",
    "lastName": "Martinez",
    "email": "nolose@gmail.com",
    "phoneNumber": "675890233",
    "DNI": "73529451J"
}
*/

export const getclientid = async(req:Request, res:Response) => {
    try {
        const ID = new mongoose.Types.ObjectId(req.params.ID) 
        const cliente = await clientModel.findById(ID).exec()
        res.send(JSON.stringify(cliente))
        if(!cliente)
        {
            res.status(404).send("No se ha encontrado el cliente")
        }
        res.status(200).json(cliente)
    } catch (e) {
        res.status(500).send(e)
    }
}