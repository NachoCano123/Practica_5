import mongoose from "npm:mongoose@7.6.3"
import { Restaurant } from "./TIPOS.ts"
import { bookingModel } from "./Booking.ts";
import { clientModel } from "./Client.ts";

const Schema = mongoose.Schema

const esquemarestaurante = new Schema({
    name: {type: String, required: true, unique:true},
    CIF: {type: String, required: true, unique: true},
    address: {type: String, required: true},
    bookings: [{type: mongoose.Schema.ObjectId, required: true, ref: "Bookings",}]
}, {
    timestamps: true,
})

esquemarestaurante.path('CIF').validate(function(miCIF){
    const formato_CIF = /^[A-HJNPQRSUVW]{1}[0-9]{7}[0-9A-J]$/
    if(formato_CIF.test(miCIF) === false)
    {
        throw new Error("Formato de CIF no valido")
    }
})

esquemarestaurante.pre('deleteMany', async function () {
    //borrar las reservas cuyo id este en el array bookings de restaurante
    //usamos deleteMany para borrar las reservas que cumplan con este criterio
    const cliente = await clientModel.findById(this.client).exec()

    await bookingModel.deleteMany({ _id: { $in: this.bookings } })

    //Hacemos lo mismo con la variable bookings de cliente
    await clientModel.deleteMany({ _id: { $in: cliente?.bookings}})
    await this.bookings.save()
})

export type restaurantMode1Type = mongoose.Document & Omit<Restaurant, "id"> 

export const restaurantModel = mongoose.model<restaurantMode1Type>("Restaurant", esquemarestaurante)
