'use strict';

const login = require('../lib/index')
const { EventEmitter } = require('node:events')
const ClientUser = require('../structures/ClientUser')
const ThreadManager = require('../managers/ThreadManager')
const FriendUserManager = require('../managers/FriendUserManager')
const Events = require('../enums/Events')
const MessengerEvent = require('../enums/MessengerEvent')

class Client extends EventEmitter {
    constructor(options = {
        autoMarkRead: false,
        online: true
    }) {
        super({ captureRejections: true })

        this.options = options
        this.readyTimestamp = null
        this.friends = null
        this.threads = null
        this.user = null
        this.api = null
    }

    async login(credentials, forceLogin = false) {
        if (!credentials) throw new Error('Missing credentials to login.')
        await login({ appState: credentials }, { forceLogin: !!forceLogin, logLevel: 'silent' },
            async (err, api) => {
                if (err) throw new Error(`Invalid login credentials: ${err}`)

                this.api = api
                api.setOptions({
                    listenEvents: true,
                    selfListen: true,
                    ...this.options
                })

                setTimeout(async () => {
                    const clientID = api.getCurrentUserID()
                    const clientUser = await api.getUserInfo(clientID)
                    this.user = new ClientUser(this, Object.assign(clientUser[clientID], { id: clientID }))

                    const threads = await api.getThreadList(100, null, [])
                    this.threads = new ThreadManager(this, threads)

                    const friends = await api.getFriendsList()
                    this.friends = new FriendUserManager(this, friends)

                    api.listenMqtt(
                        async (e, event) => {
                            if (e) return this.emit(Events.Error, e.error)
                            if (event.type === 'event') {
                                await require(`./events/${MessengerEvent[event.logMessageType]}`)(this, event)
                            } else {
                                await require(`./events/${MessengerEvent[event.type]}`)(this, event)
                            }
                        }
                    )

                    this.readyTimestamp = Date.now()
                    this.emit(Events.Ready, this)
                }, 1000)
            }
        )

        return credentials
    }

    async destroy() {
        if (!this.readyTimestamp)
            throw new Error('This client isn\'n logged.')
        
        await this.api.logout()
        return process.exit(0)
    }

    isReady() {
        return !!this.readyTimestamp
    }

    get readyAt() {
        return this.readyTimestamp && new Date(this.readyTimestamp)
    }

    get uptime() {
        return this.readyTimestamp && Date.now() - this.readyTimestamp
    }

    /**
     * Increments max listeners by one, if they are not zero.
     * @private
     */
    incrementMaxListeners() {
        const maxListeners = this.getMaxListeners();
        if (maxListeners !== 0) {
            this.setMaxListeners(maxListeners + 1);
        }
    }
    /**
     * Decrements max listeners by one, if they are not zero.
     * @private
     */
    decrementMaxListeners() {
        const maxListeners = this.getMaxListeners();
        if (maxListeners !== 0) {
            this.setMaxListeners(maxListeners - 1);
        }
    }
}

module.exports = Client