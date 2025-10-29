'use client';

import { TextInput, TextArea, Checkbox, RadioGroup, RadioButton, Link, Stack, Button, Alert } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { useState } from 'react';

export default function FormValidationPage() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const checkUsernameAvailability = async (value: string) => {
    if (!value) {
      setUsernameError('Username is required');
      return;
    }
    if (value.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      return;
    }

    setIsCheckingUsername(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (value.toLowerCase() === 'admin' || value.toLowerCase() === 'root') {
      setUsernameError('This username is already taken');
    } else {
      setUsernameError('');
    }
    setIsCheckingUsername(false);
  };

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validatePasswordMatch = (pass: string, confirm: string) => {
    if (confirm && pass !== confirm) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [termsError, setTermsError] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isEmailValid = validateEmail(email);
    const isPasswordMatch = validatePasswordMatch(password, confirmPassword);

    if (!agreedToTerms) {
      setTermsError('You must agree to the terms and conditions');
    } else {
      setTermsError('');
    }

    if (isEmailValid && isPasswordMatch && agreedToTerms && !usernameError) {
      setFormSubmitted(true);
    }
  };

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Form Validation Patterns</h1>
      <p className="lead">
        Best practices and patterns for implementing form validation in Fidus, including real-time, async, and cross-field validation.
      </p>

      <h2>Validation Principles</h2>
      <div className="not-prose space-y-lg my-lg">
        <div className="rounded-lg border border-border bg-card p-lg space-y-md">
          <div>
            <h3 className="font-semibold mb-sm">1. Validate on Blur, Not on Input</h3>
            <p className="text-sm text-muted-foreground">
              Validate when the user leaves a field (onBlur), not on every keystroke. This prevents showing errors prematurely while the user is still typing.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-sm">2. Show Success States</h3>
            <p className="text-sm text-muted-foreground">
              Display a check icon or success indicator when validation passes. This provides positive feedback and confidence.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-sm">3. Clear, Actionable Error Messages</h3>
            <p className="text-sm text-muted-foreground">
              Error messages should explain what went wrong and how to fix it. Avoid technical jargon.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-sm">4. Preserve User Input</h3>
            <p className="text-sm text-muted-foreground">
              Never clear the field when validation fails. Let users correct their input without retyping everything.
            </p>
          </div>
        </div>
      </div>

      <h2>Real-time Validation</h2>
      <p className="text-sm text-muted-foreground">
        Validate input immediately when the user leaves the field (onBlur event).
      </p>

      <div className="not-prose space-y-lg my-lg">
        <ComponentPreview code={`const [email, setEmail] = useState('');
const [emailError, setEmailError] = useState('');

const validateEmail = (value: string) => {
  if (!value) {
    setEmailError('Email is required');
    return false;
  }
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  if (!emailRegex.test(value)) {
    setEmailError('Please enter a valid email address');
    return false;
  }
  setEmailError('');
  return true;
};

<TextInput
  label="Email Address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  onBlur={() => validateEmail(email)}
  error={emailError}
  required
/>`}>
          <TextInput
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => validateEmail(email)}
            error={emailError}
            required
          />
        </ComponentPreview>
      </div>

      <h2>Async Validation</h2>
      <p className="text-sm text-muted-foreground">
        Validate against a backend API (e.g., checking username availability). Show a loading state during validation.
      </p>

      <div className="not-prose space-y-lg my-lg">
        <ComponentPreview code={`const checkUsernameAvailability = async (value: string) => {
  if (!value || value.length < 3) {
    setUsernameError('Username must be at least 3 characters');
    return;
  }

  setIsChecking(true);
  const response = await fetch(\`/api/check-username?username=\${value}\`);
  const data = await response.json();

  if (!data.available) {
    setUsernameError('This username is already taken');
  } else {
    setUsernameError('');
  }
  setIsChecking(false);
};

<TextInput
  label="Username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  onBlur={() => checkUsernameAvailability(username)}
  error={usernameError}
  helperText={isChecking ? 'Checking availability...' : ''}
/>`}>
          <TextInput
            label="Username"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={() => checkUsernameAvailability(username)}
            error={usernameError}
            helperText={isCheckingUsername ? 'Checking availability...' : 'Try "admin" or "root" to see error state'}
            required
          />
        </ComponentPreview>
      </div>

      <h2>Cross-field Validation</h2>
      <p className="text-sm text-muted-foreground">
        Validate one field based on the value of another field (e.g., password confirmation).
      </p>

      <div className="not-prose space-y-lg my-lg">
        <ComponentPreview code={`const validatePasswordMatch = (pass: string, confirm: string) => {
  if (confirm && pass !== confirm) {
    setConfirmPasswordError('Passwords do not match');
    return false;
  }
  setConfirmPasswordError('');
  return true;
};

<TextInput
  label="Password"
  type="password"
  value={password}
  onChange={(e) => {
    setPassword(e.target.value);
    if (confirmPassword) {
      validatePasswordMatch(e.target.value, confirmPassword);
    }
  }}
/>

<TextInput
  label="Confirm Password"
  type="password"
  value={confirmPassword}
  onBlur={() => validatePasswordMatch(password, confirmPassword)}
  error={confirmPasswordError}
/>`}>
          <div className="space-y-lg">
            <TextInput
              label="Password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (confirmPassword) {
                  validatePasswordMatch(e.target.value, confirmPassword);
                }
              }}
              showPasswordToggle
              required
            />
            <TextInput
              label="Confirm Password"
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => validatePasswordMatch(password, confirmPassword)}
              error={confirmPasswordError}
              showPasswordToggle
              required
            />
          </div>
        </ComponentPreview>
      </div>

      <h2>When to Validate</h2>
      <div className="not-prose my-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="p-md text-left font-semibold">Event</th>
              <th className="p-md text-left font-semibold">Use Case</th>
              <th className="p-md text-left font-semibold">Example</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="p-md font-mono text-xs">onBlur</td>
              <td className="p-md">Real-time validation after user leaves field</td>
              <td className="p-md text-muted-foreground">Email format, required fields</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-md font-mono text-xs">onChange</td>
              <td className="p-md">Character count, formatting</td>
              <td className="p-md text-muted-foreground">Phone number formatting, max length</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-md font-mono text-xs">onSubmit</td>
              <td className="p-md">Form-level validation before submission</td>
              <td className="p-md text-muted-foreground">Cross-field validation, all required fields</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-md font-mono text-xs">Debounced</td>
              <td className="p-md">Async validation during typing</td>
              <td className="p-md text-muted-foreground">Username availability (with 300ms delay)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Usage Guidelines</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For all user input forms requiring data validation</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When checking data format (email, phone, date)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For required fields that must be filled</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When validating against backend data (username, email availability)</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Validate on blur, not on input (avoid premature errors)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Provide clear, actionable error messages</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Show success states when validation passes</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Preserve user input - never clear fields on error</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Debounce async validation to avoid excessive API calls</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Error messages announced with aria-live=&quot;polite&quot;</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Invalid fields marked with aria-invalid=&quot;true&quot;</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Error messages linked with aria-describedby</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Required fields indicated with aria-required</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Focus moved to first invalid field on form submission</span>
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
              <span className="text-success shrink-0">✓</span>
              <span>&quot;Please enter a valid email address (e.g., you@example.com)&quot;</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">✓</span>
              <span>&quot;Password must be at least 8 characters and include one number&quot;</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">✓</span>
              <span>&quot;This username is already taken. Try adding numbers or underscores&quot;</span>
            </li>
          </ul>
        </div>

        <div className="border-2 border-error rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-error mb-md flex items-center gap-sm">
            <span className="text-2xl">✗</span> Don&apos;t
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-error shrink-0">✗</span>
              <span>&quot;Invalid input&quot; (too vague)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">✗</span>
              <span>&quot;Error: VALIDATION_FAILED_001&quot; (technical jargon)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">✗</span>
              <span>&quot;Wrong!&quot; (not helpful)</span>
            </li>
          </ul>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/text-input"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Text Input
          </h3>
          <p className="text-sm text-muted-foreground">Form text input fields</p>
        </Link>

        <Link
          href="/components/checkbox"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Checkbox
          </h3>
          <p className="text-sm text-muted-foreground">Checkbox validation</p>
        </Link>

        <Link
          href="/components/select"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Select
          </h3>
          <p className="text-sm text-muted-foreground">Dropdown selection</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://www.nngroup.com/articles/errors-forms-design-guidelines/"
              external
              showIcon
            >
              Nielsen Norman Group: Website Forms Usability - Error Messages
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/WCAG21/Understanding/error-suggestion.html"
              external
              showIcon
            >
              WCAG 2.1: Error Suggestion Guidelines
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.smashingmagazine.com/2022/09/inline-validation-web-forms-ux/"
              external
              showIcon
            >
              Smashing Magazine: Inline Validation in Web Forms
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
