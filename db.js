let mongoosse=require("mongoose")
require("dotenv").config()
let connection=mongoosse.connect(process.env.mongourl)

module.exports={connection}