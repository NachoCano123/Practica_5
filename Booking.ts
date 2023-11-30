import mongoose from "npm:mongoose@7.6.3"
import { Booking } from "./TIPOS.ts"
import { restaurantModel } from "./Restaurant.ts"
import { clientModel } from "./Client.ts"

const Schema = mongoose.Schema

const esquemareserva = new Schema({
    date: {type: Date, default: Date()},//Si ha Date no le pasas nada su valor por defecto sera el dia de hoy
    client: {type: mongoose.Schema.ObjectId, required: true, default: null, ref: "Client"},
    restaurant: {type: mongoose.Schema.ObjectId, required: true, default: null, ref: "Restaurant"}
}, {
    timestamps: true,
})

esquemareserva.pre('save', async function() //Usamos la funcion save de pre para guardar el id de la reserva en Client y Restaurant
{
    const cliente = await clientModel.findById(this.client).exec()
    const restaurante = await restaurantModel.findById(this.restaurant).exec()

    if(!cliente || !restaurante)
    {
        throw new Error("Restaurante o cliente no encontrado")
    }

    //Guardamos el id de la reserva en la variable bookings de cliente y restaurante
    cliente.bookings.push(this._id) 
    restaurante.bookings.push(this._id)

    await cliente.save()
    await restaurante.save()
})

esquemareserva.post('deleteOne', async function(doc) 
{
    const cliente = await clientModel.findById(doc.client).exec()
    const restaurante = await restaurantModel.findById(doc.restaurant).exec()
    
    if(!cliente || !restaurante)
    {
        throw new Error("Restaurante o cliente no encontrado")
    }

    //Borramos la reserva del array de reservas del cliente y del restaurante
    cliente.bookings = cliente.bookings.filter(bookingId => bookingId.toString() !== doc._id.toString())
    restaurante.bookings = restaurante.bookings.filter(bookingId => bookingId.toString() !== doc._id.toString())

    await cliente.save()
    await restaurante.save()
})

export type bookingMode1Type = mongoose.Document & Omit<Booking, "id"> 

export const bookingModel = mongoose.model<bookingMode1Type>("Booking", esquemareserva)
