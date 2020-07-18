const express = require('express');
var router = express.Router();
const announcecontroller = require('../Controller/announcements');

// router.get('/announcement', function(req, res, next) {
//     res.render('announcement');
// });
router.post('/add',announcecontroller.postCreateAnnouncement);
router.get('/clear',announcecontroller.clearannounce);
router.get('/announcement',announcecontroller.getannouncements);


module.exports = router;