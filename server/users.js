class Users {
    constructor() {
        // user is {id: string, name: string, roomId: string}
        this.users = [];
    }

    add(user) {
        this.users.push(user);
    }

    getUserById(id) {
        return this.users.find((el) => el.id === id);
    }

    removeUserById(id) {
        const user = this.getUserById(id);
        if (user) {
            this.users = this.users.filter((el) => el.id !== id);
        }
        return user;
    }

    getByRoom(roomId) {
        return this.users.filter((el) => el.roomId === roomId);
    }
}

module.exports = function() {
    return new Users()
}