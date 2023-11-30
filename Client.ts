import mongoose from "npm:mongoose@7.6.3"
import { Client } from "./TIPOS.ts"
import { restaurantModel } from "./Restaurant.ts";
import { bookingModel } from "./Booking.ts";

const Schema = mongoose.Schema

const esquemacliente = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phoneNumber: {type: Number, unique: true},
    DNI: {type: String, required: true, unique: true},
    bookings: [{type: mongoose.Schema.ObjectId, required: true, ref: "Bookings",}]
}, {
    timestamps: true,
})

//Comprobar que el email que se introduzca tenga formato example@example.com
esquemacliente.path('email').validate(function(miemail){
    const formato_email = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
    if(formato_email.test(miemail) === false)
    {
        throw new Error("Email no valido")
    }
    return true
})

esquemacliente.path('phoneNumber').validate(function(miphoneNumber){
    const phoneNumberString = miphoneNumber.toString()
    const numerodigitos = phoneNumberString.length

    if (numerodigitos !== 9) 
    {
        throw new Error("Numero de telefono no valido")
    }
    return true
}) 

//Fuente: https://donnierock.com/2011/11/05/validar-un-dni-con-javascript/
esquemacliente.path('DNI').validate(function(miDNI){
    const formato_DNI = /^\d{8}[A-Z]$/

    if (formato_DNI.test(miDNI) === false) {
        throw new Error("El DNI debe tener 8 numeros seguidos de una letra")
    }
    return true
})

esquemacliente.pre('deleteOne', async function () {
    //borrar las reservas cuyo id este en el array bookings de cliente
    //usamos deleteMany para borrar las reservas que cumplan con este criterio
    const restaurante = await restaurantModel.findById(this.restaurant).exec()

    await bookingModel.deleteMany({ _id: { $in: this.bookings } })

    //Hacemos lo mismo con la variable bookings de cliente
    await restaurantModel.deleteMany({ _id: { $in: restaurante?.bookings}})
    await this.bookings.save()
})

export type clientMode1Type = mongoose.Document & Omit<Client, "id"> 

export const clientModel = mongoose.model<clientMode1Type>("Client", esquemacliente)