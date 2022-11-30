const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')


module.exports.login = async function(req, res) {
  const candidate = await User.findOne({email: req.body.email})

  if (candidate)  {
    const passwordResult = bcryptjs.compareSync(req.body.password, candidate.password)
    if (passwordResult) {

      const token = jwt.sign({
        email: candidate.email,
        userId: candidate._id
      }, keys.jwt, {expiresIn: 60 * 60})

      res.status(200).json({
        token: `Bearer ${token}`
      })
    } else {
      res.status(401).json({
        message: 'Password is uncorrect! Try again :)'
      })
    }
  } else {
    res.status(404).json({
      message: 'User with such email is not found' 
    })
  }
}

module.exports.register = async function(req, res) {

  const candidate = await User.findOne({email: req.body.email})

  if (candidate) {
    res.status(409).json({
      message: 'This email has already used!'
    })
  } else {
    const saltjs = bcryptjs.genSaltSync(10)
    const password = req.body.password
    const hash = bcryptjs.hashSync(password, saltjs)
    const user = new User({
      email: req.body.email,
      password: hash
    })

    try {
      await user.save()
      res.status(201).json(user);
    } catch(e) {
      errorHandler(res, e)
    }
  }
}