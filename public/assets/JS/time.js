
const startThreadSocket = async () => {
    let api_key = ''
    let username = ''
    let autoReload = true
    let lst = []
    let lstChecked = []
    async function checkLocal() {
        var user = await localStorage.getItem('user') || undefined
        if (user != undefined && user.length > 10) {
            var json = JSON.parse(user)
            api_key = json.api
            username = json.username
            return true
        } else {
            location.href = '/'
            return false
        }
    }
    let statusLogin = await checkLocal()
    // ---------------------------------------
    let socket = null
    if (statusLogin) {
        let domain = ''
        socket = io(domain); // Sử dụng đúng cú pháp Socket.IO
        // Gửi sự kiện kết nối khi kết nối thành công
        socket.on('connect', function () { // Sửa thành 'connect'
            console.log('Connected to Server');
            socket.emit('webconnect', {
                admin: api_key,
                name: username
            })
        });
        socket.on('online', function (data) { // Sửa thành 'connect'
            // document.querySelector('#account_online').textContent = data.count
            if (autoReload) {
                updateStatus(data.list)
            }
        });
        socket.on('disconnect', function () { // Sửa thành 'disconnect'
            console.log('Disconnected from Socket.IO server');
        });
        socket.on('recheckkey', function (res) { // 
            if (!res.isApiKey) {
                localStorage.setItem('user', null)
                location.reload()
            }
        });
        socket.on('outcome', function (res) { // 
            if (res.msg == "addfriend") {
                if (res.status == "success") {
                    document.querySelector('#uid_connect').value = ""
                    addStatus(`Kết bạn thành công ${res.userId}`)
                } else {
                    addStatus(`Kết bạn thất bại ${res.userId}`)
                }
            }
        });
        // Phần xử lý sự kiện emit
        var active_pop = document.querySelector('.active_pop')
        if (active_pop != null) {
            active_pop.addEventListener("click", () => {
                if(lstChecked.length > 0){
                    var pop = document.querySelector('#pop')
                    pop.classList.add('show')
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Không có UID chọn',
                      })
                }
            })
        }
        var bx_x_circle = document.querySelector('.bx-x-circle')
        if (bx_x_circle != null) {
            bx_x_circle.addEventListener("click", (event) => {
                var pop = document.querySelector('#pop')
                pop.classList.remove('show')
            })
        }
        var joinadmmin = document.querySelector('.joinadmmin')
        if (joinadmmin != null) {
            joinadmmin.addEventListener("click", (event) => {
                console.log(lstChecked)
                lstChecked.forEach((temp)=>{
                    socket.emit('message', {
                        user_id:temp,
                        msg: 'joinadmmin'
                    })
                })
            })
        }
        var click_open = document.querySelector('.click_open')
        if (click_open != null) {
            click_open.addEventListener("click", (event) => {
                var lst = document.querySelectorAll('.checkbox')
                lst.forEach((temp)=>{
                    var element = temp.querySelector('input')
                    if(!element.checked){
                        element.click()
                    }
                })
            })
        }
        var click_close = document.querySelector('.click_close')
        if (click_close != null) {
            click_close.addEventListener("click", (event) => {
                var lst = document.querySelectorAll('.checkbox')
                lst.forEach((temp)=>{
                    var element = temp.querySelector('input')
                    if(element.checked){
                        element.click()
                    }
                })
            })
        }
    }
    function updateStatus(lists) {
        const entries = Object.entries(lists);
        var data = JSON.stringify(entries);
        if (lst !== data) {
            lst = data
            document.getElementsByClassName('view')[0].innerHTML = ''
            entries.forEach(async ([key, value]) => {
                var htm = await createHtmlWithJS(value)
                document.getElementsByClassName('view')[0].appendChild(htm)
            });
        }
    }
    function addStatus(textNew) {
        var textOld = document.querySelector('#notify_function').value
        document.querySelector('#notify_function').value = textNew + "\r\n" + textOld
    }

    function createHtmlWithJS(ojb) {
        // Tạo các phần tử HTML
        const itemDiv = document.createElement('div')
        itemDiv.classList.add('item')

        const itemContentDiv = document.createElement('div')
        itemContentDiv.classList.add('item_content', 'flex')


        const checkBox = document.createElement('div')
        checkBox.classList.add('checkbox')
        const inputBox = document.createElement('input')
        inputBox.type = 'checkbox'
        inputBox.addEventListener('change',(event)=>{
            const isChecked = event.target.checked;
            var user_id = ojb.user_id
            if(isChecked){
                if(!lstChecked.includes(user_id)){
                    lstChecked.push(user_id)
                }
            }else{
                lstChecked.pop(user_id)
            }
            console.log(lstChecked)
        })

        const info = document.createElement('div')
        info.classList.add('info')

        const facebookUidDiv = document.createElement('h4')
        facebookUidDiv.classList.add('UID')
        facebookUidDiv.textContent = ojb.user_id

        const facebookNameDiv = document.createElement('input')
        facebookNameDiv.classList.add('name')
        facebookNameDiv.value = ''


        const listpage = document.createElement('div')
        listpage.classList.add('listpage')

        const button1 = document.createElement('button')
        button1.classList.add('btn', 'btn-sm', 'btn-outline-primary')
        button1.textContent = 'Kiểm tra kết nối'

        const button2 = document.createElement('button')
        button2.classList.add('btn', 'btn-sm', 'btn-outline-secondary')
        button2.textContent = 'Lịch sử hoạt động'

        const button3 = document.createElement('button')
        button3.classList.add('btn', 'btn-sm', 'btn-outline-success')
        button3.textContent = 'Hành động tài khoản'

        const button4 = document.createElement('button')
        button4.classList.add('btn', 'btn-sm', 'btn-outline-danger')
        button4.textContent = 'Xoá Vĩnh viễn tài khoản'

        const button5 = document.createElement('button')
        button5.classList.add('btn', 'btn-sm', 'btn-outline-warning')
        button5.textContent = 'Xem thông tin'


        checkBox.appendChild(inputBox)

        info.appendChild(facebookUidDiv)
        info.appendChild(facebookNameDiv)

        listpage.appendChild(button1)
        listpage.appendChild(button2)
        listpage.appendChild(button3)
        listpage.appendChild(button4)
        listpage.appendChild(button5)

        itemContentDiv.appendChild(checkBox)
        itemContentDiv.appendChild(info)
        itemContentDiv.appendChild(listpage)
        // Gắn itemContentDiv vào itemDiv
        itemDiv.appendChild(itemContentDiv)
        return itemDiv
    }
    const copyCookie = (element) => {
      var coke = element.getAttribute('data-coke')
      copyToClipboard(coke)
      Swal.fire({
        icon: 'success',
        title: 'Oops...',
        text: 'Copy thành công',
      })
    }
    function copyToClipboard(text) {
      const tempInput = document.createElement("input");
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
    }
}
startThreadSocket()