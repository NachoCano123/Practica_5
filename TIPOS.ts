import mongoose from "npm:mongoose@7.6.3"

export type Client = {
    firstName: string,
    lastName: string,
    email: string, 
    phoneNumber: number,
    DNI: string,
    bookings: Array<mongoose.Types.ObjectId>
}

export type Restaurant = {
    name: string,
    CIF: string,
    address: string, 
    bookings: Array<mongoose.Types.ObjectId>
}

export type Booking = {
    date: Date,
    client: mongoose.ObjectId,
    restaurant: mongoose.ObjectId
}