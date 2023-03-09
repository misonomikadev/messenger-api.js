'use strict';

module.exports = {
    Client: require('./client/Client'),

    // Managers
    ThreadMemberManager: require('./managers/ThreadMemberManager'),
    ReactionUserManager: require('./managers/ReactionUserManager'),
    ThreadAdminManager: require('./managers/ThreadAdminManager'),
    FriendUserManager: require('./managers/FriendUserManager'),
    ReactionManager: require('./managers/ReactionManager'),
    MessageManager: require('./managers/MessageManager'),
    ThreadManager: require('./managers/ThreadManager'),

    // Structures
    MessageReaction: require('./structures/MessageReaction'),
    ThreadMember: require('./structures/ThreadMember'),
    ThreadPoll: require('./structures/ThreadPoll'),
    PollOption: require('./structures/PollOption'),
    ClientUser: require('./structures/ClientUser'),
    Attachment: require('./structures/Attachment'),
    Message: require('./structures/Message'),
    Thread: require('./structures/Thread'),
    User: require('./structures/User'),

    // Enums
    Events: require('./enums/Events'),
    ThreadColor: require('./enums/ThreadColor'),
    AttachmentType: require('./enums/AttachmentType')
}