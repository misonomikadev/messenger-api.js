class Attachment {
    constructor(client, data) {
        this.client = client
        this.id = data.ID
        this.type = data.type
        this.message = data.message

        for (const [key, value] of Object.entries(data)) {
            if (key == 'ID') continue
            this[key] = value
        }
    }

    async fetchOriginalImageUrl() {
        if (this.type != 'photo') throw new Error('This attachment is not an image.')

        return await new Promise((resolve, reject) => {
            this.client.api.getOriginalImageUrl(this.id, this.message.id, this.message.threadId, (err, data) => {
                if (err) reject(err)
                else resolve(data.url)
            })
        })
    }

    forwardTo(users) {
        return this.client.api.forwardAttachment(this.id, users)
    }
}

module.exports = Attachment