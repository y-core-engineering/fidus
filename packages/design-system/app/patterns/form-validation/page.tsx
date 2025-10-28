'use client';

import { TextInput, TextArea, Checkbox, RadioGroup, RadioButton } from '@fidus/ui';
import { useState } from 'react';

export default function FormValidationPage() {
  // Real-time validation example
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

  // Async validation example
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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate username taken
    if (value.toLowerCase() === 'admin' || value.toLowerCase() === 'root') {
      setUsernameError('This username is already taken');
    } else {
      setUsernameError('');
    }
    setIsCheckingUsername(false);
  };

  // Cross-field validation example
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

  // Form-level validation
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
      // Submit form
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Form Validation Patterns</h1>
        <p className="text-lg text-muted-foreground">
          Best practices and patterns for implementing form validation in Fidus, including real-time, async, and cross-field validation.
        </p>
      </div>

      {/* Validation Principles */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Validation Principles</h2>
          <div className="space-y-3 rounded-lg border border-border bg-card p-6">
            <div>
              <h3 className="mb-2 font-semibold">1. Validate on Blur, Not on Input</h3>
              <p className="text-sm text-muted-foreground">
                Validate when the user leaves a field (onBlur), not on every keystroke. This prevents showing errors prematurely while the user is still typing.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">2. Show Success States</h3>
              <p className="text-sm text-muted-foreground">
                Display a check icon or success indicator when validation passes. This provides positive feedback and confidence.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">3. Clear, Actionable Error Messages</h3>
              <p className="text-sm text-muted-foreground">
                Error messages should explain what went wrong and how to fix it. Avoid technical jargon.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">4. Preserve User Input</h3>
              <p className="text-sm text-muted-foreground">
                Never clear the field when validation fails. Let users correct their input without retyping everything.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Validation */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Real-time Validation</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Validate input immediately when the user leaves the field (onBlur event).
          </p>
          <div className="rounded-lg border border-border bg-card p-6">
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
          </div>

          <div className="mt-4 rounded-lg bg-muted p-4">
            <p className="mb-2 text-sm font-semibold">Implementation:</p>
            <pre className="overflow-x-auto text-xs">
{`const [email, setEmail] = useState('');
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
/>`}
            </pre>
          </div>
        </div>
      </section>

      {/* Async Validation */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Async Validation</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Validate against a backend API (e.g., checking username availability). Show a loading state during validation.
          </p>
          <div className="rounded-lg border border-border bg-card p-6">
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
          </div>

          <div className="mt-4 rounded-lg bg-muted p-4">
            <p className="mb-2 text-sm font-semibold">Implementation:</p>
            <pre className="overflow-x-auto text-xs">
{`const [username, setUsername] = useState('');
const [usernameError, setUsernameError] = useState('');
const [isChecking, setIsChecking] = useState(false);

const checkUsernameAvailability = async (value: string) => {
  if (!value || value.length < 3) {
    setUsernameError('Username must be at least 3 characters');
    return;
  }

  setIsChecking(true);

  try {
    const response = await fetch(\`/api/check-username?username=\${value}\`);
    const data = await response.json();

    if (!data.available) {
      setUsernameError('This username is already taken');
    } else {
      setUsernameError('');
    }
  } finally {
    setIsChecking(false);
  }
};`}
            </pre>
          </div>
        </div>
      </section>

      {/* Cross-field Validation */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Cross-field Validation</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Validate one field based on the value of another field (e.g., password confirmation).
          </p>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
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

          <div className="mt-4 rounded-lg bg-muted p-4">
            <p className="mb-2 text-sm font-semibold">Implementation:</p>
            <pre className="overflow-x-auto text-xs">
{`const [password, setPassword] = useState('');
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

// Validate confirm password when password changes
<TextInput
  label="Password"
  value={password}
  onChange={(e) => {
    setPassword(e.target.value);
    if (confirmPassword) {
      validatePasswordMatch(e.target.value, confirmPassword);
    }
  }}
/>

// Validate on blur
<TextInput
  label="Confirm Password"
  value={confirmPassword}
  onBlur={() => validatePasswordMatch(password, confirmPassword)}
  error={confirmPasswordError}
/>`}
            </pre>
          </div>
        </div>
      </section>

      {/* Form-level Validation */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Form-level Validation</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Validate all fields when the form is submitted. Show errors for all invalid fields at once.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-border bg-card p-6">
            <TextInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              required
            />
            <TextInput
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={usernameError}
              required
            />
            <Checkbox
              label="I agree to the Terms and Conditions"
              checked={agreedToTerms}
              onChange={setAgreedToTerms}
              error={termsError}
            />
            <button
              type="submit"
              className="w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-hover"
            >
              Create Account
            </button>

            {formSubmitted && !emailError && !usernameError && agreedToTerms && (
              <div className="rounded-md bg-success/10 p-4 text-success">
                ✓ Form submitted successfully!
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Validation Timing */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">When to Validate</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-3 text-left font-semibold">Event</th>
                  <th className="p-3 text-left font-semibold">Use Case</th>
                  <th className="p-3 text-left font-semibold">Example</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-xs">onBlur</td>
                  <td className="p-3">Real-time validation after user leaves field</td>
                  <td className="p-3 text-muted-foreground">Email format, required fields</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-xs">onChange</td>
                  <td className="p-3">Character count, formatting</td>
                  <td className="p-3 text-muted-foreground">Phone number formatting, max length</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-xs">onSubmit</td>
                  <td className="p-3">Form-level validation before submission</td>
                  <td className="p-3 text-muted-foreground">Cross-field validation, all required fields</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-xs">Debounced</td>
                  <td className="p-3">Async validation during typing</td>
                  <td className="p-3 text-muted-foreground">Username availability (with 300ms delay)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Error Message Guidelines */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Error Message Guidelines</h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-3 font-semibold">✅ Good Error Messages</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>"Please enter a valid email address (e.g., you@example.com)"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>"Password must be at least 8 characters and include one number"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>"This username is already taken. Try adding numbers or underscores"</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-error bg-error/5 p-6">
              <h3 className="mb-3 font-semibold text-error">❌ Bad Error Messages</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>"Invalid input" (too vague)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>"Error: VALIDATION_FAILED_001" (technical jargon)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>"Wrong!" (not helpful)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Accessibility</h2>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li>Error messages announced with aria-live="polite"</li>
            <li>Invalid fields marked with aria-invalid="true"</li>
            <li>Error messages linked with aria-describedby</li>
            <li>Required fields indicated visually (*) and with aria-required</li>
            <li>Focus moved to first invalid field on form submission</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
