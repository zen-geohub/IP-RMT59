const express = require('express');
const { authentication } = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/test', (req, res) => {
  res.send('Hello World!');
});

router.use(require('./user.routes'));
router.use(require('./maps_data.routes'));
router.use(authentication, require('./userplaces.routes'));

module.exports = router;