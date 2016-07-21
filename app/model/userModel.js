/**
 * Created by brillwill on 16/7/21.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');

var UserSchema = new Schema({
    username:String,
    password:String,
    name:String,
    sex:String,
    title:String,
    birth:Date,
    org:String
});

UserSchema.statics.secureUserInfo = function (user) {
    var userClone = _.cloneDeep(user);
    userClone.password = null;
    return userClone;
};

module.exports = mongoose.model('User', UserSchema);