var express = require('express');
var router = express.Router();
const Auth=require('../middleware/is-auth');
const courseContrroler=require('../Controller/course');
router.get('/list',Auth,courseContrroler.getAllCourses);
router.post('/create',Auth, courseContrroler.postCreateCourse);
router.get('/register',Auth,courseContrroler.getcoursesforstudents);
router.get('/list_student',Auth,courseContrroler.getmycourses);
router.get('/courserating',Auth,courseContrroler.getmycoursesrate);
router.get('/reg/:id/:name',Auth,courseContrroler.register);
router.get('/addDepartment',Auth,courseContrroler.getaddDepartment);
router.post('/addDepartment',Auth, courseContrroler.postaddDepartment);
router.get('/list_instructor',Auth,courseContrroler.getAllinst);
router.get('/storyboard/:id',Auth,courseContrroler.getAddstoryboard);
router.post('/storyboard',Auth,courseContrroler.postAddstoryboard);
router.get('/deletecard/:id',Auth,courseContrroler.deletecard);
router.get('/Liststoryboard',Auth,courseContrroler.getListstoryboard);
router.get('/done/:id',Auth,courseContrroler.donereq);
router.get('/onprogress/:id',Auth,courseContrroler.onprogressreq);
router.get('/todo/:id',Auth,courseContrroler.todoreq);
router.post('/deletee/:id',Auth,courseContrroler.postDeletecourse);
router.get('/deletecourse/:id',Auth,courseContrroler.deletecourse);
router.get('/editcourse/:id',Auth,courseContrroler.getEditcourse);
router.get('/dropcourse/:id',Auth,courseContrroler.dropcourse);
router.post('/editcourse',Auth,courseContrroler.postEditcourse);
router.post('/ratecourse',Auth,courseContrroler.ratecourse);
router.get('/clearenroll',Auth,courseContrroler.clearenroll);
router.get('/enroll/:uid',Auth,courseContrroler.getcoursesforstudenttoenroll);
router.get('/enrollment/:cid/:uid/:type/:rid',Auth,courseContrroler.enroll);
router.get('/studentrequest',Auth,courseContrroler.getenrollreq);
router.get('/rejectreq/:id',Auth,courseContrroler.rejectreq);
router.post('/addWeek',Auth,courseContrroler.postaddWeek);

router.get('/ProjectInfo/:id',Auth,courseContrroler.ProjectInfo);

router.get('/editdepartment/:id',Auth,courseContrroler.geteditdepartment);
router.post('/editdepartment',Auth,courseContrroler.posteditdepartment);
router.get('/deletedepartment/:id',Auth,courseContrroler.getDeletedept);
const adminController = require('../Controller/instructor');
router.get('/addProject/:id',Auth,adminController.getAddproject);
router.post('/addProject',Auth,adminController.postAddproject);
router.get('/ListProject/:id',Auth,adminController.Listproject);
router.post('/deleteee/:id',Auth,adminController.postDeleteproject);
router.get('/editproject/:id',Auth,adminController.getEditproject);
router.post('/editproject',Auth,adminController.postEditproject);
router.get('/req_to_assign',Auth,adminController.getReqests);
router.get('/Accept/:id',Auth,adminController.getAccept);
router.get('/reject/:id',Auth,adminController.getReject);
router.get('/list_course_student/:id',Auth,adminController.ListCourseStudent);
router.post('/sendmail',Auth,adminController.sendmail);
router.get('/requestassign',Auth,adminController.getUnassignedCourses);
router.get('/registercourse/:cname',Auth,adminController.sendAssignReq);
router.get('/assignreq',Auth,adminController.getassignReqests);
router.get('/clearassigns',Auth,adminController.clearassigns);
router.get('/Form/:id',Auth,adminController.getformproject);
router.post('/Form',Auth,adminController.postformproject);
router.get('/Listprojectform/:id',Auth,adminController.listallformproject)
router.get('/courseblog/:id',Auth,courseContrroler.getposts);
router.get('/postdetails/:id',Auth,courseContrroler.getpostdetails);
router.post('/deletepost/:id',Auth,courseContrroler.deletepost);
router.post('/deletecomment/:pid/:cid',Auth,courseContrroler.deletecomment);
router.post('/deletemultiplecourses',Auth,courseContrroler.deletemultiplecourses);
router.post('/addpost',Auth,courseContrroler.addpost);
router.post('/addcomment',Auth,courseContrroler.addcomment); 
router.post('/enrollmultiple/:type',Auth,courseContrroler.enrollmultiple)
router.post('/enrollmultipleadmin/:uid',Auth,courseContrroler.enrollmultipleadmin)
router.post('/registermany',Auth,courseContrroler.registermany);


module.exports = router;