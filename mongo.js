const mongoose = require('mongoose')

const password = `programing.123`

const url = `mongodb+srv://Dragisa:${password}@cluster0.4yrpbia.mongodb.net/?retryWrites=true&w=majority`

const personsSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    number: String
})

const Person = mongoose.model('Person', personsSchema)

mongoose.connect(url)
.then((result) => {
    console.log(`connected with database`)
})
.then(() => {
    console.log(`person saved!`)
    return mongoose.connect.close()
})
.catch((error) => console.log(error))

Person.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})
