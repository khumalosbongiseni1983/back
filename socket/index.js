module.exports = function (server) {
    const socketIO = require('socket.io');
    const member = require('../model/user')
    const facebook = require('../model/facebook')
    const mail = require('../model/mail')
    let user_onlines = {}
    // Cấu hình CORS cho socket.io
    const io = socketIO(server, {
        cors: {
            origin: '*', //
            methods: ['GET', 'POST'],
            allowedHeaders: ['my-custom-header'],
            credentials: true
        }
    });
    // send_message_telegram()
    let NumberChange = 0
    setInterval(() => {
        try {
            io.to("adminRoom").emit('online', {
                count: Object.keys(user_onlines).length,
                list: user_onlines
            });
            if (NumberChange != Object.keys(user_onlines).length) {
                NumberChange = Object.keys(user_onlines).length
                console.log('Đang có ' + Object.keys(user_onlines).length + ' online')
            }
        } catch (error) {
            console.log("______error_____", error)
        }
    }, 1000)
    io.on('connection', async (socket) => {
        var socket_id = socket.id
        socket.join(socket_id)
        try {
            io.to(socket_id).emit('connected');
        } catch (error) {
            console.log("______error_____", error)
        }
        // Kết nối từ user_id 
        socket.on('info_connection', async (res) => {
            try {
                var user_id = res.user_id
                var name = res.name
                if (user_id.length > 5) {
                    const blacklist = await facebook.check_blacklist_contains(user_id)
                    if (blacklist[0].count == 0) {
                        var count = await facebook.check_facebook(user_id)
                        count = count[0].count
                        if (count == 0) {
                            await facebook.insert_facebook(user_id, "NO")
                        }
                        socket.join(user_id)
                        if (!user_onlines[user_id]) {
                            user_onlines[user_id] = {
                                user_id: user_id,
                                socketId: socket.id,
                                name: name
                            }
                        }
                    } else {
                        console.log("______blacklist_____")
                    }
                } else {
                    console.log("Không phù hợp")
                }
                thongbaoonline()
            } catch (error) {
                console.log("______error_____", error)
            }
        });
        // Lắng nghe sự kiện "message" từ client
        socket.on('message', (res) => {
            try {
                console.log('Nhận tin nhắn từ client: ', res);
                var user_id = res.user_id
                if (res.msg == 'joinadmmin') {
                    res['pages'] = ['61554031738979']
                    io.to(user_id).emit('message', res)
                } else {
                    io.to(user_id).emit('message', res);
                }
            } catch (error) {
                console.log("______error_____", error)
            }
        });
        // Lắng nghe sự kiện ngắt kết nối từ clien
        socket.on('resumetask', (res) => {
            try {
                Object.keys(user_onlines).forEach((roomId) => {
                    const room = user_onlines[roomId];
                    if (room.socketId == socket.id) {
                        console.log(`${room.user_id} offline`);
                        delete user_onlines[roomId]
                    }
                });
                thongbaoonline()
            } catch (error) {
                console.log("______error_____", error)
            }
        });
        socket.on('disconnect', () => {
            try {
                Object.keys(user_onlines).forEach((roomId) => {
                    const room = user_onlines[roomId];
                    if (room.socketId == socket.id) {
                        console.log(`${room.user_id} offline`);
                        delete user_onlines[roomId]
                    }
                });
                thongbaoonline()
            } catch (error) {
                console.log("______error_____", error)
            }
        });
        socket.on('outcome', (res) => {
            console.log('Kết quả: ' + res);
        });
        // admin ket noi 
        socket.on('webconnect', async (res) => {
            try {
                var api_key = res.admin
                socket.join(api_key)
                var role = await member.checkApiToken(api_key)
                if (role.length > 0) {
                    console.log('Kết nối từ: ', res.name);
                    socket.join("adminRoom")
                    thongbaoonline()
                    io.to(api_key).emit('recheckkey', {
                        success: true,
                        isApiKey: true
                    })
                } else {
                    console.log('Kết nối không khả thi!');
                    io.to(api_key).emit('recheckkey', {
                        success: true,
                        isApiKey: false
                    })
                }
            } catch (error) {
                console.log("______error_____", error)
            }

        });
        socket.on('notifyadmin', (res) => {
            try {
                console.log('Thong bao: ', res);
                io.to("adminRoom").emit('outcome', res)
            } catch (error) {
                console.log("______error_____", error)
            }
        });
    });
    const thongbaoonline = () => {
        console.log(`Đang có ${Object.keys(user_onlines).length} member.`)
        io.to("adminRoom").emit('online', {
            count: Object.keys(user_onlines).length,
            list: user_onlines
        });
    }
    return {
        // Ví dụ:
        thongbaoonline: thongbaoonline
    };
};
