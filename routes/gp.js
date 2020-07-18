const express = require('express');
var router = express.Router();
const gpcontroller = require('../Controller/gpController');


router.get('/list',gpcontroller.getAll);
router.get('/myteams',gpcontroller.getmyteams);
router.post('/addreq',gpcontroller.addrequest);
router.get('/add',gpcontroller.getgp);
router.get('/reject/:id',gpcontroller.rejectreq);
router.get('/accept/:id', gpcontroller.acceptreq);
router.get('/delete/:id', gpcontroller.deleterequest);
router.get('/clear', gpcontroller.cleargps);
router.post('/addteam',gpcontroller.addteam);
router.get('/addteams',gpcontroller.getaddgpteam);
router.get('/members',gpcontroller.getteammembers);
router.get('/deletemembers/:id/:member/:newnum/:teamleader',gpcontroller.deletemember);
router.post('/newmember',gpcontroller.addnewmember);



module.exports = router;