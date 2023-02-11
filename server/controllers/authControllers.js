const User = require('../model/authModel')
const jwt = require('jsonwebtoken')
const userSchema = require('../model/authModel')

const maxAge = 3 * 24 * 60 * 60
const createToken = (id) => {
  return jwt.sign({ id }, 'kishan sheth super secret key', {
    expiresIn: maxAge,
  })
}

const handleErrors = (err) => {
  let errors = { email: '', password: '' }

  console.log(err)
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered'
  }

  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect'
  }

  if (err.code === 11000) {
    errors.email = 'Email is already registered'
    return errors
  }

  if (err.message.includes('Users validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message
    })
  }

  return errors
}

module.exports.register = async (req, res, next) => {
  try {
    const { email, password, username, course } = req.body
    const user = await User.create({ email, password, username, course })
    const token = createToken(user._id)

    res.cookie('jwt', token, {
      withCredentials: true,
      httpOnly: false,
      maxAge: maxAge * 1000,
    })

    res.status(201).json({ user: user._id, created: true })
  } catch (err) {
    console.log(err)
    const errors = handleErrors(err)
    res.json({ errors, created: false })
  }
}

module.exports.login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.login(email, password)
    const token = createToken(user._id)
    res.cookie('jwt', token, { httpOnly: false, maxAge: maxAge * 1000 })
    res.status(200).json({ user: user._id, status: true })
  } catch (err) {
    const errors = handleErrors(err)
    res.json({ errors, status: false })
  }
}

module.exports.adduser = async (req, res, next) => {
  console.log(req.body)
  userSchema.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      console.log(req.body)
      res.json(data)
    }
  })
}
module.exports.viewuser = async (req, res, next) => {
  userSchema.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      console.log(req.body)
      res.json(data)
    }
  })
}
module.exports.deleteuser = async (req, res, next) => {
  userSchema.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.status(200).json({
        msg: data,
      })
    }
  })
}
module.exports.getbyId = async (req, res, next) => {
  userSchema.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
}
module.exports.updateuser = async (req, res, next) => {
  userSchema.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    (error, data) => {
      if (error) {
        return next(error)
      } else {
        res.json(data)
      }
    },
  )
}
