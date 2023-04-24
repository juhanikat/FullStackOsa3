require("dotenv").config()
const Person = require("./models/person.js")

const express = require("express")
const cors = require("cors")
var morgan = require("morgan")

const app = express()
app.use(cors())
app.use(express.static("build"))
app.use(express.json()) // this has to be before the morgan stuff

morgan.token("body", function (req, _res) { return JSON.stringify(req.body) })
morgan = morgan(":method :url :status - :response-time ms - :body")
app.use(morgan)




app.get("/info", (_req, res, next) => {
  Person.find({})
    .then(result => {
      const amount = result.length
      const date = Date()
      res.send(`<p>Phonebook has info for ${amount} people</p><p>${date}</p>`)
    })
    .catch(error => next(error))
})

app.get("/api/persons", (_req, res, next) => {
  Person.find({})
    .then(result => {
      res.json(result)
    })
    .catch(error => next(error))
})


app.get("/api/persons/:id", (req, res, next) => {
  Person
    .findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})


app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(_result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})


app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body

  Person.findByIdAndUpdate(req.params.id, { name, number }, { new: true, runValidators: true, context: "query" })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})


app.post("/api/persons", (req, res, next) => {
  const body = req.body

  Person.find({ name: body.name })
    .then(result => {
      if (result.length > 0) {
        return res.status(400).json({
          error: "name must be unique"
        })
      } else {
        const person = new Person({
          name: body.name,
          number: body.number
        })
        person.save()
          .then(savedPerson => res.json(savedPerson))
          .catch(error => next(error))
      }
    })
    .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoint)


const errorHandler = (error, _req, res, next) => {
  console.error(error.message)
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return res.status(404).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})