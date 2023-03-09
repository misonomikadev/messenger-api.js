const { Collection } = require('@discordjs/collection')
const PollOption = require('./PollOption')

class ThreadPoll {
    constructor(thread, data) {
        this.id = data.id
        this.title = data.text
        this.thread = thread
        this.client = thread.client
        this.creator = thread.members.cache.get(data.creator_id)
        this.selected = data.selected_option_texts
        this.unselected = data.unselected_option_texts
        this.isThreadCentric = data.is_thread_centric
        this.optionsCount = data.total_count
        this.type = data.question_type
        this.hasVoted = JSON.parse(data.viewer_has_voted)
        this.options = data.options.reduce(
            (cache, option) => cache.set(option.id, new PollOption(this, option)),
            new Collection() 
        )
        this.voters = data.voters.reduce(
            (cache, voter) => cache.set(voter, thread.members.cache.get(voter)),
            new Collection()
        )
    }

    async fetchVoters() {

    }
}

module.exports = ThreadPoll