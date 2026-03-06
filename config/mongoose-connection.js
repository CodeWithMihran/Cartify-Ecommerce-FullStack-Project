const mongoose = require('mongoose');
const dbgr = require('debug')("development:mongoose");

mongoose.connect(process.env.MONGODB_URI)

.then(function(){
    dbgr("Connected");
})

.catch(function(err){
    console.log(err);
})

module.exports = mongoose.connection;