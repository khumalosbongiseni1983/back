const member = require('../model/user')

async function verifyToken(req, res, next) {
    var tokenResult = await checkApiKey(req.body.apikey)
    if(tokenResult == true){
        next()
    }else{
        return res.sendStatus(401)
    }
}
async function  checkApiKey(apiKey){
    var mer = await member.checkApiToken(apiKey)
    if(mer.length > 0){
        return true
    }else{
        return false
    }
}
module.exports = verifyToken;
