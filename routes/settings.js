var express = require('express');
var router = express.Router();
const Auth=require('../middleware/is-auth');
const settingsContrroler=require('../Controller/settings');

router.get('/settings',Auth,settingsContrroler.getAllSettings);
router.post('/settings',Auth, settingsContrroler.postaddsetting);
router.get('/open/:id', settingsContrroler.openoption);
router.get('/close/:id', settingsContrroler.closeoption);
router.get('/clear', settingsContrroler.cleardb);



module.exports = router;
