const mongoose = require("mongoose")


const url = process.env.MONGODB_URI

console.log("connecting to", url)
mongoose.set("strictQuery", false)
mongoose.connect(url)
  .then(_result => {
    console.log("connected to MongoDB")
  }).catch((error) => {
    console.log("error connecting to MongoDB:", error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    minlength: 8,
    required: true,
    validate: {
      validator: function (v) {
        const re = /^[0-9]{2,3}-[0-9]+$/
        return re.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
  }
})

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports = mongoose.model("Person", personSchema)