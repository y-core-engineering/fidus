'use client';

import { Link, Stack } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';

export default function OnboardingPatternPage() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Onboarding Pattern</h1>
      <p className="lead">
        Privacy-first user onboarding with 8-step wizard approach that guides new users through account setup while respecting their time and privacy.
      </p>

      <h2>Overview</h2>
      <p className="my-lg">
        The Fidus onboarding pattern guides new users through account setup with a clear,
        privacy-focused flow. Unlike traditional onboarding that rushes users through setup,
        Fidus takes time to explain privacy protections and give users control over their data
        from day one.
      </p>
      <p className="my-lg">
        The 8-step wizard balances thoroughness with simplicity, ensuring users understand the
        value proposition while respecting their time and attention.
      </p>

      <h2 className="mt-2xl">8-Step Onboarding Flow</h2>

      <div className="not-prose space-y-lg my-lg">
        <div className="border-l-4 border-primary pl-lg">
          <h3 className="text-lg font-semibold mb-md">Step 1: Welcome and Value Proposition</h3>
          <p className="text-sm text-muted-foreground mb-md">
            Introduce Fidus and explain what makes it different. Focus on privacy, AI assistance,
            and user control.
          </p>
          <div className="bg-muted border border-border rounded-lg p-md text-sm">
            <p className="font-semibold mb-sm">Key elements:</p>
            <ul className="space-y-sm ml-lg">
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Welcoming headline</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Brief explanation of Fidus purpose</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Visual representation (illustration or animation)</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Primary CTA: &quot;Get Started&quot;</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-l-4 border-primary pl-lg">
          <h3 className="text-lg font-semibold mb-md">Step 2: Privacy Overview (Key Differentiator)</h3>
          <p className="text-sm text-muted-foreground mb-md">
            This is where Fidus stands out. Explain privacy protections before collecting any data.
            This builds trust from the start.
          </p>
          <div className="bg-muted border border-border rounded-lg p-md text-sm">
            <p className="font-semibold mb-sm">Key elements:</p>
            <ul className="space-y-sm ml-lg">
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Headline: &quot;Your Privacy Comes First&quot;</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Data stays on your device</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>End-to-end encryption</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>No selling or sharing data</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>You control what is stored</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Link to full privacy policy</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-l-4 border-primary pl-lg">
          <h3 className="text-lg font-semibold mb-md">Step 3: Account Creation</h3>
          <p className="text-sm text-muted-foreground mb-md">
            Collect minimal information needed to create an account. Support multiple authentication
            methods for user convenience.
          </p>
          <div className="bg-muted border border-border rounded-lg p-md text-sm">
            <p className="font-semibold mb-sm">Key elements:</p>
            <ul className="space-y-sm ml-lg">
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Email and password fields</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Password strength indicator</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Optional: Social login (Google, Apple)</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Terms and privacy policy checkboxes</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Clear error validation</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-l-4 border-primary pl-lg">
          <h3 className="text-lg font-semibold mb-md">Step 4: Calendar Integration</h3>
          <p className="text-sm text-muted-foreground mb-md">
            Connect calendar to enable scheduling features. Explain what data is accessed and how
            it is used.
          </p>
          <div className="bg-muted border border-border rounded-lg p-md text-sm">
            <p className="font-semibold mb-sm">Key elements:</p>
            <ul className="space-y-sm ml-lg">
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>List of supported calendar providers</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>What data will be accessed (read-only by default)</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>How calendar data improves AI suggestions</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>&quot;Skip for now&quot; option</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Can be configured later</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-l-4 border-primary pl-lg">
          <h3 className="text-lg font-semibold mb-md">Step 5: Finance Setup</h3>
          <p className="text-sm text-muted-foreground mb-md">
            Optional step to connect financial accounts or set up manual tracking. Emphasize
            encryption and security.
          </p>
          <div className="bg-muted border border-border rounded-lg p-md text-sm">
            <p className="font-semibold mb-sm">Key elements:</p>
            <ul className="space-y-sm ml-lg">
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Connect bank accounts (via secure provider)</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Manual transaction entry option</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Budget categories setup</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Clear security explanation</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>&quot;Skip for now&quot; option</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-l-4 border-primary pl-lg">
          <h3 className="text-lg font-semibold mb-md">Step 6: Preferences</h3>
          <p className="text-sm text-muted-foreground mb-md">
            Collect user preferences for personalization. All preferences should be changeable later.
          </p>
          <div className="bg-muted border border-border rounded-lg p-md text-sm">
            <p className="font-semibold mb-sm">Key elements:</p>
            <ul className="space-y-sm ml-lg">
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Notification preferences</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Time zone and language</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Theme (light/dark/auto)</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>AI suggestion frequency</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Default views and layouts</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-l-4 border-primary pl-lg">
          <h3 className="text-lg font-semibold mb-md">Step 7: Review and Confirm</h3>
          <p className="text-sm text-muted-foreground mb-md">
            Show summary of settings and give users a chance to review or change anything before
            completing setup.
          </p>
          <div className="bg-muted border border-border rounded-lg p-md text-sm">
            <p className="font-semibold mb-sm">Key elements:</p>
            <ul className="space-y-sm ml-lg">
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Connected accounts summary</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Privacy settings summary</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Preferences summary</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Edit links for each section</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>&quot;Complete Setup&quot; button</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-l-4 border-primary pl-lg">
          <h3 className="text-lg font-semibold mb-md">Step 8: Success and Next Steps</h3>
          <p className="text-sm text-muted-foreground mb-md">
            Celebrate completion and guide users to their first action. Provide clear next steps.
          </p>
          <div className="bg-muted border border-border rounded-lg p-md text-sm">
            <p className="font-semibold mb-sm">Key elements:</p>
            <ul className="space-y-sm ml-lg">
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Success message and visual</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>What happens next</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Suggested first actions</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>Link to help documentation</span>
              </li>
              <li className="flex gap-sm">
                <span className="text-muted-foreground shrink-0">•</span>
                <span>&quot;Go to Dashboard&quot; button</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <h2 className="mt-2xl">Code Example: Wizard Structure</h2>

      <ComponentPreview code={`import { useState } from 'react';
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

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="max-w-2xl mx-auto p-lg">
      <div className="mb-lg">
        <Progress
          value={(currentStep / totalSteps) * 100}
          label={\`Step \${currentStep} of \${totalSteps}\`}
        />
      </div>
      <div className="mb-lg">
        <CurrentStepComponent
          onNext={handleNext}
          onBack={handleBack}
        />
      </div>
    </div>
  );
}`}>
        <div className="p-lg border border-border rounded-lg bg-background">
          <p className="text-sm text-muted-foreground">Interactive wizard example - see code above</p>
        </div>
      </ComponentPreview>

      <h2 className="mt-2xl">Usage Guidelines</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>User is creating a new account</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>User needs to understand privacy protections</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Initial configuration is required</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Multiple setup steps are needed</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Educational content improves experience</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Explain privacy protections early (Step 2)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Allow users to skip optional steps</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Show progress clearly with visual indicator</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use welcoming, friendly language</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Save progress automatically</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Allow editing of previous steps</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Tab through all interactive elements in logical order</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Announce current step and total steps to screen readers</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Announce progress changes with aria-live regions</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Focus management between steps</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Large enough touch targets (44x44px minimum)</span>
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
              <span>Explain privacy protections early</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Allow users to skip optional steps</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Show progress clearly</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use welcoming, friendly language</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Provide context for each step</span>
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
              <span>Ask for unnecessary information</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Hide privacy implications</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Force users through all steps</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Use jargon or technical terms</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Block going back to previous steps</span>
            </li>
          </ul>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/progress"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Progress
          </h3>
          <p className="text-sm text-muted-foreground">Show completion status</p>
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
          href="/components/input"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Input
          </h3>
          <p className="text-sm text-muted-foreground">Form fields</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link variant="standalone" href="/foundations/privacy-ux">
              Privacy UX Guidelines
            </Link>
          </li>
          <li>
            <Link variant="standalone" href="/patterns/form-validation">
              Form Validation Pattern
            </Link>
          </li>
          <li>
            <Link variant="standalone" href="/getting-started/design-philosophy">
              Design Philosophy
            </Link>
          </li>
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
              href="https://www.w3.org/WAI/WCAG21/Understanding/error-identification.html"
              external
              showIcon
            >
              WCAG 2.1: Error Identification
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
        </ul>
      </div>
    </div>
  );
}
