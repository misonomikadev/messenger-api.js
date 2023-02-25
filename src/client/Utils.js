const fs = require('fs')
const axios = require('axios').default
const MENTION_PATTERN = /<@(\d{9rs,16})>/g

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
                if (message.length == 0) throw new Error('Can\'t send an empty message.')
                if (!MENTION_PATTERN.test(message)) return message
                const mentions1 = message.match(MENTION_PATTERN)
                    .filter((mention, index, array) => array.indexOf(mention) == index)
                const ids1 = mentions1.map(mention => mention.slice(2, -1))

                return {
                    body: ids1.reduce((msg, id) => {
                        const member = thread.members.cache.get(id)
                        return msg.replace(`<@${id}>`, member.toString())
                    }, message),
                    mentions: ids1.map(id => {
                        const member = thread.members.cache.get(id)
                        return {
                            tag: member.toString(),
                            id: member.id,
                            fromIndex: 0
                        }
                    })
                }
            case 'object':
                if (typeof message.content !== 'string')
                    throw new TypeError()

                if (!MENTION_PATTERN.test(message.content)) {
                    return {
                        body: message.content,
                        atttachment: await message.files.map(
                            async file => {
                                if (file instanceof fs.ReadStream) return file
                                if (typeof file == 'string') {
                                    if (file.startsWith('http')) {
                                        const fetched = await axios.get(file)
                                        return fetched.data
                                    } else {
                                        return fs.createReadStream(file)
                                    }
                                }
                            }
                        ),
                    }
                }

                const mentions2 = message.match(MENTION_PATTERN)
                    .filter((mention, index, array) => array.indexOf(mention) == index)
                const ids2 = mentions2.map(mention => mention.slice(2, -1))

                return {
                    body: ids2.reduce((msg, id) => {
                        const member = thread.members.cache.get(id)
                        return msg.replace(`<@${id}>`, member.toString())
                    }, message),
                    mentions: ids2.map(id => {
                        const member = thread.members.cache.get(id)
                        return {
                            tag: member.toString(),
                            id: member.id,
                            fromIndex: 0
                        }
                    }),
                    atttachment: await message.files?.map(
                        async file => {
                            if (file instanceof fs.ReadStream) return file
                            if (typeof file == 'string') {
                                if (file.startsWith('http')) {
                                    const fetched = await axios.get(file)
                                    return fetched.data
                                } else {
                                    return fs.createReadStream(file)
                                }
                            }
                        }
                    )
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