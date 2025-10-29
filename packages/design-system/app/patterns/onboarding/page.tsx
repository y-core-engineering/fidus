'use client';

import Link from 'next/link';

export default function OnboardingPatternPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Onboarding Pattern</h1>
        <p className="text-xl text-gray-600">
          Privacy-first user onboarding with 8-step wizard approach
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="mb-4">
          The Fidus onboarding pattern guides new users through account setup with a clear,
          privacy-focused flow. Unlike traditional onboarding that rushes users through setup,
          Fidus takes time to explain privacy protections and give users control over their data
          from day one.
        </p>
        <p className="mb-4">
          The 8-step wizard balances thoroughness with simplicity, ensuring users understand the
          value proposition while respecting their time and attention.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">When to Use This Pattern</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold mb-3 text-green-900">Use when:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>User is creating a new account</li>
              <li>User needs to understand privacy protections</li>
              <li>Initial configuration is required</li>
              <li>Multiple setup steps are needed</li>
              <li>User consent must be collected</li>
              <li>Educational content improves experience</li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="font-semibold mb-3 text-red-900">Do not use when:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>User is returning to the application</li>
              <li>User is adding a single integration</li>
              <li>Quick action is more appropriate</li>
              <li>Setup can be deferred</li>
              <li>User explicitly requests minimal setup</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">8-Step Onboarding Flow</h2>

        <div className="space-y-6">
          <div className="border-l-4 border-blue-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">Step 1: Welcome and Value Proposition</h3>
            <p className="text-gray-700 mb-3">
              Introduce Fidus and explain what makes it different. Focus on privacy, AI assistance,
              and user control.
            </p>
            <div className="bg-gray-50 border rounded-lg p-4 text-sm">
              <p className="font-semibold mb-2">Key elements:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Welcoming headline</li>
                <li>Brief explanation of Fidus purpose</li>
                <li>Visual representation (illustration or animation)</li>
                <li>Primary CTA: "Get Started"</li>
              </ul>
            </div>
          </div>

          <div className="border-l-4 border-purple-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">Step 2: Privacy Overview (Key Differentiator)</h3>
            <p className="text-gray-700 mb-3">
              This is where Fidus stands out. Explain privacy protections before collecting any data.
              This builds trust from the start.
            </p>
            <div className="bg-gray-50 border rounded-lg p-4 text-sm">
              <p className="font-semibold mb-2">Key elements:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Headline: "Your Privacy Comes First"</li>
                <li>Data stays on your device</li>
                <li>End-to-end encryption</li>
                <li>No selling or sharing data</li>
                <li>You control what is stored</li>
                <li>Link to full privacy policy</li>
              </ul>
            </div>
          </div>

          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">Step 3: Account Creation</h3>
            <p className="text-gray-700 mb-3">
              Collect minimal information needed to create an account. Support multiple authentication
              methods for user convenience.
            </p>
            <div className="bg-gray-50 border rounded-lg p-4 text-sm">
              <p className="font-semibold mb-2">Key elements:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Email and password fields</li>
                <li>Password strength indicator</li>
                <li>Optional: Social login (Google, Apple)</li>
                <li>Terms and privacy policy checkboxes</li>
                <li>Clear error validation</li>
              </ul>
            </div>
          </div>

          <div className="border-l-4 border-orange-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">Step 4: Calendar Integration</h3>
            <p className="text-gray-700 mb-3">
              Connect calendar to enable scheduling features. Explain what data is accessed and how
              it is used.
            </p>
            <div className="bg-gray-50 border rounded-lg p-4 text-sm">
              <p className="font-semibold mb-2">Key elements:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>List of supported calendar providers</li>
                <li>What data will be accessed (read-only by default)</li>
                <li>How calendar data improves AI suggestions</li>
                <li>"Skip for now" option</li>
                <li>Can be configured later</li>
              </ul>
            </div>
          </div>

          <div className="border-l-4 border-red-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">Step 5: Finance Setup</h3>
            <p className="text-gray-700 mb-3">
              Optional step to connect financial accounts or set up manual tracking. Emphasize
              encryption and security.
            </p>
            <div className="bg-gray-50 border rounded-lg p-4 text-sm">
              <p className="font-semibold mb-2">Key elements:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Connect bank accounts (via secure provider)</li>
                <li>Manual transaction entry option</li>
                <li>Budget categories setup</li>
                <li>Clear security explanation</li>
                <li>"Skip for now" option</li>
              </ul>
            </div>
          </div>

          <div className="border-l-4 border-yellow-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">Step 6: Preferences</h3>
            <p className="text-gray-700 mb-3">
              Collect user preferences for personalization. All preferences should be changeable later.
            </p>
            <div className="bg-gray-50 border rounded-lg p-4 text-sm">
              <p className="font-semibold mb-2">Key elements:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Notification preferences</li>
                <li>Time zone and language</li>
                <li>Theme (light/dark/auto)</li>
                <li>AI suggestion frequency</li>
                <li>Default views and layouts</li>
              </ul>
            </div>
          </div>

          <div className="border-l-4 border-indigo-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">Step 7: Review and Confirm</h3>
            <p className="text-gray-700 mb-3">
              Show summary of settings and give users a chance to review or change anything before
              completing setup.
            </p>
            <div className="bg-gray-50 border rounded-lg p-4 text-sm">
              <p className="font-semibold mb-2">Key elements:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Connected accounts summary</li>
                <li>Privacy settings summary</li>
                <li>Preferences summary</li>
                <li>Edit links for each section</li>
                <li>"Complete Setup" button</li>
              </ul>
            </div>
          </div>

          <div className="border-l-4 border-teal-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">Step 8: Success and Next Steps</h3>
            <p className="text-gray-700 mb-3">
              Celebrate completion and guide users to their first action. Provide clear next steps.
            </p>
            <div className="bg-gray-50 border rounded-lg p-4 text-sm">
              <p className="font-semibold mb-2">Key elements:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Success message and visual</li>
                <li>What happens next</li>
                <li>Suggested first actions</li>
                <li>Link to help documentation</li>
                <li>"Go to Dashboard" button</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Code Example: Wizard Structure</h2>

        <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto mb-4">
          <code>{`import { useState } from 'react';
import { Button, Progress } from '@fidus/ui';

interface OnboardingWizardProps {
  onComplete: () => void;
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;

  const steps = [
    { id: 1, component: WelcomeStep, title: 'Welcome' },
    { id: 2, component: PrivacyStep, title: 'Privacy' },
    { id: 3, component: AccountStep, title: 'Account' },
    { id: 4, component: CalendarStep, title: 'Calendar' },
    { id: 5, component: FinanceStep, title: 'Finance' },
    { id: 6, component: PreferencesStep, title: 'Preferences' },
    { id: 7, component: ReviewStep, title: 'Review' },
    { id: 8, component: SuccessStep, title: 'Success' },
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    // Some steps can be skipped
    handleNext();
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress indicator */}
      <div className="mb-8">
        <Progress
          value={(currentStep / totalSteps) * 100}
          label={\`Step \${currentStep} of \${totalSteps}\`}
        />
      </div>

      {/* Step content */}
      <div className="mb-8">
        <CurrentStepComponent
          onNext={handleNext}
          onBack={handleBack}
          onSkip={handleSkip}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          Back
        </Button>

        <div className="text-sm text-gray-600">
          {steps[currentStep - 1].title}
        </div>

        <Button
          variant="primary"
          onClick={handleNext}
        >
          {currentStep === totalSteps ? 'Complete' : 'Next'}
        </Button>
      </div>
    </div>
  );
}`}</code>
        </pre>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Skip Options and Progressive Disclosure</h2>

        <p className="mb-4">
          Not all steps are mandatory. Users should be able to skip optional steps and complete
          them later.
        </p>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Skippable Steps</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li><strong>Calendar Integration (Step 4):</strong> Can be configured in settings</li>
            <li><strong>Finance Setup (Step 5):</strong> Can be added later</li>
            <li><strong>Preferences (Step 6):</strong> Sensible defaults are provided</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Required Steps</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li><strong>Welcome (Step 1):</strong> Sets context</li>
            <li><strong>Privacy Overview (Step 2):</strong> Critical for informed consent</li>
            <li><strong>Account Creation (Step 3):</strong> Cannot proceed without account</li>
            <li><strong>Review and Confirm (Step 7):</strong> Ensures user awareness</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Progressive Disclosure</h3>
          <p className="mb-3">
            Do not overwhelm users with all options at once. Reveal complexity gradually:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Show essential options first</li>
            <li>Provide "Advanced" toggles for power users</li>
            <li>Link to detailed documentation for complex features</li>
            <li>Save advanced configuration for post-onboarding</li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Accessibility Considerations</h2>

        <div className="space-y-4">
          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">Keyboard Navigation</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Tab through all interactive elements in logical order</li>
              <li>Enter key advances to next step</li>
              <li>Escape key goes back (if applicable)</li>
              <li>Focus management between steps</li>
            </ul>
          </div>

          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">Screen Reader Support</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Announce current step and total steps</li>
              <li>Announce progress changes</li>
              <li>Label all form fields clearly</li>
              <li>Provide context for each step</li>
            </ul>
          </div>

          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">Visual Design</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Progress indicator shows current position</li>
              <li>Clear visual hierarchy</li>
              <li>Sufficient color contrast</li>
              <li>Large enough touch targets (44x44px minimum)</li>
            </ul>
          </div>

          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">Error Handling</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Validate input before allowing next step</li>
              <li>Show clear error messages</li>
              <li>Focus on first error field</li>
              <li>Allow correction without losing progress</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Mobile Considerations</h2>

        <p className="mb-4">
          The onboarding wizard must work seamlessly on mobile devices:
        </p>

        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
          <li>Single column layout</li>
          <li>Large, thumb-friendly buttons</li>
          <li>Minimal text entry</li>
          <li>Swipe gestures for navigation (optional)</li>
          <li>Progress indicator always visible</li>
          <li>Auto-advance when appropriate (e.g., after successful OAuth)</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold mb-3 text-green-900">Do</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>Explain privacy protections early</li>
              <li>Allow users to skip optional steps</li>
              <li>Show progress clearly</li>
              <li>Use welcoming, friendly language</li>
              <li>Provide context for each step</li>
              <li>Save progress automatically</li>
              <li>Allow editing of previous steps</li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="font-semibold mb-3 text-red-900">Do not</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>Ask for unnecessary information</li>
              <li>Hide privacy implications</li>
              <li>Force users through all steps</li>
              <li>Use jargon or technical terms</li>
              <li>Make steps too long</li>
              <li>Lose user progress on errors</li>
              <li>Block going back to previous steps</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Related Components</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/components/progress"
            className="border rounded-lg p-6 hover:border-blue-500 transition-colors"
          >
            <h3 className="font-semibold mb-2">Progress</h3>
            <p className="text-sm text-gray-600">
              Show completion status
            </p>
          </Link>

          <Link
            href="/components/button"
            className="border rounded-lg p-6 hover:border-blue-500 transition-colors"
          >
            <h3 className="font-semibold mb-2">Button</h3>
            <p className="text-sm text-gray-600">
              Navigation actions
            </p>
          </Link>

          <Link
            href="/components/input"
            className="border rounded-lg p-6 hover:border-blue-500 transition-colors"
          >
            <h3 className="font-semibold mb-2">Input</h3>
            <p className="text-sm text-gray-600">
              Form fields
            </p>
          </Link>
        </div>
      </section>

      {/* Resources */}
      <section className="space-y-4">
        <h2 className="mb-4 text-2xl font-semibold">Resources</h2>
        <ul className="space-y-2">
          <li>
            <Link href="/foundations/privacy-ux" className="text-blue-600 hover:underline">
              Privacy UX Guidelines
            </Link>
          </li>
          <li>
            <Link href="/patterns/form-validation" className="text-blue-600 hover:underline">
              Form Validation Pattern
            </Link>
          </li>
          <li>
            <Link href="/getting-started/design-philosophy" className="text-blue-600 hover:underline">
              Design Philosophy
            </Link>
          </li>
          <li>
            <a
              href="https://www.nngroup.com/articles/onboarding-tutorials/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Nielsen Norman Group: Onboarding Tutorials
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG21/Understanding/error-identification.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              WCAG 2.1: Error Identification
            </a>
          </li>
          <li>
            <a
              href="https://www.nngroup.com/articles/progress-indicators/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Nielsen Norman Group: Progress Indicators
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
