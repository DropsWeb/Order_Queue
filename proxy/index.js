const http = require("https");
const WebSocket = require("ws");
const fs = require('fs');
const db = require('./modules/db');
const fetch_helper = require('./modules/fetch_helper');
const uhelper = require('./modules/user_helper');
const port = process.env.PORT_PROXY;

const server = http.createServer({
    cert: fs.readFileSync(process.env.CERT),
    key: fs.readFileSync(process.env.KEY)
});


let clients = {};

let timeouts_id = [];

let rooms = [];

// [
// {
//     id: 1,
//     name: 'NAME_ROOM',
//     orders: [],
//     end_orders: [],
//     info: {
//         number: '8-111-111-11-11',
//         site: 'test@example.com'
//     }
// },
// ];

const webSocketServer = new WebSocket.Server({ server });
webSocketServer.on('connection', ws => {
    let id = Math.random();
    clients[id] = ws;
    clients[id].id = id;
    clients[id].user_info = {};
    clients[id].user_info.status = true;

    ws.on('message', data => {
        data = JSON.parse(data.toString('utf8'));
        let type = data.type;
        switch (type) {
            // case 'save_name':
            //     save_name(data);
            //     break;
            case 'create_order':
                create_order(data);
                break;
            case 'get_rooms':
                get_rooms(data);
                break;
            case 'check_cookie':
                check_cookie(data);
                break;
            case 'get_room':
                get_room(data);
                break;
            case 'create_room':
                create_room(data);
                break;
            case 'edit_room':
                edit_room(data);
                break;
            case 'end_order':
                end_order(data);
                break;
            case 'remove_order':
                remove_order(data);
                break;
            case 'delete_room':
                delete_room(data);
                break;
        }

        function edit_room(data) {
            db.updateItem(data).then(result => {
                if (result) {
                    rooms.forEach((item, key) => {
                        if (item.id === data.id) {
                            rooms[key].name = data.name;
                            rooms[key].delivery = data.delivery;
                            rooms[key].phone = data.phone;
                        }
                    });

                    let result_ans = {
                        type: 'get_rooms',
                        rooms: rooms
                    };

                    uhelper.send_all(result_ans, clients);
                }
            })
        }

        function check_cookie(data) {
            let check = false;
            for (key in clients) {
                if (clients[key].id == data.id) {
                    check = true;
                }
            }

            if (check) {
                clients[id].user_info = clients[data.id].user_info;
                clients[id].user_info.status = true;
                clearTimeout(timeouts_id[data.id]);
                delete clients[data.id];
                let result = uhelper.update_data(clients);
                let old_user = {
                    type: 'auth_user',
                    authorized: true,
                    is_admin: true
                };

                ws.send(JSON.stringify(old_user));
                uhelper.send_all(result, clients);
            }
            let data_cookie = {
                type: 'cookie_user',
                id: id
            };
            ws.send(JSON.stringify(data_cookie))
        }

        function get_rooms() {
            let data = {};
            data.type = "get_rooms";
            data.rooms = rooms;
            uhelper.send_all(data, clients);

            ws.send(JSON.stringify(data));
        }

        function delete_room(data) {
            db.removeItem(data.id).then(res => {
                rooms.forEach((item, key) => {
                    if (item.id === data.id) {
                        rooms.splice(key, 1);
                    }
                })
                let result = {
                    type: 'get_rooms',
                    rooms: rooms
                };
                uhelper.send_all(result, clients);
            })
        }


        function create_room(data) {
            db.storeItem(data).then(result => {
                if (result) {
                    let room = {
                        id: result,
                        name: data.name,
                        delivery: data.delivery,
                        phone: data.phone,
                        orders: [],
                        end_orders: []
                    };
                    rooms.push(room);
                    let res = {
                        type: 'get_rooms',
                        rooms: rooms
                    }
                    uhelper.send_all(res, clients);
                    console.log('Комната создана')
                }
            })
        }

        function remove_order(data) {
            let key_room = '';
            rooms.forEach((room, key) => {
                if (room.id == data.id_room) {
                    key_room = key;
                    let index = rooms[key].end_orders.indexOf(data.order);
                    rooms[key].end_orders.splice(index, 1);
                }
            })
            let result = {
                type: 'get_room',
                room: rooms[key_room]
            };
            uhelper.send_all(result, clients);
        }

        function end_order(data) {
            let key_room = '';
            rooms.forEach((room, key) => {
                if (room.id == data.id_room) {
                    key_room = key;
                    let index = rooms[key].orders.indexOf(data.order);
                    rooms[key].orders.splice(index, 1);
                    rooms[key].end_orders.push(data.order);
                }
            })
            let result = {
                type: 'end_order',
                room: rooms[key_room]
            }
            uhelper.send_all(result, clients);
        }

        function get_room(data) {
            let key_room = '';

            rooms.forEach((room, key) => {
                if (room.id == data.room) {
                    key_room = key;
                }
            })
            let result = {
                type: 'get_room',
                room: rooms[key_room],
            };
            uhelper.send_all(result, clients);
        };

        function create_order(data) {
            let key_room = '';
            rooms.forEach((room, key) => {
                if (room.id == data.id_room) {
                    key_room = key;
                    room.orders.push(data.order);
                }
            })

            let result = {
                type: 'create_order',
                room: rooms[key_room]
            };
            uhelper.send_all(result, clients);
        };

    });

    ws.on('close', () => {
        if (clients[id]) {
            clients[id].user_info.status = false;
        }
    })



    ws.on("error", e => ws.send(e));


});

db.init().then(() => {
    server.listen(port, () => {
        console.log('Сервер запущенн'); 
        db.getItems().then(result => {
            result.forEach((item, key) => {
                result[key].orders = [];
                result[key].end_orders = [];
            })
            rooms = result;
        })
    })
}).catch((err) => {
    console.log(err, 'Ошибка подключения к базе');
}).catch((err) => {
    console.log(err, 'Ошибка подключения к базе');
})