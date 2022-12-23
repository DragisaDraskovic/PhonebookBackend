const express = require('express')
const app = express()
require('dotenv').config()
const Person = require('./models/person')
const cors = require('cors')

app.use(cors())

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }

app.use(express.json())
app.use(requestLogger) 
app.use(express.static('build'))

const PORT = process.env.PORT

// radi
app.get('/', (request,response) => {
    response.send('<h1>Radi</h1>')
})

// neradi!!! sada radi!
app.get('/api/persons', (request,response) => {
    Person.find({}).then(persons => {
    response.json(persons)
    })
})

// ovo ne vraca kako treba ali radi
app.get('/api/info', (request, response) => {
    const fields = Person.length
    const date = new Date()
    response.send(`<p>Person has ${fields} fields on date </p> <p>${date}</p>`)
})

// radi  
app.get('/api/persons/:id', (request, response, next) => {
    Person
    .findById(request.params.id)
    .then(person => {
        if(person) {
            response.json(person)
        } else {
            response.status(404).end()
        }                  
    })
    .catch(error => {
        next(error)
    })
})

 
//radi ali samo iz testova iz VSA! Radi ali moras iz baze izvuci jebeni ID!
app.delete('/api/persons/:id', (request, response, next) => {
   Person.findByIdAndRemove(request.params.id)
   .then(result => {
    response.status(204).end()
   })
   .catch(error => next(error))
})
  
//radi
app.post('/api/persons', (request, response) => {
    const body = request.body

    if(body.number === undefined || body.name === undefined) {
        return response.status(400).json({error: `name or numbers missing`})
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

//radi
app.put('/api/persons/:id', (request, response, next) => {
    //Poslednji update
    // const body = request.body

    // const note = {
    //     name: body.name,
    //     number: body.number
    // }

    const {name, number} = request.body

    Person.findByIdAndUpdate(
        request.params.id, 
        {name, number},
        { new: true, runValidators: true, context: 'query'})
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})  

const unknownEndPoint = (request, response) => {
    response.status(404).send({
        error: `Unknown endpoint`
    })
}

app.use(unknownEndPoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message})
    }
  
    next(error)
  }
  
  app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
