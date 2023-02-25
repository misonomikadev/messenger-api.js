class Attachment {
    constructor(client, data) {
        this.client = client
        this.id = data.ID
        this.type = data.type

        for (const [key, value] of Object.entries(data)) {
            if (key == 'ID') continue
            this[key] = value
        }
    }

    forwardTo(users) {
        return this.client.api.forwardAttachment(this.id, users)
    }
}

module.exports = Attachment