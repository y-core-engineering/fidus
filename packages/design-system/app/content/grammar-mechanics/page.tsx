'use client';

export default function GrammarMechanicsPage() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Grammar and Mechanics</h1>
      <p className="lead">
        Consistent grammar, capitalization, and punctuation rules for all Fidus content.
        These standards ensure clarity and professionalism across the design system.
      </p>

      <h2>Capitalization</h2>

      <h3>Title Case</h3>
      <p>
        Use Title Case for headings, button labels, and navigation items.
      </p>
      <div className="not-prose mb-6">
        <div className="p-4 bg-muted rounded-lg mb-2">
          <p className="text-sm text-muted-foreground mb-2">✅ Correct:</p>
          <ul className="space-y-1 text-md">
            <li>"Schedule Meeting"</li>
            <li>"View Budget Details"</li>
            <li>"Getting Started Guide"</li>
            <li>"Set Up Your Calendar"</li>
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">❌ Incorrect:</p>
          <ul className="space-y-1 text-md">
            <li>"schedule meeting"</li>
            <li>"View budget details"</li>
            <li>"Getting started guide"</li>
            <li>"Set up your calendar"</li>
          </ul>
        </div>
      </div>

      <h4>Title Case Rules</h4>
      <ul>
        <li>Capitalize the first and last words</li>
        <li>Capitalize all major words (nouns, verbs, adjectives, adverbs)</li>
        <li>Lowercase articles: a, an, the</li>
        <li>Lowercase short prepositions: in, on, at, by, for, of</li>
        <li>Lowercase coordinating conjunctions: and, but, or</li>
      </ul>

      <h4>Examples</h4>
      <ul>
        <li>"View Details" (both major words)</li>
        <li>"Sign in to Account" (lowercase "in" and "to")</li>
        <li>"Add to Calendar" (lowercase "to")</li>
        <li>"Delete Forever" (both major words)</li>
        <li>"Save and Continue" (lowercase "and")</li>
      </ul>

      <h3>Sentence Case</h3>
      <p>
        Use sentence case for body text, descriptions, help text, and error messages.
      </p>
      <div className="not-prose mb-6">
        <div className="p-4 bg-muted rounded-lg mb-2">
          <p className="text-sm text-muted-foreground mb-2">✅ Correct:</p>
          <p className="text-md">
            "Your calendar events are stored locally on your device."
          </p>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">❌ Incorrect:</p>
          <p className="text-md">
            "Your Calendar Events Are Stored Locally On Your Device."
          </p>
        </div>
      </div>

      <h3>All Caps</h3>
      <p>
        Avoid ALL CAPS except for:
      </p>
      <ul>
        <li>Acronyms (API, URL, LLM, AI)</li>
        <li>Keyboard shortcuts (CMD, CTRL, ALT)</li>
        <li>Never use for emphasis - use bold or color instead</li>
      </ul>

      <h2>Punctuation</h2>

      <h3>Periods</h3>
      <ul>
        <li>Use periods at the end of complete sentences in body text</li>
        <li>Don't use periods in button labels</li>
        <li>Don't use periods in headings</li>
        <li>Use periods in multi-sentence descriptions</li>
      </ul>
      <div className="not-prose mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">✅ Correct:</p>
          <p className="text-md mb-2">"Schedule Meeting" (button)</p>
          <p className="text-md">"Your data is safe. We never share it." (description)</p>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">❌ Incorrect:</p>
          <p className="text-md mb-2">"Schedule Meeting." (button)</p>
          <p className="text-md">"Your data is safe We never share it" (description)</p>
        </div>
      </div>

      <h3>Commas</h3>
      <ul>
        <li>Use Oxford comma in lists: "Calendar, Finance, and Travel"</li>
        <li>Use commas to separate clauses</li>
        <li>Don't use comma before "and" in button labels</li>
      </ul>

      <h3>Colons</h3>
      <ul>
        <li>Use colons to introduce lists or explanations</li>
        <li>Don't use colons in headings</li>
        <li>Use colons in form labels: "Email Address:"</li>
      </ul>

      <h3>Quotation Marks</h3>
      <ul>
        <li>Use double quotes for UI text references: "Click the 'Save' button"</li>
        <li>Use single quotes for inline code or technical terms</li>
        <li>Don't use quotes for emphasis - use bold instead</li>
      </ul>

      <h3>Exclamation Points</h3>
      <ul>
        <li>Use sparingly for genuine excitement or success</li>
        <li>Never use multiple exclamation points!!!</li>
        <li>Avoid in error messages or warnings</li>
      </ul>
      <div className="not-prose mb-6">
        <div className="p-4 bg-muted rounded-lg mb-2">
          <p className="text-sm text-muted-foreground mb-2">✅ Good use:</p>
          <p className="text-md">"Budget successfully saved!"</p>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">❌ Overuse:</p>
          <p className="text-md">"Click here to get started!!!"</p>
        </div>
      </div>

      <h2>Numbers and Dates</h2>

      <h3>Numbers</h3>
      <ul>
        <li>Spell out one through nine: "three appointments"</li>
        <li>Use numerals for 10 and above: "15 events"</li>
        <li>Use numerals for measurements: "4 hours", "2 weeks"</li>
        <li>Use numerals in lists and tables</li>
        <li>Use commas for thousands: "1,000" not "1000"</li>
      </ul>

      <h3>Dates</h3>
      <ul>
        <li>Use Month Day, Year format: "October 29, 2025"</li>
        <li>Use ISO format in technical contexts: "2025-10-29"</li>
        <li>Relative dates are friendly: "tomorrow", "next week"</li>
        <li>Don't use ordinals (1st, 2nd) in UI - use "October 1" not "October 1st"</li>
      </ul>

      <h3>Times</h3>
      <ul>
        <li>Use 12-hour format by default: "2:00 PM"</li>
        <li>Include AM/PM in caps with no periods</li>
        <li>Use 24-hour format when user preference is set</li>
        <li>Don't use ":00" for whole hours: "2 PM" not "2:00 PM"</li>
      </ul>

      <h3>Currency</h3>
      <ul>
        <li>Use currency symbol before amount: "$100" not "100$"</li>
        <li>Include decimals for cents: "$10.50"</li>
        <li>Use space for clarity in large amounts: "$1,000,000"</li>
        <li>Spell out currency in text: "100 US dollars" not "$100 USD"</li>
      </ul>

      <h2>Contractions</h2>
      <p>
        Use contractions to sound friendly and conversational.
      </p>
      <table>
        <thead>
          <tr>
            <th>Use This</th>
            <th>Not This</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>We'll notify you</td>
            <td>We will notify you</td>
          </tr>
          <tr>
            <td>You're over budget</td>
            <td>You are over budget</td>
          </tr>
          <tr>
            <td>It's ready</td>
            <td>It is ready</td>
          </tr>
          <tr>
            <td>We've saved your changes</td>
            <td>We have saved your changes</td>
          </tr>
          <tr>
            <td>Can't connect</td>
            <td>Cannot connect</td>
          </tr>
        </tbody>
      </table>

      <h2>Abbreviations and Acronyms</h2>

      <h3>Common Abbreviations</h3>
      <ul>
        <li>Spell out on first use: "Large Language Model (LLM)"</li>
        <li>Use abbreviation for subsequent mentions</li>
        <li>Don't use periods in acronyms: "API" not "A.P.I."</li>
      </ul>

      <h3>Standard Acronyms</h3>
      <table>
        <thead>
          <tr>
            <th>Acronym</th>
            <th>Full Form</th>
            <th>Usage</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>AI</td>
            <td>Artificial Intelligence</td>
            <td>No explanation needed</td>
          </tr>
          <tr>
            <td>API</td>
            <td>Application Programming Interface</td>
            <td>Technical docs only</td>
          </tr>
          <tr>
            <td>LLM</td>
            <td>Large Language Model</td>
            <td>Explain on first use</td>
          </tr>
          <tr>
            <td>UI</td>
            <td>User Interface</td>
            <td>No explanation needed</td>
          </tr>
          <tr>
            <td>URL</td>
            <td>Uniform Resource Locator</td>
            <td>No explanation needed</td>
          </tr>
        </tbody>
      </table>

      <h2>Lists</h2>

      <h3>Bulleted Lists</h3>
      <ul>
        <li>Use for unordered items</li>
        <li>Start each item with capital letter</li>
        <li>Don't use periods if items are fragments</li>
        <li>Use periods if items are complete sentences</li>
        <li>Keep parallel structure (all verbs, all nouns, etc.)</li>
      </ul>

      <h3>Numbered Lists</h3>
      <ol>
        <li>Use for sequential steps</li>
        <li>Start with a verb: "Click the button"</li>
        <li>Keep instructions concise</li>
        <li>Use periods for complete sentences</li>
      </ol>

      <h2>Links</h2>
      <ul>
        <li>Use descriptive link text: "View privacy policy" not "Click here"</li>
        <li>Don't use "link" in link text</li>
        <li>Capitalize link text consistently with surrounding text</li>
        <li>Don't underline text that isn't a link</li>
      </ul>

      <h2>Emphasis</h2>

      <h3>Bold</h3>
      <ul>
        <li>Use for important terms or emphasis</li>
        <li>Use for labels in descriptions</li>
        <li>Don't overuse - loses impact</li>
      </ul>

      <h3>Italics</h3>
      <ul>
        <li>Use for book/product names</li>
        <li>Use for foreign words</li>
        <li>Rarely use for emphasis - prefer bold</li>
      </ul>

      <h3>Code Formatting</h3>
      <ul>
        <li>Use <code>monospace</code> for code snippets</li>
        <li>Use for file names, variable names, functions</li>
        <li>Use for keyboard shortcuts: <code>Cmd+K</code></li>
      </ul>

      <h2>Common Mistakes</h2>

      <table>
        <thead>
          <tr>
            <th>Wrong</th>
            <th>Right</th>
            <th>Why</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>its' privacy</td>
            <td>its privacy</td>
            <td>No apostrophe in possessive "its"</td>
          </tr>
          <tr>
            <td>your going</td>
            <td>you're going</td>
            <td>"You're" = "you are"</td>
          </tr>
          <tr>
            <td>their here</td>
            <td>they're here</td>
            <td>"They're" = "they are"</td>
          </tr>
          <tr>
            <td>alot</td>
            <td>a lot</td>
            <td>Two words</td>
          </tr>
          <tr>
            <td>setup (verb)</td>
            <td>set up (verb)</td>
            <td>"Setup" is a noun</td>
          </tr>
          <tr>
            <td>login (verb)</td>
            <td>log in (verb)</td>
            <td>"Login" is a noun</td>
          </tr>
        </tbody>
      </table>

      <h2>Quick Reference</h2>

      <table>
        <thead>
          <tr>
            <th>Element</th>
            <th>Capitalization</th>
            <th>Punctuation</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Button label</td>
            <td>Title Case</td>
            <td>No period</td>
            <td>"Schedule Meeting"</td>
          </tr>
          <tr>
            <td>Heading</td>
            <td>Title Case</td>
            <td>No period</td>
            <td>"Getting Started"</td>
          </tr>
          <tr>
            <td>Body text</td>
            <td>Sentence case</td>
            <td>Period</td>
            <td>"Your data is safe."</td>
          </tr>
          <tr>
            <td>List item</td>
            <td>Sentence case</td>
            <td>No period (fragments)</td>
            <td>"Schedule meetings"</td>
          </tr>
          <tr>
            <td>Error message</td>
            <td>Sentence case</td>
            <td>Period</td>
            <td>"Connection failed."</td>
          </tr>
          <tr>
            <td>Form label</td>
            <td>Title Case</td>
            <td>Colon optional</td>
            <td>"Email Address"</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
