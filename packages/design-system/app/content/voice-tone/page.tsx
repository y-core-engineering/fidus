'use client';

export default function VoiceTonePage() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Voice and Tone</h1>
      <p className="lead">
        Fidus speaks with a friendly, privacy-conscious, and empowering voice. We help users
        take control of their digital life without being pushy or invasive.
      </p>

      <h2>Our Voice</h2>
      <p>
        Voice is our personality - consistent across all communication. Fidus is:
      </p>

      <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Friendly</h3>
          <p className="text-sm text-muted-foreground">
            Approachable and conversational, like a helpful assistant. Never robotic or cold.
          </p>
        </div>
        <div className="p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Privacy-Conscious</h3>
          <p className="text-sm text-muted-foreground">
            Transparent about data handling. Always explain what happens to user information.
          </p>
        </div>
        <div className="p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Empowering</h3>
          <p className="text-sm text-muted-foreground">
            Put users in control. Suggest, don't dictate. Respect user decisions.
          </p>
        </div>
      </div>

      <h2>Tone Variations</h2>
      <p>
        Tone adapts to context while maintaining our voice. Different situations call for different tones.
      </p>

      <h3>Informational (Neutral)</h3>
      <p>
        When explaining features or providing information.
      </p>
      <div className="not-prose p-4 bg-muted rounded-lg mb-6">
        <p className="text-sm mb-2 text-muted-foreground">Example:</p>
        <p className="text-md">
          "Your calendar events are stored locally on your device. They never leave your computer
          unless you choose to sync them."
        </p>
      </div>

      <h3>Encouraging (Positive)</h3>
      <p>
        When congratulating users or confirming successful actions.
      </p>
      <div className="not-prose p-4 bg-muted rounded-lg mb-6">
        <p className="text-sm mb-2 text-muted-foreground">Example:</p>
        <p className="text-md">
          "Great! Your budget is set up. We'll notify you when you're approaching your limit."
        </p>
      </div>

      <h3>Cautious (Warning)</h3>
      <p>
        When alerting users to potential issues or requiring attention.
      </p>
      <div className="not-prose p-4 bg-muted rounded-lg mb-6">
        <p className="text-sm mb-2 text-muted-foreground">Example:</p>
        <p className="text-md">
          "You have a double booking tomorrow at 2 PM. Would you like to reschedule one of these
          appointments?"
        </p>
      </div>

      <h3>Serious (Error)</h3>
      <p>
        When communicating errors or critical issues.
      </p>
      <div className="not-prose p-4 bg-muted rounded-lg mb-6">
        <p className="text-sm mb-2 text-muted-foreground">Example:</p>
        <p className="text-md">
          "We couldn't sync your calendar. Your data is safe locally. Check your connection and try again."
        </p>
      </div>

      <h2>Writing Guidelines</h2>

      <h3>Do's</h3>
      <ul>
        <li>Use active voice ("You can schedule appointments" not "Appointments can be scheduled")</li>
        <li>Address the user as "you"</li>
        <li>Use contractions when natural ("We'll" instead of "We will")</li>
        <li>Be specific and concrete</li>
        <li>Keep sentences short and scannable</li>
        <li>Always explain privacy implications</li>
        <li>Give users control with clear options</li>
      </ul>

      <h3>Don'ts</h3>
      <ul>
        <li>Don't use jargon or technical terms without explanation</li>
        <li>Don't make assumptions about user knowledge</li>
        <li>Don't use humor that could be misunderstood</li>
        <li>Don't be overly formal or corporate</li>
        <li>Don't use dark patterns or manipulative language</li>
        <li>Don't hide information about data handling</li>
        <li>Don't make decisions for users without their consent</li>
      </ul>

      <h2>Example Transformations</h2>

      <table>
        <thead>
          <tr>
            <th>Before (Not Fidus)</th>
            <th>After (Fidus Voice)</th>
            <th>Why Better</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>"An error has occurred"</td>
            <td>"We couldn't complete that action. Your data is safe."</td>
            <td>Specific, reassuring</td>
          </tr>
          <tr>
            <td>"Optimize your schedule"</td>
            <td>"Want to reschedule this meeting to free up your afternoon?"</td>
            <td>Concrete, gives choice</td>
          </tr>
          <tr>
            <td>"Enable notifications"</td>
            <td>"Get alerts for urgent opportunities. You can turn this off anytime."</td>
            <td>Explains value, reassures control</td>
          </tr>
          <tr>
            <td>"Data will be uploaded to cloud"</td>
            <td>"This requires cloud processing. Your data will be encrypted in transit."</td>
            <td>Transparent, explains privacy measures</td>
          </tr>
          <tr>
            <td>"Sync failed"</td>
            <td>"Couldn't sync to the cloud. Your local data is safe. Try again?"</td>
            <td>Reassuring, actionable</td>
          </tr>
        </tbody>
      </table>

      <h2>Privacy-First Language</h2>
      <p>
        Always be transparent about data handling. Users should never be surprised about what
        happens to their information.
      </p>

      <h3>When Local Processing</h3>
      <div className="not-prose p-4 bg-muted rounded-lg mb-6">
        <p className="text-md">
          "This runs entirely on your device. Nothing is sent to any server."
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Use with 🔒 Local badge
        </p>
      </div>

      <h3>When Cloud Processing</h3>
      <div className="not-prose p-4 bg-muted rounded-lg mb-6">
        <p className="text-md">
          "This requires cloud processing for better results. Your data is encrypted in transit and
          deleted after processing."
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Use with ☁️ Cloud badge
        </p>
      </div>

      <h3>When Encrypted</h3>
      <div className="not-prose p-4 bg-muted rounded-lg mb-6">
        <p className="text-md">
          "Your data is encrypted end-to-end. Only you can read it."
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Use with 🔐 Encrypted badge
        </p>
      </div>

      <h2>Button and Action Labels</h2>

      <h3>Primary Actions</h3>
      <ul>
        <li>"Schedule Meeting" (not "Add Event")</li>
        <li>"Set Budget" (not "Create Budget")</li>
        <li>"View Details" (not "More Info")</li>
        <li>"Confirm" (not "OK")</li>
      </ul>

      <h3>Secondary Actions</h3>
      <ul>
        <li>"Maybe Later" (not "Cancel")</li>
        <li>"Remind Me Tomorrow" (not "Snooze")</li>
        <li>"Learn More" (not "Help")</li>
      </ul>

      <h3>Destructive Actions</h3>
      <ul>
        <li>"Delete Forever" (not "Delete")</li>
        <li>"Remove This" (not "Remove")</li>
        <li>Always ask for confirmation on destructive actions</li>
      </ul>

      <h2>Success and Error Messages</h2>

      <h3>Success Messages</h3>
      <ul>
        <li>Be specific about what succeeded</li>
        <li>Confirm the result</li>
        <li>Suggest next steps if relevant</li>
      </ul>
      <div className="not-prose p-4 bg-muted rounded-lg mb-6">
        <p className="text-md">
          "✓ Meeting scheduled for tomorrow at 2 PM. We'll remind you 15 minutes before."
        </p>
      </div>

      <h3>Error Messages</h3>
      <ul>
        <li>Explain what went wrong</li>
        <li>Reassure user about data safety</li>
        <li>Provide actionable next steps</li>
      </ul>
      <div className="not-prose p-4 bg-muted rounded-lg mb-6">
        <p className="text-md">
          "We couldn't connect to your calendar service. Your local events are safe. Check your
          internet connection and try again."
        </p>
      </div>

      <h2>Empty States</h2>
      <p>
        When there's no content, be helpful and encouraging.
      </p>
      <div className="not-prose p-4 bg-muted rounded-lg mb-6">
        <p className="text-md font-semibold mb-2">No upcoming appointments</p>
        <p className="text-sm text-muted-foreground">
          Your calendar is clear. Schedule your first meeting or import your existing calendar.
        </p>
      </div>

      <h2>Onboarding</h2>
      <p>
        First impressions matter. Be welcoming and explain value clearly.
      </p>
      <div className="not-prose p-4 bg-muted rounded-lg mb-6">
        <p className="text-xl font-semibold mb-2">Welcome to Fidus</p>
        <p className="text-md mb-4">
          Your privacy-first AI assistant. Let's set up your first domain to get started.
        </p>
        <p className="text-sm text-muted-foreground">
          Everything runs on your device by default. You control your data.
        </p>
      </div>

      <h2>Quick Reference</h2>

      <table>
        <thead>
          <tr>
            <th>Context</th>
            <th>Voice Quality</th>
            <th>Example Phrase</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Feature explanation</td>
            <td>Friendly, clear</td>
            <td>"Schedule meetings with natural language"</td>
          </tr>
          <tr>
            <td>Success feedback</td>
            <td>Encouraging</td>
            <td>"Great! Your budget is all set."</td>
          </tr>
          <tr>
            <td>Warning</td>
            <td>Cautious, helpful</td>
            <td>"You're over budget this month. Review spending?"</td>
          </tr>
          <tr>
            <td>Error</td>
            <td>Serious, reassuring</td>
            <td>"Sync failed. Your data is safe locally."</td>
          </tr>
          <tr>
            <td>Privacy explanation</td>
            <td>Transparent</td>
            <td>"This runs on your device. Nothing is sent anywhere."</td>
          </tr>
          <tr>
            <td>Empty state</td>
            <td>Helpful</td>
            <td>"No events yet. Schedule your first meeting."</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
