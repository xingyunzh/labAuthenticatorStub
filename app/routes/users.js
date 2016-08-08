var express = require('express');
var UserModel = require('../model/userModel');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    UserModel.find({},function (err, docs) {
       if (err){
           res.json({
               status:'E',
               body:err
           });
       }
        else {
           res.json({
               status:'S',
               body:docs
           });
       }
    });
});


/* add new user */
router.post('/add', function (req, res) {
   if (req.body.username && req.body.password && req.body.name && req.body.sex && req.body.birth && req.body.org && req.body.title && req.body.email){
       var user = new UserModel ({
           username:req.body.username,
           password:req.body.password,
           name:req.body.name,
           sex:req.body.sex,
           birth:req.body.birth,
           org:req.body.org,
           title:req.body.title,
           email:req.body.email
       });

       user.save(function (err, doc) {
           if (err){
               res.json({
                   status:'E',
                   body:'DB save error = ' + err
               });
           }else {
               res.json({
                   status:'S',
                   body:doc
               });
           }
       })

   }
    else {
       res.json({
           status:'E',
           body:'Bad param'
       });
   }
});

router.get('/suggestion', function(req, res){
    var key = req.query.key;
    if (key && key.length > 0){
        UserModel.find({$or:[{name:{$regex:key, $options: 'i'}}, {email:{$regex:key, $options:'i'}}]}, function (err,docs) {
            if (err){
                res.json({
                    status:'E',
                    body:'DB save error = ' + err
                });
            }
            else {
                res.json({
                    status:'S',
                    body:docs
                });
            }
        });
    }
    else {
        res.json({
            status:'E',
            body:'Bad param'
        });
    }
});

router.post('/verify', function (req, res) {
   if (req.body.username && req.body.password){
       UserModel.findOne({username:req.body.username}, function (err, doc) {
           if (err) {
               res.json({
                   status:'E',
                   body:'DB query error = ' + err
               });
           }else {
               res.json({
                   status:'S',
                   body: doc.password === req.body.password ? UserModel.secureUserInfo(doc) : null
               });
           }
       })
   }else {
       res.json({
           status:'E',
           body:'Bad param'
       });
   }
});

router.get('/getbyid/:id', function (req, res) {
    if (req.params.id) {
        UserModel.findById(req.params.id, function (err, doc) {
            if (err){
                res.json({
                    status:'E',
                    body:'DB query error = ' + err
                });
            }
            else {
                res.json({
                    status:'S',
                    body:UserModel.secureUserInfo(doc)
                })
            }
        });
    }else {
        res.json({
            status:'E',
            body:'Bad param'
        });
    }
});

router.get('/removebyid/:id', function(req, res){
    if (req.params.id) {
        UserModel.findByIdAndRemove(req.params.id, function (err, doc) {
            if (err){
                res.json({
                    status:'E',
                    body:'DB query error = ' + err
                });
            }
            else {
                res.json({
                    status:'S',
                    body:UserModel.secureUserInfo(doc)
                })
            }
        });
    }else {
        res.json({
            status:'E',
            body:'Bad param'
        });
    }
})


module.exports = router;
