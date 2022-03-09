const mongoose = require('mongoose')

const mongoLocal = "mongodb+srv://oneo3i:oneo3i@cluster0.xeucv.mongodb.net/oneo3i-trial"

mongoose.connect(mongoLocal,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(()=>{
        console.log("Mongodb connected successfully")
    })
    .catch((error)=>{
        console.log(error.message)
    }
)

module.exports = mongoose
