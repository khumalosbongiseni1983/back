const db = require('../untils/db')
async function check_facebook(user_id) {
    return new Promise((resolve, reject) => {
        db.dbConn.query('SELECT COUNT(*) AS count FROM facebook WHERE `uid`=?',[user_id], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
async function check_facebook_birth(user_id) {
    return new Promise((resolve, reject) => {
        db.dbConn.query('SELECT * FROM facebook WHERE `uid`=? LIMIT 1',[user_id], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function insert_facebook(uid,country) {
    return new Promise((resolve, reject) => {
        db.dbConn.query('INSERT INTO `facebook`(`uid`,`country`) VALUES (?,?)',[uid,country], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function check_facebook_cookie(uid) {
    return new Promise((resolve, reject) => {
        db.dbConn.query('SELECT id,timestemp FROM coke WHERE `uid`=? ORDER BY timestemp ASC',[uid], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function insert_facebook_cookie(uid,cookie) {
    return new Promise((resolve, reject) => {
        db.dbConn.query('INSERT INTO `coke`(`uid`,`cookie`) VALUES (?,?)',[uid,cookie], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function delete_facebook_cookie(id) {
    return new Promise((resolve, reject) => {
        db.dbConn.query('DELETE FROM `coke` WHERE `id`=?',[id], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function delete_facebook_uid(uid) {
    return new Promise((resolve, reject) => {
        db.dbConn.query('DELETE FROM `facebook` WHERE `uid`=?',[uid], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function update_facebook_status(userId,status) {
    return new Promise((resolve, reject) => {
        db.dbConn.query('UPDATE `facebook` SET `status`=? WHERE `uid`=?',[status,userId], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function delete_ads_uid(uid) {
    return new Promise((resolve, reject) => {
        db.dbConn.query('DELETE FROM `ads` WHERE `uid`=?',[uid], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function delete_bm_uid(uid) {
    return new Promise((resolve, reject) => {
        db.dbConn.query('DELETE FROM `bm` WHERE `uid`=?',[uid], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function update_facebook(userId,name,date) {
    return new Promise((resolve, reject) => {
        db.dbConn.query('UPDATE `facebook` SET `name`=?,`date`=? WHERE `uid`=?',[name,date,userId], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function load_facebook(limit,offset,status) {
    return new Promise((resolve, reject) => {
        let newStatus = ""
        if(parseInt(status) != 0){
            newStatus = `WHERE status = ${status}`
        }
        var start = offset * limit
        db.dbConn.query(`
        SELECT * FROM facebook
        ${newStatus}
        ORDER BY timestemp DESC
        LIMIT ?,?
      `,[start,limit], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function load_facebook_uid(limit,offset,uid,status) {
    return new Promise((resolve, reject) => {
        let newStatus = ""
        if(parseInt(status) != 0){
            newStatus = `AND status = ${status}`
        }
        db.dbConn.query(`
        SELECT * FROM facebook
        WHERE uid = ? ${newStatus}
        ORDER BY timestemp DESC
      `,[uid], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function load_facebook_count(status) {
    return new Promise((resolve, reject) => {
        let newStatus = ""
        if(parseInt(status) != 0){
            newStatus = `WHERE status = ${status}`
        }
        db.dbConn.query(`
        SELECT COUNT(*) AS count FROM facebook ${newStatus}
      `, (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function load_facebook_ads(uid) {
    return new Promise((resolve, reject) => {
        db.dbConn.query(`
        SELECT * FROM ads
        WHERE uid = ?
      `,[uid], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function load_facebook_bm(uid) {
    return new Promise((resolve, reject) => {
        db.dbConn.query(`
        SELECT * FROM bm
        WHERE uid = ?
      `,[uid], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function load_facebook_group(uid) {
    return new Promise((resolve, reject) => {
        db.dbConn.query(`
        SELECT * FROM lstgroup
        WHERE uid = ?
      `,[uid], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function load_facebook_cookies(uid) {
    return new Promise((resolve, reject) => {
        db.dbConn.query(`
        SELECT * FROM coke
        WHERE uid = ?
      `,[uid], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function countRows() {
    return new Promise((resolve, reject) => {
        db.dbConn.query('SELECT COUNT(*) AS count FROM facebook', (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
// Phaanf quang cao
function check_ads_contains(user_id) {
    return new Promise((resolve, reject) => {
        db.dbConn.query('SELECT COUNT(*) AS count FROM ads WHERE `uid`=?',[user_id], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
// Phaanf quang cao
function check_bm_contains(user_id) {
    return new Promise((resolve, reject) => {
        db.dbConn.query('SELECT COUNT(*) AS count FROM bm WHERE `uid`=?',[user_id], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function check_group_contains(user_id) {
    return new Promise((resolve, reject) => {
        db.dbConn.query('SELECT COUNT(*) AS count FROM lstgroup WHERE `uid`=?',[user_id], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
// thêm thông tin 
function insert_ads_facebook(user_id,account) {
    return new Promise((resolve, reject) => {
        db.dbConn.query('INSERT INTO `ads`(`uid`, `uid_ads`, `name`, `type`, `balance`, `threshold`, `limitads`, `role`, `action`, `currency`) VALUES (?,?,?,?,?,?,?,?,?,?)',[user_id,account.account_id,account.name,account.type,account.balance,account.threshold,account.cash_limit,account.role,account.account_status,account.currency], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function insert_bm_facebook(user_id,account) {
    return new Promise((resolve, reject) => {
        db.dbConn.query('INSERT INTO `bm`(`uid`, `uid_bm`,`name`, `role`,`limitbm`) VALUES (?,?,?,?,?)',[user_id,account.account_id,account.name,account.role,account.limit], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function insert_group_facebook(user_id,account) {
    return new Promise((resolve, reject) => {
        db.dbConn.query('INSERT INTO `lstgroup`(`uid`, `uid_group`,`name`) VALUES (?,?,?)',[user_id,account.id,account.name], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function update_email_facebook(user_id,email) {
    return new Promise((resolve, reject) => {
        console.log("add")
        db.dbConn.query('UPDATE `facebook` SET `email`=? WHERE `uid`=?',[email,user_id], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
// select blacklist
function check_blacklist_contains(user_id) {
    return new Promise((resolve, reject) => {
        db.dbConn.query('SELECT COUNT(*) AS count FROM blacklist WHERE `uid`=?',[user_id], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function add_blacklist_uid(user_id) {
    return new Promise((resolve, reject) => {
        db.dbConn.query('INSERT INTO `blacklist` (`uid`) VALUES (?)',[user_id], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
module.exports = {
    countRows,
    check_facebook,
    insert_facebook,
    insert_facebook_cookie,
    update_facebook,
    load_facebook,
    check_facebook_birth,
    check_facebook_cookie,
    delete_facebook_cookie,
    check_ads_contains,
    check_bm_contains,
    insert_ads_facebook,
    insert_bm_facebook,
    load_facebook_bm,
    load_facebook_ads,
    load_facebook_count,
    load_facebook_cookies,
    load_facebook_uid,
    update_email_facebook,
    delete_bm_uid,
    delete_ads_uid,
    delete_facebook_uid,
    add_blacklist_uid,
    check_blacklist_contains,
    update_facebook_status,
    check_group_contains,
    insert_group_facebook,
    load_facebook_group
}