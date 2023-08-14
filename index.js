const cookieParser = require("cookie-parser")
let express=require("express")
let app=express()
app.use(express.json())
app.use(cookieParser())
require("dotenv").config()
let bcrypt=require("bcrypt")
let jwt=require("jsonwebtoken")
let {connection}=require("./db")
let {userModel}=require("./model/UserModel")
let {flightModel}=require("./model/FlightModel")
let {bookingModel}=require("./model/BookingModel")

// app.get("/",async(req,res)=>{
//     res.send("hello")
// })

// register route................
app.post("/register",async(req,res)=>{
    try {
        let{name,email,password}=req.body
         let user=await userModel.findOne({email:email})
         if(user){
            res.status(400).send("already registered, please login")
         }
         else{
            bcrypt.hash(password,5,async(err,hash)=>{
            if(hash){
                let data=new userModel({name,email,password:hash})
                await data.save()

                res.status(201).send("new user added")
            }
            else{
               res.status(401).send(err)
            }
            })
         }
        
    } catch (error) {
        res.status(400).send(error.message)
    }
})

// login route........................

app.post("/login",async(req,res)=>{
    try {
        let {email,password}=req.body
        let data=await userModel.findOne({email})
        if(data){
            bcrypt.compare(password,data.password,async(err,result)=>{
               if(result){
                let accessToken=jwt.sign({"userid":data._id},process.env.access)
                console.log(accessToken)
                res.cookie("accessToken",accessToken)

                res.status(201).send({"msg":"login successfull",'token':accessToken})
               }
               else{
                res.status(400).send("wrong credential")
               }
            })
        }
        else{
            res.status(400).send("register first")
        }
        
    } catch (error) {
        res.status(400).send(error.message)
    }
})


// flight routees........................

//   get flight.....
app.get("/flights",async(req,res)=>{
    try {
      let data=await flightModel.find()
      res.status(200).send(data)
    } catch (error) {
       res.status(400).send(error.message)
    }
})
//   get flight by id.....
app.get("/flights/:id",async(req,res)=>{
    try {
        let {id}=req.params
      let data=await flightModel.find({_id:id})
      res.status(200).send(data)
    } catch (error) {
       res.status(400).send(error.message)
    }
})

// add flight....
app.post("/flights",async(req,res)=>{
    try {
        let {airline,flightNo,departure,arrival,departureTime,arrivalTime,seats,price}=req.body
      let data=new flightModel({airline,flightNo,departure,arrival,departureTime,arrivalTime,seats,price})
      await data.save()
      res.status(201).send("new flight added")
    } catch (error) {
       res.status(400).send(error.message)
    }
})
//    edit flight .....
app.patch("/flights/:id",async(req,res)=>{
    let{id}=req.params
    try {
      let data= await flightModel.findByIdAndUpdate({_id:id},req.body)
        res.status(204).send("flight updated")

    } catch (error) {
        res.status(400).send(error.message)  
    }
})

// delete flight ........
app.delete("/flights/:id",async(req,res)=>{
    let{id}=req.params
    console.log(id)
    try {
         await flightModel.findByIdAndDelete({_id:id}) 
         res.status(202).send("flight deleted")
    } catch (error) {
        res.status(400).send(error.message)  
    }
})

//  booking routes..............

app.post("/booking",async(req,res)=>{
    try {
        let {user,flight}=req.body
         
        let data=new bookingModel({user,flight})
        await data.save()

        res.status(201).send("new booking created")

    } catch (error) {
        res.status(400).send(error.message)
    }
})


// dash board route

app.get("/dashboard",async(req,res)=>{
    try {
        let data=await bookingModel.aggregate([
            {
                $lookup:{
                    from:"users",
                    localField:"user",
                    foreignField:"_id",
                    as:"userdata"
                }
            },
            {
                $lookup:{
                    from:"flights",
                    localField:"flight",
                    foreignField:"_id",
                    as:"flightdata"
                }
            }
        ])
        res.status(200).send(data)
        
    } catch (error) {
        res.status(400).send(error.message)
    }
})


app.patch("/dashboard/:id",async(req,res)=>{
    let{id}=req.params
    try {
         await bookingModel.findByIdAndUpdate({_id:id},req.body)
        res.status(204).send("flight updated")

    } catch (error) {
        res.status(400).send(error.message)
    }
})



app.delete("/dashboard/:id",async(req,res)=>{
    let{id}=req.params
    console.log(id)
    try {
         await bookingModel.findByIdAndDelete({_id:id}) 
         res.status(202).send("booking deleted")
    } catch (error) {
        res.status(400).send(error.message)  
    }
})



app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log("server running")
    } catch (error) {
        console.log(error)
    }
})

