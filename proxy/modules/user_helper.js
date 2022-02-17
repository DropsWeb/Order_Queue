module.exports = {
    prepair(uinfo, new_data) {

    },
    status_update(uinfo, id, status) {

    },
    // Обновить массив пользователей
    update_data(data) {
        let users = [];

        for (key in data) {
            if (data[key].user_info.id)
                users.push(data[key].user_info);
        }

        let result = {
            type: 'get_users',
            users: users
        }

        return result;

    },
    // Отправить всем пользователям данные
    send_all(data, clients) {
        for (key in clients) {
            clients[key].send(JSON.stringify(data));
        }
    },
}