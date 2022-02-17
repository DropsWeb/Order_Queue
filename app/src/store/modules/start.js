let defaultState = {
    user: {
        authorized: '',
        is_admin: true
    },
    users: {},
    connection: '',
    rooms: [],
    select_room: {
        id: '',
        mode: '',
        orders: [],
        end_orders: [],
        info: ''
    },
    ringtone: '',
};



export default {
    state: defaultState,
    getters: {
        all_users(state) {
            return state.users;
        },
        start_ws(state) {
            return state.connection;
        },
        user(state) {
            return state.user;
        },
        rooms(state) {
            return state.rooms;
        },
        select_room(state) {
            return state.select_room;
        },
        ringtone(state) {
            return state.ringtone;
        }

    },
    actions: {
        get_rooms(ctx, message) {
            let ws = ctx.getters.start_ws;
            try {
                ws.send(JSON.stringify(message));
            } catch (err) {
                console.log('ws ещё не загружен')
            }
            ws.onopen = function() {
                ws.send(JSON.stringify(message));
            }

        },
        ws_message(ctx, message) {
            let ws = ctx.getters.start_ws
            ws.send(message)
        },
        start_server(ctx, data) {
            data.onmessage = function(event) {
                let ws_data = JSON.parse(event.data);
                let type = ws_data.type;
                switch (type) {
                    case 'get_users':
                        ctx.commit('update_users', ws_data.users);
                        break;
                    case 'get_nickname':
                        ctx.commit('put_nickname', ws_data);
                        break;
                    case 'cookie_user':
                        localStorage.setItem('cookie_user', ws_data.id);
                        break;
                    case 'auth_user':
                        localStorage.setItem('cookie_user', ws_data.cookie);
                        ctx.commit('put_nickname', ws_data);
                        break;
                    case 'get_rooms':
                        ctx.commit('update_rooms', ws_data);
                        break;
                    case 'get_room':
                        ctx.commit('get_room', ws_data.room)
                        break;
                    case 'create_order':
                        if (ctx.state.select_room.id == ws_data.room.id) {
                            ctx.commit('update_orders', ws_data.room.orders)
                        }
                        break;
                    case 'end_order':
                        if (ctx.state.select_room.id == ws_data.room.id) {
                            if (ctx.state.select_room.mode === 'window') {
                                // let ringtone = this.$refs.audio;
                                let audio = ctx.state.ringtone;
                                console.log(audio)
                                audio.play();
                                console.log(audio, 'Мелодия должна проиграться')
                            }
                            ctx.commit('get_room', ws_data.room)
                        }
                        break;
                    case 'create_room':
                        ctx.commit('update_rooms', ws_data);
                        break;
                }
            }

            data.onopen = function() {
                console.log("Это, как я понял, сервер запущен")

                if (localStorage.getItem('cookie_user')) {
                    let data_cookie = {
                        type: 'check_cookie',
                        id: localStorage.getItem('cookie_user')
                    };
                    data.send(JSON.stringify(data_cookie))
                }
                console.log("Successfully connected to the echo websocket server...")
            }
            ctx.commit('ws_server', data);
        }

    },
    mutations: {
        get_room(state, data) {
            if (state.select_room.id == data.id) {
                state.select_room.id = data.id;
                state.select_room.orders = data.orders;
                state.select_room.end_orders = data.end_orders;
                state.select_room.phone = data.phone;
                state.select_room.delivery = data.delivery;
            }
        },
        add_ringtone(state, data) {
            state.ringtone = data;
        },
        update_orders(state, data) {
            state.select_room.orders = data;
        },
        update_users(state, data) {
            state.users = data;
        },
        ws_server(state, data) {
            state.connection = data
        },
        put_id_room(state, data) {
            state.select_room.id = data;
        },
        put_mode_room(state, data) {
            state.select_room.mode = data;
        },
        put_nickname(state, data) {
            state.user.authorized = data.authorized;
            state.user.is_admin = data.is_admin;
        },
        update_rooms(state, data) {
            state.rooms = data.rooms;
        }
    }
}