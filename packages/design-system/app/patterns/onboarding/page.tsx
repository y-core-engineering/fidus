'use client';

import { Button, ProgressBar, TextInput, Checkbox, Alert, Link, Stack } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { useState } from 'react';

export default function OnboardingPatternPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const totalSteps = 8;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Onboarding Pattern</h1>
      <p className="lead">
        Multi-step wizard pattern for guiding new users through account setup with clear progress indicators and privacy-first approach.
      </p>

      <h2>Interactive Wizard Example</h2>
      <p className="text-sm text-muted-foreground">
        A complete onboarding wizard with progress tracking, step navigation, and form validation.
      </p>

      <div className="not-prose my-lg">
        <ComponentPreview code={`const [currentStep, setCurrentStep] = useState(1);
const totalSteps = 8;
const progress = (currentStep / totalSteps) * 100;

<div className="max-w-2xl mx-auto">
  <ProgressBar
    value={progress}
    variant="primary"
    label={\`Step \${currentStep} of \${totalSteps}\`}
  />

  {/* Step content here */}

  <Stack direction="horizontal" spacing="md" justify="between">
    <Button
      variant="secondary"
      onClick={() => setCurrentStep(prev => prev - 1)}
      disabled={currentStep === 1}
    >
      Back
    </Button>
    <Button onClick={() => setCurrentStep(prev => prev + 1)}>
      {currentStep === totalSteps ? 'Complete' : 'Next'}
    </Button>
  </Stack>
</div>`}>
          <div className="max-w-2xl mx-auto border border-border rounded-lg p-lg bg-card">
            <div className="mb-lg">
              <ProgressBar
                value={progress}
                variant="primary"
                showLabel={false}
              />
              <p className="text-sm text-muted-foreground mt-sm">
                Step {currentStep} of {totalSteps}
              </p>
            </div>

            {currentStep === 1 && (
              <div className="space-y-md">
                <h3 className="text-xl font-semibold">Welcome to Fidus</h3>
                <p className="text-muted-foreground">
                  Your privacy-first AI personal assistant. Let&apos;s get you set up in just a few steps.
                </p>
                <div className="p-md bg-muted rounded-lg">
                  <ul className="space-y-sm text-sm">
                    <li className="flex gap-sm">
                      <span className="text-primary">✓</span>
                      <span>Your data stays on your device</span>
                    </li>
                    <li className="flex gap-sm">
                      <span className="text-primary">✓</span>
                      <span>End-to-end encryption</span>
                    </li>
                    <li className="flex gap-sm">
                      <span className="text-primary">✓</span>
                      <span>No selling or sharing data</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-md">
                <h3 className="text-xl font-semibold">Privacy First</h3>
                <Alert variant="info" title="Your data is protected">
                  Fidus uses end-to-end encryption and stores data locally. We never sell or share your personal information.
                </Alert>
                <div className="space-y-sm text-sm">
                  <p className="font-medium">What this means for you:</p>
                  <ul className="space-y-xs ml-lg">
                    <li>• Calendar events stay on your device</li>
                    <li>• Financial data is encrypted</li>
                    <li>• You control what gets stored</li>
                    <li>• Delete your data anytime</li>
                  </ul>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-md">
                <h3 className="text-xl font-semibold">Create Your Account</h3>
                <TextInput
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <TextInput
                  label="Password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  showPasswordToggle
                  required
                />
                <Checkbox
                  label="I agree to the Terms and Privacy Policy"
                  checked={agreedToTerms}
                  onChange={setAgreedToTerms}
                />
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-md">
                <h3 className="text-xl font-semibold">Connect Your Calendar</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your calendar to enable smart scheduling and time management features.
                </p>
                <div className="grid gap-sm">
                  <Button variant="secondary" className="justify-start">
                    <span>📅</span>
                    <span>Google Calendar</span>
                  </Button>
                  <Button variant="secondary" className="justify-start">
                    <span>📆</span>
                    <span>Apple Calendar</span>
                  </Button>
                  <Button variant="secondary" className="justify-start">
                    <span>📋</span>
                    <span>Outlook Calendar</span>
                  </Button>
                </div>
                <Button variant="tertiary" size="sm">
                  Skip for now
                </Button>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-md">
                <h3 className="text-xl font-semibold">Financial Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Set up budget tracking to manage your finances with AI-powered insights.
                </p>
                <div className="p-md bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-sm">🔒 Bank-level security</p>
                  <p className="text-xs text-muted-foreground">
                    Your financial data is encrypted and stored locally. We use read-only access and never store your banking credentials.
                  </p>
                </div>
                <Stack direction="vertical" spacing="sm">
                  <Button variant="secondary">Connect Bank Account</Button>
                  <Button variant="secondary">Manual Entry</Button>
                  <Button variant="tertiary" size="sm">Skip for now</Button>
                </Stack>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-md">
                <h3 className="text-xl font-semibold">Preferences</h3>
                <div className="space-y-md">
                  <div>
                    <label className="text-sm font-medium mb-xs block">Notifications</label>
                    <Stack direction="vertical" spacing="xs">
                      <Checkbox label="Email notifications" checked />
                      <Checkbox label="Push notifications" checked />
                      <Checkbox label="Daily summary" />
                    </Stack>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-xs block">Theme</label>
                    <Stack direction="horizontal" spacing="sm">
                      <Button variant="secondary" size="sm">Light</Button>
                      <Button variant="secondary" size="sm">Dark</Button>
                      <Button variant="primary" size="sm">Auto</Button>
                    </Stack>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 7 && (
              <div className="space-y-md">
                <h3 className="text-xl font-semibold">Review Your Setup</h3>
                <div className="space-y-sm">
                  <div className="p-md border border-border rounded-lg">
                    <p className="text-sm font-medium mb-xs">Account</p>
                    <p className="text-sm text-muted-foreground">{email || 'you@example.com'}</p>
                  </div>
                  <div className="p-md border border-border rounded-lg">
                    <p className="text-sm font-medium mb-xs">Connected Services</p>
                    <p className="text-sm text-muted-foreground">Google Calendar</p>
                  </div>
                  <div className="p-md border border-border rounded-lg">
                    <p className="text-sm font-medium mb-xs">Preferences</p>
                    <p className="text-sm text-muted-foreground">Notifications enabled, Auto theme</p>
                  </div>
                </div>
                <Button variant="tertiary" size="sm">Edit settings</Button>
              </div>
            )}

            {currentStep === 8 && (
              <div className="space-y-md text-center">
                <div className="text-6xl">🎉</div>
                <h3 className="text-xl font-semibold">You&apos;re All Set!</h3>
                <p className="text-muted-foreground">
                  Welcome to Fidus. Your personal AI assistant is ready to help you stay organized.
                </p>
                <Alert variant="success" title="What&apos;s next?">
                  <ul className="text-sm space-y-xs text-left mt-sm">
                    <li>• Add your first calendar event</li>
                    <li>• Set up your first budget</li>
                    <li>• Explore AI suggestions</li>
                  </ul>
                </Alert>
              </div>
            )}

            <Stack direction="horizontal" spacing="md" justify="between" className="mt-lg pt-lg border-t border-border">
              <Button
                variant="secondary"
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              <Button
                onClick={() => setCurrentStep(prev => Math.min(totalSteps, prev + 1))}
              >
                {currentStep === totalSteps ? 'Go to Dashboard' : 'Next'}
              </Button>
            </Stack>
          </div>
        </ComponentPreview>
      </div>

      <h2>Progress Indicator Patterns</h2>
      <p className="text-sm text-muted-foreground">
        Show users where they are in the onboarding process with clear visual indicators.
      </p>

      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">Linear Progress Bar</h3>
          <ComponentPreview code={`<ProgressBar
  value={37.5}
  variant="primary"
  label="Step 3 of 8"
/>`}>
            <ProgressBar value={37.5} variant="primary" label="Step 3 of 8" />
          </ComponentPreview>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Step Indicators</h3>
          <ComponentPreview code={`<div className="flex items-center justify-between">
  <div className="flex items-center gap-sm">
    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
      1
    </div>
    <span className="text-sm font-medium">Account</span>
  </div>
  <div className="flex-1 h-px bg-border mx-sm" />
  {/* Repeat for each step */}
</div>`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">✓</div>
                <span className="text-sm font-medium">Account</span>
              </div>
              <div className="flex-1 h-px bg-border mx-sm" />
              <div className="flex items-center gap-sm">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">2</div>
                <span className="text-sm font-medium">Privacy</span>
              </div>
              <div className="flex-1 h-px bg-muted mx-sm" />
              <div className="flex items-center gap-sm">
                <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-semibold">3</div>
                <span className="text-sm text-muted-foreground">Setup</span>
              </div>
            </div>
          </ComponentPreview>
        </div>
      </div>

      <h2>Navigation Patterns</h2>
      <p className="text-sm text-muted-foreground">
        Provide clear navigation between steps with back and next actions.
      </p>

      <div className="not-prose space-y-lg my-lg">
        <ComponentPreview code={`<Stack direction="horizontal" spacing="md" justify="between">
  <Button variant="secondary" disabled>
    Back
  </Button>
  <Button>Next</Button>
</Stack>`}>
          <Stack direction="horizontal" spacing="md" justify="between">
            <Button variant="secondary" disabled>Back</Button>
            <Button>Next</Button>
          </Stack>
        </ComponentPreview>
      </div>

      <h2>Usage Guidelines</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Initial user account creation and setup</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Multi-step configuration processes</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When users need context about privacy and features</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Complex setups that benefit from step-by-step guidance</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Show clear progress with visual indicators</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Allow users to skip optional steps</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Enable going back to previous steps</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Save progress automatically</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Explain privacy implications early</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use friendly, welcoming language</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Announce current step to screen readers with aria-live</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Manage focus when moving between steps</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Support keyboard navigation (Tab, Enter, Arrow keys)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Provide skip links for optional sections</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Ensure sufficient color contrast for step indicators</span>
            </li>
          </ul>
        </div>
      </div>

      <h2 className="mt-2xl">Do&apos;s and Don&apos;ts</h2>
      <div className="not-prose grid md:grid-cols-2 gap-lg my-lg">
        <div className="border-2 border-success rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-success mb-md flex items-center gap-sm">
            <span className="text-2xl">✓</span> Do
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Show progress clearly with visual indicators</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Explain privacy protections early in the flow</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Allow users to go back and edit previous steps</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Provide &quot;Skip for now&quot; for optional steps</span>
            </li>
          </ul>
        </div>

        <div className="border-2 border-error rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-error mb-md flex items-center gap-sm">
            <span className="text-2xl">✗</span> Don&apos;t
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Force users through unnecessary steps</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Hide or downplay privacy implications</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Prevent users from going back</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Use more than 10 steps (consider grouping)</span>
            </li>
          </ul>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/progress-bar"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Progress Bar
          </h3>
          <p className="text-sm text-muted-foreground">Visual progress indicators</p>
        </Link>

        <Link
          href="/components/button"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Button
          </h3>
          <p className="text-sm text-muted-foreground">Navigation actions</p>
        </Link>

        <Link
          href="/patterns/form-validation"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Form Validation
          </h3>
          <p className="text-sm text-muted-foreground">Input validation patterns</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://www.nngroup.com/articles/onboarding-tutorials/"
              external
              showIcon
            >
              Nielsen Norman Group: Onboarding Tutorials
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.nngroup.com/articles/progress-indicators/"
              external
              showIcon
            >
              Nielsen Norman Group: Progress Indicators
            </Link>
          </li>
          <li>
            <Link variant="standalone" href="/foundations/privacy-ux">
              Privacy UX Guidelines
            </Link>
          </li>
          <li>
            <Link variant="standalone" href="/getting-started/for-developers">
              Installation guide
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
