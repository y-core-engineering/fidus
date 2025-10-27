# Communication Domain - Detailed Model

**Version:** 1.1
**Date:** 2025-10-27
**Status:** Draft
**Context:** Communication Context (Domain)

## Overview

The Communication Domain manages all aspects of messaging, email, and communication channels. It helps users stay on top of important messages, draft responses, and maintain communication workflows.

**Relationship to Bounded Context:**
- This **domain model** defines WHAT the Communication Context does (aggregates, events, rules)
- The **CommunicationSupervisor** (architecture) defines HOW it's implemented (LangGraph state machine, email/messaging API integrations)

---

## Multi-Tenancy Considerations

The Communication Context operates with **tenant-level isolation** and **user-level communication data**:

| **Tenant Type** | **Communication Capabilities** |
|-----------------|-------------------------------|
| **INDIVIDUAL** | Personal email/messaging, basic filtering, draft assistance |
| **FAMILY** | Shared family email accounts, message filtering for family members |
| **TEAM** | Team communication channels, shared inboxes, collaboration features |
| **COMPANY** | Corporate email management, compliance, DLP, archiving, advanced analytics |

**Tenant-Specific Features:**
- **Community Tier:** 2 email accounts, basic filtering, manual message management
- **Cloud Tier:** 5 email accounts, smart prioritization, draft assistance, real-time sync
- **Enterprise Tier:** Unlimited accounts, compliance features, DLP, legal hold, advanced search, analytics

**Data Isolation:**
- All messages scoped to `tenantId` and `userId`
- Email credentials encrypted per-user with tenant-specific keys
- Shared inboxes (team/company) use tenant-level permissions
- Message metadata tenant-isolated

---

## Domain Concepts

### Core Entities

#### 1. Message (Aggregate Root)

**Description:** A communication unit (email, SMS, chat message) sent or received by a user.

**Invariants:**
- Must have at least one recipient (for outgoing) or sender (for incoming)
- Subject cannot be empty for emails
- Cannot modify sent messages (immutable after sending)
- Cannot send without content

**State:**
```typescript
class Message {
  // Identity
  private readonly id: string;
  private readonly userId: string;
  private readonly tenantId: string;

  // Core attributes
  private channel: CommunicationChannel;
  private direction: MessageDirection;
  private subject?: string; // For emails
  private content: string;
  private contentType: ContentType;

  // Participants
  private sender: Participant;
  private recipients: Participant[] = [];
  private cc: Participant[] = [];
  private bcc: Participant[] = [];

  // Thread
  private threadId?: string;
  private inReplyTo?: string; // Message ID
  private references: string[] = []; // Thread history

  // External sync
  private externalId?: string;
  private externalProvider?: 'gmail' | 'outlook' | 'slack';

  // Status
  private status: MessageStatus;
  private priority: MessagePriority;

  // Flags
  private isRead: boolean = false;
  private isStarred: boolean = false;
  private isArchived: boolean = false;

  // Attachments
  private attachments: Attachment[] = [];

  // AI Analysis
  private sentiment?: Sentiment;
  private category?: MessageCategory;
  private actionItems: ActionItem[] = [];
  private suggestedResponse?: string;

  // Metadata
  private sentAt?: Date;
  private receivedAt?: Date;
  private readAt?: Date;
  private createdAt: Date;
}

enum CommunicationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  CHAT = 'chat',
  WHATSAPP = 'whatsapp',
  TEAMS = 'teams',
  SLACK = 'slack'
}

enum MessageDirection {
  INCOMING = 'incoming',
  OUTGOING = 'outgoing'
}

enum MessageStatus {
  DRAFT = 'draft',
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed'
}

enum MessagePriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}

enum ContentType {
  PLAIN_TEXT = 'text/plain',
  HTML = 'text/html',
  MARKDOWN = 'text/markdown'
}
```

**Commands:**

```typescript
// Compose new message
compose(data: ComposeMessageData): MessageComposed {
  // Validate content
  if (!this.content || this.content.trim().length === 0) {
    throw new Error('Message content cannot be empty');
  }

  // Validate recipients
  if (this.recipients.length === 0) {
    throw new Error('At least one recipient required');
  }

  // Email-specific validation
  if (this.channel === CommunicationChannel.EMAIL) {
    if (!this.subject || this.subject.trim().length === 0) {
      throw new Error('Email subject cannot be empty');
    }
  }

  this.status = MessageStatus.DRAFT;

  return new MessageComposed({
    messageId: this.id,
    userId: this.userId,
    channel: this.channel,
    subject: this.subject,
    recipients: this.recipients.map(r => r.address.value),
    contentPreview: this.content.substring(0, 100)
  });
}

// Send message
send(): MessageSent {
  if (this.status !== MessageStatus.DRAFT) {
    throw new Error('Can only send draft messages');
  }

  if (this.recipients.length === 0) {
    throw new Error('Cannot send message without recipients');
  }

  this.status = MessageStatus.SENDING;
  this.sentAt = new Date();

  return new MessageSent({
    messageId: this.id,
    userId: this.userId,
    channel: this.channel,
    subject: this.subject,
    recipients: this.recipients.map(r => r.address.value),
    sentAt: this.sentAt
  });
}

// Receive message
receive(data: ReceiveMessageData): MessageReceived {
  this.direction = MessageDirection.INCOMING;
  this.status = MessageStatus.DELIVERED;
  this.receivedAt = new Date();

  return new MessageReceived({
    messageId: this.id,
    userId: this.userId,
    channel: this.channel,
    sender: this.sender.address.value,
    subject: this.subject,
    contentPreview: this.content.substring(0, 100),
    receivedAt: this.receivedAt,
    priority: this.priority
  });
}

// Mark as read
markAsRead(): MessageRead {
  if (this.isRead) {
    return null; // Already read
  }

  this.isRead = true;
  this.readAt = new Date();

  return new MessageRead({
    messageId: this.id,
    readAt: this.readAt
  });
}

// Star message
star(): MessageStarred {
  this.isStarred = true;

  return new MessageStarred({
    messageId: this.id,
    starredAt: new Date()
  });
}

// Archive message
archive(): MessageArchived {
  this.isArchived = true;

  return new MessageArchived({
    messageId: this.id,
    archivedAt: new Date()
  });
}

// Add attachment
addAttachment(attachment: Attachment): AttachmentAdded {
  // Validate file size
  if (attachment.size > MAX_ATTACHMENT_SIZE) {
    throw new Error(`Attachment exceeds maximum size of ${MAX_ATTACHMENT_SIZE} bytes`);
  }

  this.attachments.push(attachment);

  return new AttachmentAdded({
    messageId: this.id,
    attachmentId: attachment.id,
    filename: attachment.filename,
    size: attachment.size
  });
}

// Analyze content (AI)
analyze(analysis: MessageAnalysis): MessageAnalyzed {
  this.sentiment = analysis.sentiment;
  this.category = analysis.category;
  this.actionItems = analysis.actionItems;
  this.suggestedResponse = analysis.suggestedResponse;

  return new MessageAnalyzed({
    messageId: this.id,
    sentiment: this.sentiment,
    category: this.category,
    actionItemCount: this.actionItems.length,
    hasSuggestedResponse: !!this.suggestedResponse
  });
}

// Reply to message
reply(content: string, replyAll: boolean = false): Message {
  const recipients = replyAll
    ? [this.sender, ...this.recipients.filter(r => !r.isCurrentUser())]
    : [this.sender];

  const replyMessage = new Message(
    generateId(),
    this.userId,
    this.tenantId,
    this.channel,
    MessageDirection.OUTGOING,
    `Re: ${this.subject}`,
    content,
    recipients
  );

  replyMessage.setInReplyTo(this.id);
  replyMessage.setThreadId(this.threadId || this.id);

  return replyMessage;
}
```

**Queries:**

```typescript
// Check if from external sender
isExternal(): boolean {
  return !this.sender.isInternal();
}

// Check if requires action
requiresAction(): boolean {
  return this.actionItems.length > 0 && this.actionItems.some(item => !item.completed);
}

// Get pending action items
getPendingActionItems(): ActionItem[] {
  return this.actionItems.filter(item => !item.completed);
}

// Check if part of thread
isPartOfThread(): boolean {
  return !!this.threadId;
}

// Check if urgent
isUrgent(): boolean {
  return this.priority === MessagePriority.URGENT ||
         this.priority === MessagePriority.HIGH;
}

// Get content preview
getPreview(maxLength: number = 100): string {
  // Strip HTML if HTML content
  let text = this.content;
  if (this.contentType === ContentType.HTML) {
    text = this.stripHtml(text);
  }

  return text.length > maxLength
    ? text.substring(0, maxLength) + '...'
    : text;
}
```

#### 2. Thread (Aggregate Root)

**Description:** A conversation consisting of multiple related messages.

**Invariants:**
- Must have at least one message
- All messages must have same participants (with additions allowed)
- Thread subject derived from first message

**State:**
```typescript
class Thread {
  // Identity
  private readonly id: string;
  private readonly userId: string;
  private readonly tenantId: string;

  // Core attributes
  private subject: string;
  private channel: CommunicationChannel;
  private messageIds: string[] = [];

  // Participants
  private participants: Participant[] = [];

  // Status
  private isRead: boolean = false;
  private isMuted: boolean = false;
  private lastMessageAt: Date;

  // Metadata
  private createdAt: Date;
  private updatedAt: Date;
}
```

**Commands:**

```typescript
// Add message to thread
addMessage(messageId: string, message: Message): MessageAddedToThread {
  // Validate channel consistency
  if (message.getChannel() !== this.channel) {
    throw new Error('Message channel must match thread channel');
  }

  this.messageIds.push(messageId);
  this.lastMessageAt = message.getSentAt() || new Date();
  this.updatedAt = new Date();

  // Update participants if new ones
  for (const participant of message.getAllParticipants()) {
    if (!this.hasParticipant(participant)) {
      this.participants.push(participant);
    }
  }

  // Mark as unread if incoming
  if (message.getDirection() === MessageDirection.INCOMING) {
    this.isRead = false;
  }

  return new MessageAddedToThread({
    threadId: this.id,
    messageId,
    participantCount: this.participants.length,
    messageCount: this.messageIds.length
  });
}

// Mark thread as read
markAsRead(): ThreadRead {
  this.isRead = true;

  return new ThreadRead({
    threadId: this.id,
    messageCount: this.messageIds.length
  });
}

// Mute thread
mute(): ThreadMuted {
  this.isMuted = true;

  return new ThreadMuted({
    threadId: this.id
  });
}
```

**Queries:**

```typescript
// Get message count
getMessageCount(): number {
  return this.messageIds.length;
}

// Check if has unread messages
hasUnreadMessages(): boolean {
  return !this.isRead;
}

// Get other participants (excluding current user)
getOtherParticipants(): Participant[] {
  return this.participants.filter(p => !p.isCurrentUser());
}
```

### Value Objects

#### Participant

```typescript
class Participant {
  constructor(
    public readonly address: EmailAddress | PhoneNumber,
    public readonly name?: string,
    public readonly role?: ParticipantRole
  ) {}

  isCurrentUser(): boolean {
    // Check against current user's addresses
    return this.address.belongsToCurrentUser();
  }

  isInternal(): boolean {
    // Check if email domain is organization domain
    if (this.address instanceof EmailAddress) {
      return this.address.isInternalDomain();
    }
    return false;
  }

  toString(): string {
    return this.name
      ? `${this.name} <${this.address.value}>`
      : this.address.value;
  }
}

enum ParticipantRole {
  SENDER = 'sender',
  RECIPIENT = 'recipient',
  CC = 'cc',
  BCC = 'bcc'
}
```

#### EmailAddress

```typescript
class EmailAddress {
  private constructor(public readonly value: string) {}

  static create(email: string): EmailAddress {
    if (!this.isValid(email)) {
      throw new Error('Invalid email format');
    }
    return new EmailAddress(email.toLowerCase());
  }

  private static isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  getDomain(): string {
    return this.value.split('@')[1];
  }

  isInternalDomain(): boolean {
    const internalDomains = ['company.com', 'internal.org'];
    return internalDomains.includes(this.getDomain());
  }

  belongsToCurrentUser(): boolean {
    // Check against user's email addresses
    // Implementation depends on user context
    return false;
  }

  equals(other: EmailAddress): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
```

#### PhoneNumber

```typescript
class PhoneNumber {
  private constructor(
    public readonly value: string,
    public readonly countryCode: string
  ) {}

  static create(phoneNumber: string, countryCode: string = '+1'): PhoneNumber {
    const normalized = this.normalize(phoneNumber);
    if (!this.isValid(normalized)) {
      throw new Error('Invalid phone number');
    }
    return new PhoneNumber(normalized, countryCode);
  }

  private static normalize(phone: string): string {
    // Remove all non-digit characters
    return phone.replace(/\D/g, '');
  }

  private static isValid(phone: string): boolean {
    // Basic validation: 10-15 digits
    return /^\d{10,15}$/.test(phone);
  }

  toString(): string {
    return `${this.countryCode}${this.value}`;
  }

  equals(other: PhoneNumber): boolean {
    return this.value === other.value && this.countryCode === other.countryCode;
  }
}
```

#### Attachment

```typescript
class Attachment {
  constructor(
    public readonly id: string,
    public readonly filename: string,
    public readonly mimeType: string,
    public readonly size: number,
    public readonly url?: string,
    public readonly content?: Buffer
  ) {
    if (size <= 0) {
      throw new Error('Attachment size must be positive');
    }
  }

  isImage(): boolean {
    return this.mimeType.startsWith('image/');
  }

  isDocument(): boolean {
    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    return documentTypes.includes(this.mimeType);
  }

  getExtension(): string {
    return this.filename.split('.').pop() || '';
  }

  getSizeKB(): number {
    return Math.round(this.size / 1024);
  }
}

const MAX_ATTACHMENT_SIZE = 25 * 1024 * 1024; // 25 MB
```

#### Sentiment

```typescript
enum Sentiment {
  VERY_NEGATIVE = 'very_negative',
  NEGATIVE = 'negative',
  NEUTRAL = 'neutral',
  POSITIVE = 'positive',
  VERY_POSITIVE = 'very_positive'
}
```

#### MessageCategory

```typescript
enum MessageCategory {
  // Work-related
  ACTION_REQUIRED = 'action_required',
  MEETING_REQUEST = 'meeting_request',
  PROJECT_UPDATE = 'project_update',
  URGENT = 'urgent',

  // Personal
  PERSONAL = 'personal',
  SOCIAL = 'social',
  NEWSLETTER = 'newsletter',
  PROMOTION = 'promotion',

  // System
  NOTIFICATION = 'notification',
  RECEIPT = 'receipt',
  INVOICE = 'invoice',

  // Other
  SPAM = 'spam',
  UNCATEGORIZED = 'uncategorized'
}
```

#### ActionItem

```typescript
class ActionItem {
  constructor(
    public readonly description: string,
    public readonly dueDate?: Date,
    public readonly priority: MessagePriority = MessagePriority.NORMAL,
    public readonly completed: boolean = false
  ) {
    if (!description || description.trim().length === 0) {
      throw new Error('Action item description cannot be empty');
    }
  }

  complete(): ActionItem {
    return new ActionItem(
      this.description,
      this.dueDate,
      this.priority,
      true
    );
  }

  isOverdue(): boolean {
    if (!this.dueDate || this.completed) return false;
    return new Date() > this.dueDate;
  }
}
```

#### MessageAnalysis

```typescript
interface MessageAnalysis {
  sentiment: Sentiment;
  category: MessageCategory;
  actionItems: ActionItem[];
  suggestedResponse?: string;
  topics: string[];
  keyPhrases: string[];
  entities: Entity[];
}

interface Entity {
  type: EntityType;
  text: string;
  confidence: number;
}

enum EntityType {
  PERSON = 'person',
  ORGANIZATION = 'organization',
  LOCATION = 'location',
  DATE = 'date',
  MONEY = 'money',
  PHONE = 'phone',
  EMAIL = 'email'
}
```

## Domain Events

### Message Events

```typescript
interface MessageComposed extends DomainEvent {
  eventType: 'MessageComposed';
  aggregateType: 'Message';
  payload: {
    messageId: string;
    userId: string;
    channel: CommunicationChannel;
    subject?: string;
    recipients: string[];
    contentPreview: string;
  };
}

interface MessageSent extends DomainEvent {
  eventType: 'MessageSent';
  aggregateType: 'Message';
  payload: {
    messageId: string;
    userId: string;
    channel: CommunicationChannel;
    subject?: string;
    recipients: string[];
    sentAt: Date;
  };
}

interface MessageReceived extends DomainEvent {
  eventType: 'MessageReceived';
  aggregateType: 'Message';
  payload: {
    messageId: string;
    userId: string;
    channel: CommunicationChannel;
    sender: string;
    subject?: string;
    contentPreview: string;
    receivedAt: Date;
    priority: MessagePriority;
  };
}

interface MessageRead extends DomainEvent {
  eventType: 'MessageRead';
  aggregateType: 'Message';
  payload: {
    messageId: string;
    readAt: Date;
  };
}

interface MessageAnalyzed extends DomainEvent {
  eventType: 'MessageAnalyzed';
  aggregateType: 'Message';
  payload: {
    messageId: string;
    sentiment: Sentiment;
    category: MessageCategory;
    actionItemCount: number;
    hasSuggestedResponse: boolean;
  };
}
```

### Thread Events

```typescript
interface ThreadCreated extends DomainEvent {
  eventType: 'ThreadCreated';
  aggregateType: 'Thread';
  payload: {
    threadId: string;
    userId: string;
    subject: string;
    channel: CommunicationChannel;
    participants: string[];
  };
}

interface MessageAddedToThread extends DomainEvent {
  eventType: 'MessageAddedToThread';
  aggregateType: 'Thread';
  payload: {
    threadId: string;
    messageId: string;
    participantCount: number;
    messageCount: number;
  };
}

interface ThreadRead extends DomainEvent {
  eventType: 'ThreadRead';
  aggregateType: 'Thread';
  payload: {
    threadId: string;
    messageCount: number;
  };
}
```

## Proactive Triggers

The Communication Context emits the following **Proactive Triggers** to the Proactivity Context. These are opportunities detected from communication data that may warrant user notification:

**Terminology Clarification:**
- **Data Signals:** Pull-based state data exposed via MCP (e.g., `communication.unread_count`, `communication.inbox_status`)
- **Domain Events:** Push-based state changes (e.g., `MessageReceived`, `MessageSent`)
- **Proactive Triggers:** Derived opportunities from message analysis (below)

### 1. URGENT_MESSAGE
**Trigger:** High-priority or urgent message received
**Data:**
```typescript
{
  triggerType: 'URGENT_MESSAGE',
  opportunityType: OpportunityType.URGENT,
  messageId: string,
  sender: string,
  subject: string,
  channel: CommunicationChannel,
  receivedAt: Date,
  confidence: number
}
```

### 2. ACTION_REQUIRED
**Trigger:** Message contains action items
**Data:**
```typescript
{
  triggerType: 'ACTION_REQUIRED',
  opportunityType: OpportunityType.TIME_SENSITIVE,
  messageId: string,
  sender: string,
  actionItems: string[],
  dueDate?: Date,
  confidence: number
}
```

### 3. RESPONSE_OVERDUE
**Trigger:** Message from important sender not replied to within expected timeframe
**Data:**
```typescript
{
  triggerType: 'RESPONSE_OVERDUE',
  opportunityType: OpportunityType.TIME_SENSITIVE,
  messageId: string,
  sender: string,
  receivedAt: Date,
  daysSinceReceived: number,
  confidence: number
}
```

### 4. MEETING_REQUEST
**Trigger:** Message contains meeting invitation
**Data:**
```typescript
{
  triggerType: 'MEETING_REQUEST',
  opportunityType: OpportunityType.TIME_SENSITIVE,
  messageId: string,
  sender: string,
  proposedDate?: Date,
  requiresResponse: boolean,
  confidence: number
}
```

### 5. NEGATIVE_SENTIMENT
**Trigger:** Message has negative sentiment (complaint, angry tone)
**Data:**
```typescript
{
  triggerType: 'NEGATIVE_SENTIMENT',
  opportunityType: OpportunityType.URGENT,
  messageId: string,
  sender: string,
  sentiment: Sentiment,
  confidence: number
}
```

**Note:** These triggers are sent to the Proactivity Context which evaluates them against user preferences and creates Suggestions if appropriate.

## Business Rules

### Message Rules

1. **Recipient Requirement:** Outgoing messages must have at least one recipient
2. **Subject Requirement:** Emails must have a subject
3. **Content Requirement:** Messages cannot be empty
4. **Size Limit:** Total message size (including attachments) cannot exceed 25MB
5. **Immutability:** Sent messages cannot be edited (only recalled if supported by channel)

### Thread Rules

1. **Channel Consistency:** All messages in a thread must use the same channel
2. **Participant Continuity:** New participants can join, but cannot remove original participants
3. **Subject Inheritance:** Reply messages inherit thread subject with "Re:" prefix

## Integration Patterns

### Email Provider Integration (Anti-Corruption Layer)

```typescript
class GmailACL {
  async fetchMessages(since: Date): Promise<Message[]> {
    const gmailMessages = await this.mcpClient.callTool(
      'gmail_get_messages',
      { after: since.getTime() / 1000 }
    );

    return gmailMessages.map(gm => {
      const message = new Message(
        generateId(),
        this.userId,
        this.tenantId,
        CommunicationChannel.EMAIL,
        MessageDirection.INCOMING,
        gm.payload.headers.find(h => h.name === 'Subject')?.value,
        this.extractBody(gm.payload),
        []
      );

      // Set sender
      const from = gm.payload.headers.find(h => h.name === 'From')?.value;
      message.setSender(this.parseEmailAddress(from));

      // Set recipients
      const to = gm.payload.headers.find(h => h.name === 'To')?.value;
      message.setRecipients(this.parseEmailAddresses(to));

      // External ID
      message.setExternalId(gm.id, 'gmail');

      return message;
    });
  }

  async sendMessage(message: Message): Promise<string> {
    const gmailMessage = {
      to: message.getRecipients().map(r => r.address.value).join(', '),
      subject: message.getSubject(),
      body: message.getContent(),
      threadId: message.getThreadId()
    };

    const result = await this.mcpClient.callTool('gmail_send_message', gmailMessage);
    return result.id;
  }

  private extractBody(payload: any): string {
    // Extract body from Gmail's complex structure
    if (payload.body?.data) {
      return Buffer.from(payload.body.data, 'base64').toString();
    }
    if (payload.parts) {
      // Find text/plain part
      const textPart = payload.parts.find(p => p.mimeType === 'text/plain');
      if (textPart?.body?.data) {
        return Buffer.from(textPart.body.data, 'base64').toString();
      }
    }
    return '';
  }
}
```

### AI Analysis Service (Domain Service)

```typescript
class MessageAnalysisService {
  async analyzeMessage(message: Message): Promise<MessageAnalysis> {
    // Use LLM to analyze message content
    const prompt = `
Analyze the following ${message.getChannel()} message:

Subject: ${message.getSubject()}
From: ${message.getSender().toString()}
Content:
${message.getContent()}

Provide:
1. Sentiment (very_negative, negative, neutral, positive, very_positive)
2. Category (action_required, meeting_request, urgent, etc.)
3. Action items (if any)
4. Suggested response (if appropriate)
5. Key topics and entities
    `;

    const analysis = await this.llmClient.analyze(prompt);

    return {
      sentiment: analysis.sentiment,
      category: analysis.category,
      actionItems: analysis.actionItems.map(item =>
        new ActionItem(
          item.description,
          item.dueDate ? new Date(item.dueDate) : undefined,
          item.priority
        )
      ),
      suggestedResponse: analysis.suggestedResponse,
      topics: analysis.topics,
      keyPhrases: analysis.keyPhrases,
      entities: analysis.entities
    };
  }

  async generateResponse(
    message: Message,
    tone: ResponseTone = ResponseTone.PROFESSIONAL
  ): Promise<string> {
    const prompt = `
Generate a ${tone} response to the following message:

Subject: ${message.getSubject()}
From: ${message.getSender().toString()}
Content:
${message.getContent()}

Provide a concise, appropriate response.
    `;

    return await this.llmClient.generate(prompt);
  }
}

enum ResponseTone {
  PROFESSIONAL = 'professional',
  FRIENDLY = 'friendly',
  FORMAL = 'formal',
  BRIEF = 'brief'
}
```

## Use Cases

### 1. Receive and Analyze Message

**Actor:** External System (email provider)

**Flow:**
1. Email arrives at provider (Gmail)
2. Webhook triggers sync
3. GmailACL fetches and translates message
4. Create Message aggregate
5. Emit MessageReceived event
6. MessageAnalysisService analyzes content
7. If urgent or action required: Emit signal to Proactivity
8. Proactivity presents suggestion to user

### 2. Compose and Send Response

**Actor:** User

**Flow:**
1. User requests to reply to message
2. MessageAnalysisService generates suggested response
3. User edits/approves response
4. Create reply Message (linked to original via threadId)
5. Send via GmailACL
6. Emit MessageSent event

### 3. Detect Overdue Responses

**Actor:** Proactivity Context (scheduled)

**Flow:**
1. Periodically scan unread messages from important senders
2. Check last received date
3. If > threshold (e.g., 3 days) and no reply: Emit RESPONSE_OVERDUE signal
4. Orchestrator suggests replying to user

### 4. Thread Management

**Actor:** System

**Flow:**
1. Message arrives with In-Reply-To header
2. Find existing Thread or create new one
3. Add message to Thread aggregate
4. Update thread status (unread if incoming)
5. Group messages by thread in UI

## Persistence

### Message Repository

```typescript
interface MessageRepository {
  save(message: Message): Promise<void>;
  findById(id: string): Promise<Message | null>;
  findByUserId(userId: string): Promise<Message[]>;
  findUnread(userId: string): Promise<Message[]>;
  findByThread(threadId: string): Promise<Message[]>;
  findByChannel(
    userId: string,
    channel: CommunicationChannel
  ): Promise<Message[]>;
  search(
    userId: string,
    query: string
  ): Promise<Message[]>;
}
```

### Thread Repository

```typescript
interface ThreadRepository {
  save(thread: Thread): Promise<void>;
  findById(id: string): Promise<Thread | null>;
  findByUserId(userId: string): Promise<Thread[]>;
  findUnread(userId: string): Promise<Thread[]>;
}
```

## Testing Strategy

### Unit Tests

```typescript
describe('Message', () => {
  it('should not allow sending without recipients', () => {
    const message = createMessage();
    // No recipients set

    expect(() => message.send())
      .toThrow('Cannot send message without recipients');
  });

  it('should extract action items from analysis', () => {
    const message = createMessage();
    const analysis = {
      sentiment: Sentiment.NEUTRAL,
      category: MessageCategory.ACTION_REQUIRED,
      actionItems: [
        new ActionItem('Review document by Friday'),
        new ActionItem('Schedule follow-up call')
      ]
    };

    message.analyze(analysis);

    expect(message.requiresAction()).toBe(true);
    expect(message.getActionItems().length).toBe(2);
  });
});
```

## Performance Considerations

1. **Message Indexing:** Full-text search on content
   - **Optimization:** Use Elasticsearch for message search
   - **Index:** subject, content, sender, recipients

2. **Thread Grouping:** Can be expensive for large mailboxes
   - **Optimization:** Cache thread metadata
   - **Index:** threadId + lastMessageAt

3. **AI Analysis:** LLM calls are slow
   - **Optimization:** Analyze asynchronously
   - **Priority:** Urgent messages analyzed first

4. **Attachment Storage:** Large files impact performance
   - **Optimization:** Store attachments in object storage (S3)
   - **Reference:** Only URL in database

## Future Considerations

1. **Multi-Account Support:** Manage multiple email accounts
2. **Smart Folders:** Auto-categorize messages into folders
3. **Snooze:** Temporarily hide messages until later
4. **Templates:** Reusable response templates
5. **Scheduling:** Schedule messages to send later
6. **Read Receipts:** Track if recipients read message
7. **Smart Compose:** AI autocomplete while typing
8. **Voice Messages:** Support for voice message transcription

---

**End of Document**
