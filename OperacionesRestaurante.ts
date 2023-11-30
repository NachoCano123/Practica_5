import express, {Request, Response} from "npm:express@4.18.2"

import { restaurantModel } from "./Restaurant.ts"

export const addrestaurant = async(req:Request, res:Response) => {
    try {
        const {name, CIF, address, bookings} = req.body 

    if(!name || !CIF || !address){
        res.status(500).send("Missing data")
        return
    }

    if(typeof name !== "string" || typeof CIF !== "string" || typeof address !== "string")
    {
        res.status(500).send("Invalid data type")
        return
    }

    const char = await restaurantModel.create({
        name,
        CIF,
        address
    })

    res.send({
        name,
        CIF,
        address,
        bookings,
        id: char.id,
    })
    } catch (e) {
        res.status(500).send(e)
    }
}

/*
Plantilla de ejemplo para crear restaurante
{
    "name": "El restaurante de Carlos",
    "CIF": "J83540275",
    "address": "nolose@gmail.com"
}
*/

export const borrarrestauranteid = async(req:Request, res:Response) => {
    try {
        const idrestaurante = req.params._id
        const restaurante = await restaurantModel.findByIdAndDelete(idrestaurante).exec()
        
        if(!restaurante)
        {
            res.status(404).send("No se ha encontrado el restaurante")
        }

        res.status(200).send("Restaurante borrado exitosamente")
    } catch (e) {
        res.status(500).send(e)
    }
}

export const borrarrestaurantes = async(req:Request, res:Response) => {
    try {
        //https://mongoosejs.com/docs/api/model.html#Model.deleteMany()
        const restaurantesborrados = await restaurantModel.deleteMany().exec()
        if(!restaurantesborrados)
        {
            res.status(404).send("No hay restaurantes para borrar")
        }
    } catch (e) {
        res.status(500).send(e)
    }
}

export const getrestaurantid = async(req:Request, res:Response) => {
    try {
        const idrestaurante = req.params._id
        const restaurante = await restaurantModel.findById(idrestaurante).exec()
        
        if(!restaurante)
        {
            res.status(404).send("No se ha encontrado el restaurante")
        }

        res.send(restaurante)
    } catch (e) {
        res.status(500).send(e)
    }
}
