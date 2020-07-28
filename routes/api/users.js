const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');
const User = require('../../models/User');



// @route     POST api/users
// @desc      Register user
// @access    Public
router.post('/', [
  //express will check if the fields below are not empty
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 })
], async (req, res) => {
  //check to see if there are errors. Will send errors to client so you can error handle message
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
//req.body is where the front end data comes in 
  console.log(req.body)
  //destructure values from req
  const { name, email, password } = req.body;


  //see if user exist in db. Can't have more then 1 user with same email 
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'User already exists' }] });
    }

    //get user's avatar using gravatar 
    const avatar = normalize(
      gravatar.url(email, {
        s: '200', //size
        r: 'pg', //pg img
        d: 'mm' //default image
      }),
      { forceHttps: true }
    );

    //if user does not exist. 
    user = new User({
      name,
      email,
      avatar,
      password
    });

    // encrypt password, more salt the safer it is 
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    //saving user to DB - will return a promise hence await is needed.
    await user.save();

    //creating payload to sign jsonwebtoken
    //you can access user.id because when you safe it to DB the save data is return as a object
    //mongoose has abstractions layer hence why _id from the DB is not use
    const payload = {
      user: {
        id: user.id
      }
    };

    //return jsonwebtoken
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
    //res.send('User route')

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }


});

module.exports = router;

// @route     Get api/users
// @desc      Test Route
// @access    Public

//router.get('/', (req, res) => res.send('user route'));
