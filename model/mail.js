const db = require('../untils/db')

function get_mail_all() {
    return new Promise((resolve, reject) => {
        db.dbConn.query('SELECT * FROM `mail` WHERE 1', (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function get_mail_one() {
    return new Promise((resolve, reject) => {
        db.dbConn.query('SELECT * FROM mail LIMIT 1', (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function delete_mail_one(id) {
    return new Promise((resolve, reject) => {
        db.dbConn.query('DELETE FROM mail WHERE `id`=?',[id], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function delete_mail_all() {
    return new Promise((resolve, reject) => {
        db.dbConn.query('DELETE FROM mail', (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
function add_email_new(email) {
    return new Promise((resolve, reject) => {
        db.dbConn.query('INSERT INTO mail (`info`) VALUES (?)',[email], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        });
    });
}
module.exports = {
    get_mail_all,
    delete_mail_all,
    add_email_new,
    get_mail_one,
    delete_mail_one
}