const { sendNotification } = require('../controllers/notification');

const router = require('express').Router();

router.post('/', sendNotification );

module.exports = router;