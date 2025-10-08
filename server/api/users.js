    const router = require('express').Router();
    let User = require('../models/User');
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');

    // Register a new user
    router.route('/register').post(async (req, res) => {
      const { username, password } = req.body;

      try {
        let user = await User.findOne({ username });
        if (user) {
          return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ username, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        res.status(201).json({ msg: 'User registered successfully' });

      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    });

    // Login a user
    router.route('/login').post(async (req, res) => {
      const { username, password } = req.body;

      try {
        let user = await User.findOne({ username });
        if (!user) {
          return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
          user: {
            id: user.id
          }
        };

        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: 360000 },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    });

    module.exports = router;
    
