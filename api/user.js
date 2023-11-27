const express = require('express')
const router = express.Router()
const member = require('../model/user')
const crypto = require('crypto');
router.post('/user/login',async (req, res) => {
    console.log(req.body)
    const { username,password } = req.body
    const hash = crypto.createHash('md5').update(password).digest('hex');
    var result = await member.login(username,hash)
    if(result.length > 0){
        result = result[0]
        delete result.password
        res.send({
            success:true,
            data:result
        }) 
    }else{
        res.send({
            success:false,
            data:null
        }) 
    }
});
module.exports = router;