'use client';

export default function WritingForPrivacyPage() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Writing for Privacy</h1>
      <p className="lead">
        Guidelines for communicating privacy in a transparent, user-friendly way.
        Privacy is a core Fidus value - our language must reflect that commitment.
      </p>

      <h2>Core Principles</h2>

      <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Transparency</h3>
          <p className="text-sm text-muted-foreground">
            Always explain where data goes, what happens to it, and why.
          </p>
        </div>
        <div className="p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Clarity</h3>
          <p className="text-sm text-muted-foreground">
            Use plain language. Avoid legal jargon and technical terms.
          </p>
        </div>
        <div className="p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Control</h3>
          <p className="text-sm text-muted-foreground">
            Emphasize user choice. Never hide privacy implications.
          </p>
        </div>
      </div>

      <h2>Privacy Levels</h2>
      <p>
        Fidus has three privacy levels, each with specific language patterns.
      </p>

      <h3>🔒 Local Processing</h3>
      <p>
        <strong>Highest Privacy:</strong> Data never leaves the user's device.
      </p>
      <div className="not-prose mb-6">
        <div className="p-4 bg-muted rounded-lg mb-2">
          <p className="text-sm text-muted-foreground mb-2">Messaging Template:</p>
          <p className="text-md">
            "This runs entirely on your device. Nothing is sent to any server."
          </p>
        </div>
        <div className="p-4 bg-muted rounded-lg mb-2">
          <p className="text-sm text-muted-foreground mb-2">Alternative:</p>
          <p className="text-md">
            "Your [data type] stays on your device. We never see it."
          </p>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Example:</p>
          <p className="text-md">
            "Your calendar events are processed locally. They never leave your computer."
          </p>
        </div>
      </div>

      <h3>☁️ Cloud Processing</h3>
      <p>
        <strong>Medium Privacy:</strong> Data sent to cloud for processing, then deleted.
      </p>
      <div className="not-prose mb-6">
        <div className="p-4 bg-muted rounded-lg mb-2">
          <p className="text-sm text-muted-foreground mb-2">Messaging Template:</p>
          <p className="text-md">
            "This requires cloud processing for [reason]. Your data is encrypted in transit and
            deleted immediately after processing."
          </p>
        </div>
        <div className="p-4 bg-muted rounded-lg mb-2">
          <p className="text-sm text-muted-foreground mb-2">Alternative:</p>
          <p className="text-md">
            "We'll send this to the cloud to [benefit]. Your data is encrypted and not stored."
          </p>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Example:</p>
          <p className="text-md">
            "This uses cloud AI for better accuracy. Your query is encrypted in transit and
            deleted after we send you the response."
          </p>
        </div>
      </div>

      <h3>🔐 Encrypted Storage</h3>
      <p>
        <strong>Controlled Privacy:</strong> Data stored encrypted, only user can decrypt.
      </p>
      <div className="not-prose mb-6">
        <div className="p-4 bg-muted rounded-lg mb-2">
          <p className="text-sm text-muted-foreground mb-2">Messaging Template:</p>
          <p className="text-md">
            "Your data is encrypted end-to-end. Only you can read it - not even we can access it."
          </p>
        </div>
        <div className="p-4 bg-muted rounded-lg mb-2">
          <p className="text-sm text-muted-foreground mb-2">Alternative:</p>
          <p className="text-md">
            "Stored securely with encryption. You hold the only key."
          </p>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Example:</p>
          <p className="text-md">
            "Your budget data is encrypted before leaving your device. We can't read it - only
            you have the decryption key."
          </p>
        </div>
      </div>

      <h2>When to Explain Privacy</h2>

      <h3>Always Explain</h3>
      <ul>
        <li>First time a feature is used</li>
        <li>When switching from local to cloud processing</li>
        <li>When enabling sync or backup</li>
        <li>When connecting third-party services</li>
        <li>In settings and privacy controls</li>
      </ul>

      <h3>Contextual Badges</h3>
      <p>
        Use Privacy Badges alongside features to show processing location at a glance:
      </p>
      <div className="not-prose mb-6">
        <div className="p-4 bg-muted rounded-lg space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔒</span>
            <span className="text-md">Schedule Appointment (Local)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">☁️</span>
            <span className="text-md">Advanced Search (Cloud)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔐</span>
            <span className="text-md">Sync to Devices (Encrypted)</span>
          </div>
        </div>
      </div>

      <h2>Language Patterns</h2>

      <h3>Explaining Benefits with Privacy Trade-offs</h3>
      <table>
        <thead>
          <tr>
            <th>Bad</th>
            <th>Good</th>
            <th>Why Better</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>"Enable cloud mode"</td>
            <td>"Use cloud AI for faster results. Your data is encrypted."</td>
            <td>Explains benefit and privacy</td>
          </tr>
          <tr>
            <td>"Sync your data"</td>
            <td>"Access your calendar on all devices. Data is encrypted end-to-end."</td>
            <td>Explains value and protection</td>
          </tr>
          <tr>
            <td>"Connect your email"</td>
            <td>"Connect Gmail to manage emails. We only read what you ask for."</td>
            <td>Explains scope and limits</td>
          </tr>
        </tbody>
      </table>

      <h3>Reassuring Users</h3>
      <ul>
        <li>"Your data is safe locally."</li>
        <li>"We never see your [data type]."</li>
        <li>"You're in control of your privacy."</li>
        <li>"Only you can access this information."</li>
        <li>"Encrypted so only you can read it."</li>
      </ul>

      <h3>Asking for Permissions</h3>
      <p>
        When requesting access or permissions, always explain why:
      </p>
      <div className="not-prose mb-6">
        <div className="p-4 bg-muted rounded-lg mb-2">
          <p className="text-sm text-muted-foreground mb-2">❌ Bad:</p>
          <p className="text-md">"Fidus needs access to your calendar."</p>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">✅ Good:</p>
          <p className="text-md">
            "Fidus needs calendar access to detect conflicts and suggest better meeting times.
            Your events stay on your device."
          </p>
        </div>
      </div>

      <h2>Common Scenarios</h2>

      <h3>Switching Processing Modes</h3>
      <p>
        When a user switches from local to cloud processing:
      </p>
      <div className="not-prose p-4 bg-muted rounded-lg mb-6">
        <p className="text-md font-semibold mb-2">Use Cloud AI?</p>
        <p className="text-md text-muted-foreground mb-3">
          Cloud AI provides more accurate results but sends your query to our servers. Your data
          is encrypted in transit and deleted immediately after processing.
        </p>
        <p className="text-sm text-muted-foreground">
          Local AI keeps everything on your device (slower but maximum privacy).
        </p>
      </div>

      <h3>Enabling Sync</h3>
      <p>
        When enabling cross-device sync:
      </p>
      <div className="not-prose p-4 bg-muted rounded-lg mb-6">
        <p className="text-md font-semibold mb-2">Sync Across Devices</p>
        <p className="text-md text-muted-foreground mb-3">
          Access your data on all your devices. Your data is encrypted before leaving your device.
          Only you have the decryption key - not even we can read it.
        </p>
        <p className="text-sm text-muted-foreground">
          Without sync, your data stays only on this device.
        </p>
      </div>

      <h3>Connecting Third-Party Services</h3>
      <p>
        When connecting external services:
      </p>
      <div className="not-prose p-4 bg-muted rounded-lg mb-6">
        <p className="text-md font-semibold mb-2">Connect Google Calendar</p>
        <p className="text-md text-muted-foreground mb-3">
          Fidus will access your calendar to read events and create appointments. We only access
          what you explicitly ask for. You can disconnect anytime.
        </p>
        <p className="text-sm text-muted-foreground">
          We never read your emails or other Google data.
        </p>
      </div>

      <h3>Data Export</h3>
      <p>
        When users export their data:
      </p>
      <div className="not-prose p-4 bg-muted rounded-lg mb-6">
        <p className="text-md font-semibold mb-2">Export Your Data</p>
        <p className="text-md text-muted-foreground mb-3">
          Download all your Fidus data in JSON format. This file contains everything - keep it
          secure. You own your data.
        </p>
        <p className="text-sm text-muted-foreground">
          This export is unencrypted. Store it safely.
        </p>
      </div>

      <h2>Settings and Controls</h2>

      <h3>Privacy Settings Page</h3>
      <p>
        Settings should be clear, actionable, and explain consequences:
      </p>
      <div className="not-prose mb-6">
        <div className="space-y-4">
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-md font-semibold">Local AI Processing</p>
                <p className="text-sm text-muted-foreground">
                  Run all AI on your device. Maximum privacy, slower performance.
                </p>
              </div>
              <div className="text-sm text-primary">Enabled</div>
            </div>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-md font-semibold">Cloud Sync</p>
                <p className="text-sm text-muted-foreground">
                  Access data on all devices. End-to-end encrypted.
                </p>
              </div>
              <div className="text-sm text-muted-foreground">Disabled</div>
            </div>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-md font-semibold">Analytics</p>
                <p className="text-sm text-muted-foreground">
                  Help improve Fidus. Anonymous usage data only.
                </p>
              </div>
              <div className="text-sm text-muted-foreground">Disabled</div>
            </div>
          </div>
        </div>
      </div>

      <h2>What NOT to Say</h2>

      <h3>Avoid Vague Language</h3>
      <ul>
        <li>❌ "We respect your privacy" (too generic)</li>
        <li>✅ "Your data stays on your device" (specific)</li>
      </ul>

      <h3>Avoid Legal Jargon</h3>
      <ul>
        <li>❌ "Data is processed pursuant to our privacy policy"</li>
        <li>✅ "Your data is encrypted and deleted after we respond"</li>
      </ul>

      <h3>Avoid Dismissive Language</h3>
      <ul>
        <li>❌ "Don't worry, your data is safe"</li>
        <li>✅ "Your data is encrypted end-to-end. Only you can read it."</li>
      </ul>

      <h3>Avoid Hidden Implications</h3>
      <ul>
        <li>❌ "Enable smart features" (doesn't mention cloud processing)</li>
        <li>
          ✅ "Enable cloud AI for smart suggestions. Your data is encrypted and not stored."
        </li>
      </ul>

      <h2>Privacy in Error Messages</h2>
      <p>
        Even errors should reassure users about data safety:
      </p>
      <table>
        <thead>
          <tr>
            <th>Error Type</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Sync failure</td>
            <td>"Couldn't sync to cloud. Your local data is safe and unchanged."</td>
          </tr>
          <tr>
            <td>Connection error</td>
            <td>"No internet connection. Working in offline mode - everything stays local."</td>
          </tr>
          <tr>
            <td>Service unavailable</td>
            <td>"Service temporarily unavailable. Your data is safe locally. Try again later."</td>
          </tr>
          <tr>
            <td>Export failure</td>
            <td>"Couldn't export data. Nothing was changed. Your data is safe."</td>
          </tr>
        </tbody>
      </table>

      <h2>Quick Reference</h2>

      <table>
        <thead>
          <tr>
            <th>Situation</th>
            <th>Key Message</th>
            <th>Badge</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Local processing</td>
            <td>"Runs on your device. Nothing sent anywhere."</td>
            <td>🔒 Local</td>
          </tr>
          <tr>
            <td>Cloud processing</td>
            <td>"Uses cloud for [reason]. Encrypted, deleted after."</td>
            <td>☁️ Cloud</td>
          </tr>
          <tr>
            <td>Encrypted storage</td>
            <td>"Encrypted. Only you can read it."</td>
            <td>🔐 Encrypted</td>
          </tr>
          <tr>
            <td>Third-party access</td>
            <td>"We access only what you ask. Disconnect anytime."</td>
            <td>Context-specific</td>
          </tr>
          <tr>
            <td>Sync enabled</td>
            <td>"Encrypted before leaving your device."</td>
            <td>🔐 Encrypted</td>
          </tr>
          <tr>
            <td>Data export</td>
            <td>"You own your data. Keep export secure."</td>
            <td>-</td>
          </tr>
        </tbody>
      </table>

      <h2>Testing Your Copy</h2>
      <p>Ask these questions about privacy-related copy:</p>
      <ul>
        <li>Does it explain WHERE data goes?</li>
        <li>Does it explain WHAT happens to the data?</li>
        <li>Does it explain WHY this benefits the user?</li>
        <li>Does it give the user CONTROL?</li>
        <li>Would a non-technical user understand it?</li>
        <li>Does it avoid legal jargon?</li>
        <li>Does it reassure without dismissing concerns?</li>
      </ul>
    </div>
  );
}
