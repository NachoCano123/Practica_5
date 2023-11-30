import express from "npm:express@4.18.2"
import mongoose from "npm:mongoose@7.6.3"

import {load} from "https://deno.land/std@0.204.0/dotenv/mod.ts"
import { addclient, getclientid } from "./OperacionesCliente.ts"
import { addreserva, borrarreservaid, getreservaid } from "./OperacionesReserva.ts"
import { addrestaurant, borrarrestauranteid, borrarrestaurantes, getrestaurantid } from "./OperacionesRestaurante.ts"

const env= await load()

let MONGO_URL= env.MONGO_URL || Deno.env.get("MONGO_URL")

const PORT= env.PORT || Deno.env.get("PORT") || 3000

if (!MONGO_URL) {
  MONGO_URL="mongodb+srv://nacho:12345@cluster0.3aayvs9.mongodb.net/Practica5?retryWrites=true&w=majority"
}

try {
  await mongoose.connect(MONGO_URL)
  console.log("Conectado con exito a la base de datos")

  const app=express()
  app.use(express.json())

  //Endpoints cliente
  app.post("/client", addclient)

  app.get("/client/:ID", getclientid)

  //Endpoints restaurante
  app.post("/restaurant", addrestaurant)

  app.get("/restaurant/:_id", getrestaurantid)

  app.delete("/restaurant/:_id", borrarrestauranteid)

  app.delete("/restaurants", borrarrestaurantes)

  //Endpoints reserva
  app.post("/booking", addreserva)

  app.get("/booking/:_id", getreservaid)

  app.delete("/booking/:_id", borrarreservaid)

  app.listen(PORT, ()=> {
    console.log("Escuchando por el puerto " + PORT)
  })

} catch (e) {
  console.error(e)
}
