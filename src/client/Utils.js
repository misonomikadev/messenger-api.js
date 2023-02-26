const fs = require('fs')
const axios = require('axios').default
const MENTION_PATTERN = /<@(\d{9,16})>/g

class Utils {
    static createEnum(keys = {}) {
        const obj = {}
        for (const [key, value] of Object.entries(keys)) {
            if (value === null) continue
            obj[key] = value
            obj[value] = key
        }

        return obj
    }

    static async resolveMention(thread, message) {
        switch (typeof message) {
            case 'string':
                if (message.length == 0) throw new Error('[messenger-api.js] Can\'t send an empty message.')
                if (!MENTION_PATTERN.test(message)) return message
                const mentions = message.match(MENTION_PATTERN)
                    .filter((mention, index, array) => array.indexOf(mention) === index)
                const ids = mentions.map(mention => mention.slice(2, -1))

                return {
                    body: ids.reduce((msg, id) => {
                        const member = thread.members.cache.get(id)
                        return msg.replace(`<@${id}>`, member.toString())
                    }, message),
                    mentions: ids.map(id => {
                        const member = thread.members.cache.get(id)
                        return {
                            tag: member.toString(),
                            id: member.id,
                            fromIndex: 0
                        }
                    })
                }
            case 'object':
                if (typeof message.content === 'string') {
                    if (MENTION_PATTERN.test(message.content)) {
                        const mentions = message.content.match(MENTION_PATTERN)
                            .filter((mention, index, array) => array.indexOf(mention) === index)
                        const ids = mentions.map(mention => mention.slice(2, -1))

                        const attachments = message.files?.map(
                            file => {
                                if (file instanceof fs.ReadStream) return file
                                if (typeof file === 'string') {
                                    if (file.startsWith('http')) {
                                        return axios.get(file).then(res => res.data)
                                    } else {
                                        return fs.createReadStream(file)
                                    }
                                }
                            }
                        )

                        return {
                            body: ids.reduce((msg, id) => {
                                const member = thread.members.cache.get(id)
                                return msg.replace(`<@${id}>`, member.toString())
                            }, message.content),
                            mentions: ids.map(id => {
                                const member = thread.members.cache.get(id)
                                return {
                                    tag: member.toString(),
                                    id: member.id,
                                    fromIndex: 0
                                }
                            }),
                            attachment: message.files && await Promise.all(attachments),
                        }
                    } else {
                        const attachments = message.files?.map(
                            file => {
                                if (file instanceof fs.ReadStream) return file
                                if (typeof file === 'string') {
                                    if (file.startsWith('http')) {
                                        return axios.get(file).then(res => res.data)
                                    } else {
                                        return fs.createReadStream(file)
                                    }
                                }
                            }
                        )

                        return {
                            body: message.content,
                            attachment: message.files && await Promise.all(attachments)
                        }
                    }
                } else {
                    if ('content' in message) throw new Error('[messenger-api.js] Invalid type of message.content. (string expected)]')
                    const attachments = message.files?.map(
                        file => {
                            if (file instanceof fs.ReadStream) return file
                            if (typeof file === 'string') {
                                if (file.startsWith('http')) {
                                    return axios.get(file).then(res => res.data)
                                } else {
                                    return fs.createReadStream(file)
                                }
                            }
                        }
                    )

                    return {
                        attachment: message.files && await Promise.all(attachments)
                    }
                }

            default: throw new TypeError('Invalid type of message.')
        }
    }

    static lazy(cb) {
        let defaultValue;
        return () => (defaultValue ??= cb());
    }
}

module.exports = Utils