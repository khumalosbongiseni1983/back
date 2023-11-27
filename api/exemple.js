
router.post('/mail/upload',verifyToken,async (req, res) => {
    var textarea = req.body.input
    var rows = textarea.split('\n')
    let count = 0;
    rows.forEach(async (item,index) => {
        var data = item.trim().split('|')
        if(data.length > 2){
            var insert = await mail.insertRows(data[0],data[1],data[2],"new")
            count ++;
        }
    })
    res.send({
        success:true
    })
});
router.post('/mail/get',async (req, res) => {
    let limit = 200
    let count = await mail.countRows()
    count = count[0].count
    var page = req.body.page
    let mails =await mail.getMailRows(page,limit)
    res.send({
        success:true,
        count,
        page,
        data:mails
    }) 
});
router.post('/mail/use',verifyToken,async (req, res) => {
    var new_status = req.body.status
    if(new_status == undefined ){
        new_status ="got_email"
    }
    //reset Data
    resetStatus()
    let data = await mail.getOneMail()
    if(data.length > 0){
        data = data[0]
        console.log("GET __________",JSON.stringify(data))
        await mail.changeStatus(data.id,new_status)
        res.send({
            success:true,
            data
        }) 
    }
    else{
        res.send({
            success:false
        })
    }
});
router.post('/mail/update',verifyToken,async (req, res) => {
    try {
        var _id = req.body.id
        var result =await mail.updateMailWithId(
            req.body.id,
            req.body.email,
            req.body.password,
            req.body.recovery,
            req.body.phone,
            req.body.premium,
            req.body.payment,
            req.body.update_last,
            req.body.youtube,
            req.body.datecreate,
            req.body.device,
            req.body.status,
        )
        console.log("UPDATE __________",JSON.stringify(req.body))
        res.send({
            success:true,
            _id,
        }) 
    } catch (error) {
        console.log("ERROR __________",JSON.stringify(req.body))
        res.send({
            false:false,
            _id,
        }) 
    }
});
router.post('/mail/delete',verifyToken,async (req, res) => {
    mail.deleteRows()
    res.send({
        success:true
    }) 
});
router.post('/mail/save',verifyToken,async (req, res) => {
    var data = await mail.getAlls()
    res.send({
        success:true,
        data
    }) 
});
router.post('/mail/deleteid',verifyToken,async (req, res) => {
    var _id = req.body.id
    var data = await mail.deleteRowsWithId(_id)
    res.send({
        success:true
    }) 
});
router.post('/mail/group',verifyToken,async (req, res) => {
    var mails = req.body.mails
    var items = mails.split('\n');
    for(let i =0 ; i < items.length ;i++){
        var tmp =  items[i].trim().split('|')
        if(tmp.length > 1){
            var temp_mail = await mail.getOneWithMail(tmp[0].trim())
            if(temp_mail != undefined){
                for(let k = 0; k < temp_mail.length; k++){
                    console.log(temp_mail[k])
                    await mail.deleteRowsWithId(temp_mail[k].id)
                }
            }
        }
    }
    res.send({
        success:true
    }) 
});
//hoạn thiện nha
router.post('/mail/key',async (req, res) => {
    var data = await keyhot.getHotkey()
    data = data[0]
    res.send({
        success:true,
        data
    }) 
});
router.post('/mail/updatekey',async (req, res) => {
    var key = req.body.key
    var num = req.body.num
    var data = await keyhot.saveKey(key,num)
    res.send({
        success:true
    }) 
});
router.post('/user/change',async (req, res) => {
    var password = req.body.password //Phatle1122@!
    var newPass = req.body.newPass
    var apiKey = req.body.apikey
    const hash = crypto.createHash('md5').update(password).digest('hex');
    const Pass = crypto.createHash('md5').update(newPass).digest('hex');
    const apiNew = crypto.createHash('md5').update("1918229734"+newPass).digest('hex');
    var tokenResult = await checkApiKey(apiKey)
        if(tokenResult == false){
            res.send({
                success:false,
                msg:"auth failed",
            })
            return
        }

    var data = await member.changePassToken(Pass,apiNew,hash)
    res.send({
        success:true
    }) 
});