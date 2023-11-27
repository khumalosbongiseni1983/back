// Import các module cần thiết
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser')
const path = require('path')
// Tạo một ứng dụng Express
const app = express();
const server = http.createServer(app);
require('./socket/index')(server)

// Thêm cấu hình CORS vào Express
const cors = require('cors');
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const apiRouter = require('./api/user')
const apiFacebook = require('./api/facebook')
app.use('/api', apiRouter);
app.use('/api', apiFacebook);
// Khởi động server
const port = 1234;
server.listen(port, () => {
  console.log(`Server đang lắng nghe trên cổng ${port}`);
});
