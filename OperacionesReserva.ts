import express, {Request, Response} from "npm:express@4.18.2"
import { bookingModel } from "./Booking.ts"

export const addreserva = async(req:Request, res:Response) => {
    try {
    const {date, client, restaurant} = req.body 

    const char = await bookingModel.create({
        date,
        client,
        restaurant,
    })

    res.send({
        date,
        client,
        restaurant,
        id: char.id,
    })
    } catch (e) {
        res.status(500).send(e)
    }
}

/*
Plantilla de ejemplo para crear restaurante
{
    "date": "5/21/2023", (mes/dia/año)
    "client": "6564f63b8b6acc9083501c58",
    "restaurant": "6564f9d793218f0ffbe24b49"
}
*/

export const borrarreservaid = async(req:Request, res:Response) => {
    try {
        const idreserva = req.params._id
        const reserva = await bookingModel.findByIdAndDelete(idreserva).exec()
        
        if(!reserva)
        {
            res.status(404).send("No se ha encontrado la reserva")
        }

        res.status(200).send("Reserva borrada exitosamente")
    } catch (e) {
        res.status(500).send(e)
    }
}

export const getreservaid = async(req:Request, res:Response) => {
    try {
        const idreserva = req.params._id
        const reserva = await bookingModel.findById(idreserva).exec()
        
        if(!reserva)
        {
            res.status(404).send("No se ha encontrado la reserva")
        }

        res.status(200).send(reserva)
    } catch (e) {
        res.status(500).send(e)
    }
}
