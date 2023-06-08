import { EventEmitter } from 'events'
import { Collection } from '@discordjs/collection'
import { ReadStream } from 'fs'

export type ClientCredentials = {
    key: string
    value: string
    domain: string
    path: string
    hostOnly: boolean
    creation: string
    lastAccessed: string
}

export type ClientOptions = {
    autoMarkRead?: boolean
    online?: boolean
}

export type UserReadEvent = {
    thread: Thread
    reader: ThreadMember
    readedTimestamp: number
    readedAt: Date
}

export type MessageOptions = {
    content?: string,
    file?: string[] | ReadStream[]
    url?: string
    stickerID?: string
    location?: {
        latitude: number,
        longitude: number,
        current?: boolean
    }
}

export type ThreadCallEvent = {
    thread: Thread
    conferenceName: string
    caller: ThreadMember
    token: string
    isVideoCall: boolean,
    membersMissedCall: ThreadMember[] | never[]
    duration: number
}

export type RawMessageResponse = {
    threadID: string
    messageID: string
    timestamp: number
}

export type AwaitReactionsOptions = {
    error: string[]
    max: number
    maxEmojis: number
    maxUsers: number
    time: number
    idle: number
    dispose: boolean
    filter: (reaction: MessageReaction, member: ThreadMember) => Promise<boolean> | boolean
}

export type AwaitMessageReactions = {
    error: string[]
    max: number
    time: number
    idle: number
    dispose: boolean
    maxProcessed: number
    filter: (message: Message) => Promise<boolean> | boolean
}

export type RawPollOption = {
    name: string
    id: string
}

export type PollUpdated = {
    votes: RawPollOption[]
    unvotes: RawPollOption[]
    adds: string[]
}

export type ThreadPoll = {
    id: string
    title: string
    thread: Thread
    client: Client
    creator: ThreadMember
    isThreadCentric: boolean
    optionsCount: number
    type: string
    hasVoted: boolean
    options: Collection<string, PollOption>
    voters: Collection<string, ThreadMember>
}

export type PollOption = {
    poll: ThreadPoll
    id: string
    name: string
    hasVoted: boolean
    count: number
    voters: Collection<string, ThreadMember>
}

export interface ClientEvents {
    threadMemberNicknameUpdate: [member: ThreadMember, actionMember: ThreadMember]
    threadApprovalModeOff: [thread: Thread, actionMember: ThreadMember]
    messageReactionRemove: [reaction: MessageReaction, member: ThreadMember]
    threadApprovalModeOn: [thread: Thread, actionMember: ThreadMember]
    messageReactionAdd: [reaction: MessageReaction, member: ThreadMember]
    threadColorUpdate: [thread: Thread, actionMember: ThreadMember]
    threadEmojiUpdate: [thread: Thread, actionMember: ThreadMember]
    threadAdminRemove: [member: ThreadMember, actionMember: ThreadMember]
    threadImageUpdate: [thread: Thread, actionMember: ThreadMember]
    threadAdminAdd: [member: ThreadMember, actionMember: ThreadMember]
    messageTyping: [member: ThreadMember, isTyping: boolean]
    threadMemberAdd: [member: ThreadMember, inviter: ThreadMember, lastLeaveAt: Date]
    threadMemberRemove: [member: ThreadMember, inviter: ThreadMember]
    threadPollCreate: [poll: ThreadPoll, actionMember: ThreadMember]
    threadPollUpdate: [updated: PollUpdated, poll: ThreadPoll, actionMember: ThreadMember]
    threadCallStart: [callEvent: ThreadCallEvent]
    threadCallEnd: [callEvent: ThreadCallEvent],
    threadCallJoin: [member: ThreadMember]
    messageCreate: [message: Message]
    messageDelete: [message: Message]
    messageReply: [message: Message]
    threadRename: [thread: Thread, actionMember: ThreadMember]
    groupLeave: [thread: Thread, actionMember: ThreadMember]
    groupJoin: [thread: Thread, actionMember: ThreadMember]
    userRead: [read: UserReadEvent]
    ready: [client: Client<true>]
    error: [error: Error]
    warn: [message: string]
}

export type If<T extends boolean, A, B = null> = T extends true ? A : T extends false ? B : A | B;

export class Client<Ready extends boolean = boolean> extends EventEmitter {
    constructor(options?: ClientOptions)
    public friends: If<Ready, FriendUserManager>
    public threads: If<Ready, ThreadManager>
    public readyTimestamp: If<Ready, number>
    public user: If<Ready, ClientUser>
    public options?: ClientOptions
    public get readyAt(): If<Ready, Date>
    public get uptime(): If<Ready, number>
    private api?: any

    public once<K extends keyof ClientEvents>(eventName: K, listener: (...args: ClientEvents[K]) => any): this
    public on<K extends keyof ClientEvents>(eventName: K, listener: (...args: ClientEvents[K]) => any): this
    public on(eventName: string | symbol, listener: (...args: any[]) => void): this
    
    private incrementMaxListeners(): void
    private decrementMaxListeners(): void
    public login(credentials: ClientCredentials[], forceLogin?: boolean): Promise<ClientCredentials[]>
    public destroy(): Promise<never>
    public isReady(): boolean
}

export class FriendUserManager {
    constructor(client: Client, friends: any[])
    public client: Client
    public cache: Collection<string, User>
    public remove(id: string): Promise<User | null>
}

export class ThreadManager {
    constructor(client: Client, threads: any[])
    public client: Client
    public cache: Collection<string, Thread>
    constructor(client: Client, threads: any[])
    
    public markAsReadAll(): Promise<void>
    public markAsSeen(timestamp?: number): Promise<void>
    
    public create(name: string, participants: string[]): Promise<Thread>
    public fetch(): Promise<Collection<string, Thread>>
}

export class ThreadMemberManager {
    constructor(thread: Thread, members: any[])
    public thread: Thread
    public cache: Collection<string, ThreadMember>
    public get me(): ThreadMember
    public fetch(): Collection<string, ThreadMember>
}

export class ThreadAdminManager {
    constructor(thread: Thread)
    public client: Client
    public thread: Thread
    public cache: Collection<string, ThreadMember>
    public add(id: string): Promise<ThreadMember>
    public remove(id: string): Promise<ThreadMember>
    public fetch(): Collection<string, ThreadMember>
}

export class MessageManager {
    constructor(thread: Thread)
    public thread: Thread
    public cache: Collection<string, Message>
    public markAsRead(): Promise<void>
    public markAsUnread(): Promise<void>
    public fetchHistory(): Promise<Collection<string, Message>>
    public fetch(messageID: string): Promise<Message | null>
}

export class ReactionUserManager {
    constructor(reaction: MessageReaction)
    public client: Client
    public reaction: MessageReaction
    public cache: Collection<string, ThreadMember>
    public fetch(): Collection<string, ThreadMember>
}

export class ReactionManager {
    constructor(message: Message, reactions: any[])
    public client: Client
    public message: Message
    public cache: Collection<string, MessageReaction>
    public get me(): boolean
    public fetch(): Promise<this>
    public getEmojiUrl(emoji: string, size?: 32 | 64 | 128, pixelRatio?: 1 | 1.5): string
}

export class User {
    constructor(client: Client, user: any)
    public client: Client
    public id: string
    public username: string
    public shortName: string
    public profileUrl: string
    public avatarUrl: string
    public type?: string
    public vanity: string
    private _raw: any
    public get alternateName(): string
    public get isFriend(): boolean
    public get isBirthday(): boolean
    public get gender(): string
    public send<T extends boolean>(message: MessageOptions, options: { returnMessage: T, typing: boolean })
        : T extends true ? Promise<Message> : Promise<RawMessageResponse>
    public fetch(): Promise<this>
    public block(): Promise<void>
    public unblock(): Promise<void>
    public unfriend(): Promise<this>
    public toString(): string
}

export class Thread {
    constructor(client: Client, thread: any)
    public client: Client
    private _raw: any
    public type: string
    public emoji: string
    public color: string
    public id: string
    public isGroup: boolean
    public requireApproval: boolean
    public iconUrl: string
    public name: string
    public invite: { enable: boolean, url: string }
    public members: ThreadMemberManager
    public admins: ThreadAdminManager
    public messages: MessageManager

    public sendTyping(): Promise<() => void>
    public send<T extends boolean>(message: MessageOptions, options: { returnMessage: T, typing: boolean })
        : T extends true ? Promise<Message> : Promise<RawMessageResponse>
    public awaitMessages(options?: AwaitMessageReactions): Promise<Collection<string, Message>>
    public createPoll(title: string, pollOptions: { name: string, vote: boolean }[]): Promise<void>
    public setColor(color: string): Promise<this>
    public setName(name: string): Promise<this>
    public setIcon(image: ReadStream): Promise<this>
    public setEmoji(emoji: string): Promise<this>
    public fetch(): Promise<this>
    public mute(seconds: number): Promise<void>
    public sendTyping(): Promise<void>
    public unmute(): Promise<void>
    public delete(): Promise<this>
    public archive(): Promise<void>
    public unarchive(): Promise<void>
    public leave(): Promise<this>
}

export class ClientUser extends User {
    constructor(client: Client, user: any)
    public setBio(newBio: string, publish?: boolean): Promise<this>
    public setAvatar(url: string, caption?: string): Promise<this>
}

export class Attachment {
    constructor(client: Client, data: any)
    public client: Client
    public id: string
    public type: AttachmentType
    public packId?: string
    public spriteUrl?: string
    public spriteUrl2x?: string
    public width?: number
    public height?: number
    public caption?: string
    public description?: string
    public frameCount?: number
    public frameRate?: number
    public framesPerRow?: number
    public framesPerCol?: number
    public filename?: string
    public isMalicious?: boolean
    public contentType?: string
    public thumbnailUrl?: string
    public previewUrl?: string
    public previewWidth?: number
    public previewHeight?: number
    public largePreviewUrl?: string
    public largePreviewWidth?: number
    public largePreviewHeight?: number
    public duration?: number
    public videoType?: string
    public audioType?: string
    public isVoiceMail?: boolean
    public latitude?: number
    public longitude?: number
    public image?: string
    public address?: string
    public title?: string
    public source?: string
    public playable?: boolean
    public playableUrl?: string
    public subattachments?: string
    public properties?: string

    public forwardTo(users: string[]): Promise<void>
}

export class MessageReaction {
    constructor(message: Message, emoji: string)
    public client: Client
    public emoji: string
    public message: Message
    public members: ReactionUserManager
    public get count(): number
    public get me(): ThreadMember
    public react(): Promise<MessageReaction>
    public remove(): Promise<void>
    public getEmojiUrl(size?: 32 | 64 | 128, pixelRatio?: 1 | 1.5): string
}

export class ThreadMember {
    constructor(thread: Thread, member: any)
    public thread: Thread
    public user: User
    public id: string
    public nickname: string
    public get displayName(): string
    public get isAdmin(): boolean
    public send<T extends boolean>(message: MessageOptions, options: { returnMessage: T, typing: boolean })
        : T extends true ? Promise<Message> : Promise<RawMessageResponse>
    public kick(): Promise<this>
    public setNickname(nickname?: string): Promise<this>
    public makeAdmin(): Promise<this>
    public removeAdmin(): Promise<this>
    public fetch(): Promise<this>
    public toString(): string
}

export class Message {
    constructor(client: Client, message: any)
    public client: Client
    public id: string
    public thread: Thread
    public threadId: string
    public content: string
    public author: User
    public authorId: string
    public repliedMessage: Message
    public attachments: Collection<string, Attachment>
    public createdTimestamp: number
    public deletedTimestamp: number | null
    private _raw: any
    public reactions: ReactionManager
    public member: ThreadMember
    public mentions: Collection<string, ThreadMember>
    public get deletedAt(): Date | null
    public get createdAt(): Date | null
    public get isClientUser(): boolean

    public awaitReactions(options?: AwaitReactionsOptions): Promise<Collection<string, MessageReaction>>
    public reply<T extends boolean>(message: MessageOptions, options: { returnMessage: T, typing: boolean })
        : T extends true ? Promise<Message> : Promise<RawMessageResponse>
    public fetch(): Promise<this>
    public react(emoji: string): Promise<MessageReaction>
    public delete(): Promise<this>
    public remove(): Promise<this>
}

export enum Events {
    ThreadMemberNicknameUpdate = 'threadMemberNicknameUpdate',
    ThreadApprovalModeOff = 'threadApprovalModeOff',
    MessageReactionRemove = 'messageReactionRemove',
    ThreadApprovalModeOn = 'threadApprovalModeOn',
    MessageReactionAdd = 'messageReactionAdd',
    ThreadMemberRemove = 'threadMemberRemove',
    ThreadColorUpdate = 'threadColorUpdate',
    ThreadEmojiUpdate = 'threadEmojiUpdate',
    ThreadAdminRemove = 'threadAdminRemove',
    ThreadImageUpdate = 'threadImageUpdate',
    ThreadPollCreate = 'threadPollCreate',
    ThreadPollUpdate = 'threadPollUpdate',
    ThreadMemberAdd = 'threadMemberAdd',
    ThreadAdminAdd = 'threadAdminAdd',
    MessageTyping = 'messageTyping',
    MessageCreate = 'messageCreate',
    MessageDelete = 'messageDelete',
    MessageReply = 'messageReply',
    ThreadRename = 'threadRename',
    GroupLeave = 'groupLeave',
    GroupJoin = 'groupJoin',
    UserRead = 'userRead',

    Ready = 'ready',
    Error = 'error',
    Debug = 'debug',
}

export enum AttachmentType {
    AnimatedImage = 'animated_image',
    Location = 'location',
    Sticker = 'sticker',
    Photo = 'photo',
    Video = 'video',
    Audio = 'audio',
    Share = 'share',
    File = 'file'
}

export enum ThreadColor {
    Aqua = "417639218648241",
    AquaBlue = "2442142322678320",
    Berry = "164535220883264",
    BrightPurple = "234137870477637",
    Candy = "205488546921017",
    Citrus = "370940413392601",
    CoralPink = "980963458735625",
    DefaultBlue = "196241301102133",
    Green = "2136751179887052",
    HotPink = "169463077092846",
    LavenderPurple = "2058653964378557",
    Mango = "930060997172551",
    Orange = "175615189761153",
    Red = "2129984390566328",
    TealBlue = "1928399724138152",
    Yellow = "174636906462322",
    ValentineDay = "911474093204931",
    BlackHistoryMonth = "693996545771691",
    Pride = "1652456634878319",
    Transgender = "504518465021637",
    TaylorSwift = "769129927636836",
    Cyberpunk2077 = "780962576430091",
    NonBinary = "737761000603635",
    Support = "365557122117011",
    Music = "339021464972092",
    StrangerThings = "394531148999789",
    Lofi = "1060619084701625",
    Sky = "3190514984517598",
    Celebration = "627144732056021",
    Care = "275041734441112",
    Astrology = "3082966625307060"
}
