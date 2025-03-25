const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.use(require('./user.routes'));
router.use(require('./maps_data.routes'));

module.exports = router;