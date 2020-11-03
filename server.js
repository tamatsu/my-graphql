require('dotenv').config()

const { schema, rootValue } = require('./model.js')

const express = require('express')
const app = express()

const jwt = require('express-jwt')

const { graphqlHTTP } = require('express-graphql')

const cookieParser = require('cookie-parser')


// GraphQL
app.use('/', cookieParser(), jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  getToken: req => {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      // OAuth2.0 Bearer token https://oauth.net/2/bearer-tokens/
      return req.headers.authorization.split(' ')[1]
    }
    else if (req.cookies) {
      // Cookie
      return req.cookies.token
    }
    else {
      // failed
      return null      
    }
  }
}), (req, res, next) => {
  graphqlHTTP({
    schema: schema(),
    rootValue: rootValue(req.user.id),
    graphiql: true
  })(req, res, next)
})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port)
})
