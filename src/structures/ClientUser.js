const User = require('./User')

class ClientUser extends User {
    constructor(client, user) {
        super(client, user)
    }

    /**
     * Change the client user bio.
     * @param {string} newBio 
     * @param {boolean?} publish 
     */
    async setBio(newBio, publish = false) {
        if (typeof newBio !== 'string') throw new Error('New bio must be string to change.')
        await this.client.api.changeBio(newBio, publish)
        return this
    }

    /**
     * Change the client user avatar.
     * @param {string} url 
     * @param {string?} caption 
     * @returns {Promise<this>}
     */
    async setAvatar(url, caption) {
        if (typeof url !== 'string' || !url.startsWith('http')) throw new Error('Invalid new URL of avatar.')
        if (caption && typeof caption !== 'string') throw new Error('Caption must be a string.')
        const isSuccess = await this.client.api.changeAvt(url, caption)
        if (!isSuccess) throw new Error('Failed to change client avatar.')
        const user = await this.fetch()
        return user
    }
}

module.exports = ClientUser