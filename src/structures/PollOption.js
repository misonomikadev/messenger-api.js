const { Collection } = require('@discordjs/collection')

class PollOption {
    constructor(poll, data) {
        this.poll = poll
        this.id = data.id
        this.name = data.text
        this.hasVoted = JSON.parse(data.viewer_has_voted)
        this.count = data.total_count
        this.voters = data.voters.reduce(
            (cache, voter) => cache.set(voter, poll.thread.members.cache.get(voter)),
            new Collection()
        )
    }

    async fetchVoters() {

    }
}

module.exports = PollOption