const mongoose=require("mongoose")

let bookingSchema=mongoose.Schema({

    user : { type:mongoose.Schema.Types.ObjectId, ref: 'users' },
    flight : { type:mongoose.Schema.Types.ObjectId, ref: 'flights' }
   
})

let bookingModel=mongoose.model("Booking",bookingSchema)

module.exports={bookingModel}