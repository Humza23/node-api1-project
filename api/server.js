// BUILD YOUR SERVER HERE

// IMPORTS AT THE TOP

const { json } = require('express')
const express = require('express')
const User = require('./users/model')

// INSTANCE OF EXPRESS APP
const server = express()

// GLOBAL MIDDLEWARE
server.use(express.json())

// ENDPOINTS

// POST	/api/users	Creates a user using the information sent inside the request body.
server.post('/api/users', (req, res) => {
    if (!req.body.name || !req.body.bio) {
        res.status(400).json({
            message: 'message: "Please provide name and bio for the user"'
        })
    } else {
        User.insert(req.body)
        .then(createdUser => {
            res.status(201).json(createdUser)
        })
    .catch(err => {
        res.status(500).json({
        message: 'message: "There was an error while saving the user to the database"',
        error: err.message
        })
    })
    }
})
// GET	/api/users	Returns an array users.
server.get('/api/users', (req, res) => {
    User.find()
    .then(users => {
        res.json(users)
    })
    .catch(err => {
        res.status(500).json({
            message: 'couldnt get all users',
            error: err.message
        })
    })
})

// GET	/api/users/:id	Returns the user object with the specified id.
server.get('/api/users/:id', (req, res) => {
    User.findById(req.params.id)
    .then(users => {
        if (!users) {
            res.status(404).json({
                message: "The user with the specified ID does not exist"
            })
        }
        res.json(users)
    })
    .catch(err => {
        res.status(500).json({
            message: "The user information could not be retrieved" ,
            error: err.message
        })
    })
})

// DELETE	/api/users/:id	Removes the user with the specified id and returns the deleted user.
server.delete('/api/users/:id', (req, res) => {
    const {id} = req.params
    User.remove(id)
    .then(deletedUser => {
        if (!deletedUser) {
            res.status(404).json({
                message: "The user with the specified ID does not exist"
            })
        } else {
            res.json(deletedUser)
        }
    })
    .catch(err => {
        res.status(500).json({
            message: "The user could not be removed",
            error: err.message
        })
    })
})


// PUT	/api/users/:id	Updates the user with the specified id using data from the request body. Returns the modified user
server.put('/api/users/:id', (req, res) => {
    const possibleUser = User.findById(req.params.id)
    if (!possibleUser) {
        res.status(404).json({
            message: "The user with the specified ID does not exist"
        })
    } else {
        if (!req.body.name || !req.body.bio ) {
            res.status(400).json({
                message: "Please provide name and bio for the user"
            })
        } else {
            User.update(req.params.id, req.body)
            .then(updatedUser => {
                res.status(200).json(updatedUser)
            })
            .catch(err => {
                res.status(500).json({
                    message: "The user could not be removed",
                    error: err.message
                })
            })
        }
    }
})

module.exports = server // EXPORT YOUR SERVER instead of {}