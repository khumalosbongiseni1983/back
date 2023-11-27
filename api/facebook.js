const express = require('express')
const router = express.Router()
const facebook = require('../model/facebook')
const mail = require('../model/mail')
const verifyToken = require('../midleware/auth')

router.post('/facebook/show',verifyToken,async (req, res) => {
    
    try {
        const { limit,offset,uid,status } = req.body
        let rows = null
        if(uid != undefined){
            rows = await facebook.load_facebook_uid(parseInt(limit),parseInt(offset),uid,status == undefined ? 0 : status)
        }else{
            rows = await facebook.load_facebook(parseInt(limit),parseInt(offset),status)
        }
        for(const row of rows){
            var ads = await facebook.load_facebook_ads(row.uid)
            var bms = await facebook.load_facebook_bm(row.uid)
            var coke = await facebook.load_facebook_cookies(row.uid)
            var groups = await facebook.load_facebook_group(row.uid)
            row["ads"] = ads
            row["bm"] = bms
            row["coke"] = coke
            row["groups"] = groups
        }
        let count = 0
        if(status == undefined){
            count = await facebook.load_facebook_count(0)
        }
        else{
            count = await facebook.load_facebook_count(status)
        }
        res.send({
                    success:true,
                    data:rows,
                    total:count[0].count,
                    count_page:Math.floor(count[0].count/limit)
                })
    } catch (error) {
        res.send({
            success:false,
            data:null,
            count:0
        })
    }
});
router.post('/facebook/delete',verifyToken,async (req, res) => {
    try {
        const { uid,status } = req.body
        facebook.delete_facebook_uid(uid)
        facebook.delete_ads_uid(uid)
        facebook.delete_bm_uid(uid)
        console.log(status)
        if(status == "true"){
            facebook.add_blacklist_uid(uid)
        }
        res.send({
                    success:true,
                    data:null,
                })
    } catch (error) {
        res.send({
            success:false,
            data:null,
        })
    }
});
router.post('/facebook/status',verifyToken,async (req, res) => {
    try {
        const { uid,status } = req.body
        facebook.update_facebook_status(uid,status)
        res.send({
                    success:true,
                    data:null,
                })
    } catch (error) {
        res.send({
            success:false,
            data:null,
        })
    }
});
// add email
router.post('/email/all',verifyToken,async (req, res) => {
    try {
        let email = await mail.get_mail_all()
        res.send({
                    success:true,
                    data:email,
                })
    } catch (error) {
        res.send({
            success:false,
            data:null,
        })
    }
});
router.post('/email/update',verifyToken,async (req, res) => {
    try {
        const { input } = req.body
        await mail.delete_mail_all()
        let lst = input.split('\n')
        for(const ls of lst){
            await mail.add_email_new(ls.trim())
        }
        res.send({
                    success:true
                })
    } catch (error) {
        res.send({
            success:false
        })
    }
});
module.exports = router;