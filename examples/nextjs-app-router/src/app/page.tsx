'use client'

import {
  Alert,
  Banner,
  Button,
  Checkbox,
  Chip,
  Container,
  DetailCard,
  FileUpload,
  OpportunityCard,
  RadioButton,
  Stack,
  TextArea,
  TextInput,
  TimePicker,
  ToggleSwitch,
} from '@fidus/ui'
import { useState } from 'react'

export default function Home() {
  const [checkboxChecked, setCheckboxChecked] = useState(false)
  const [toggleEnabled, setToggleEnabled] = useState(false)
  const [radioValue, setRadioValue] = useState('option1')
  const [textValue, setTextValue] = useState('')
  const [textAreaValue, setTextAreaValue] = useState('')
  const [timeValue, setTimeValue] = useState('')

  return (
    <Container size="lg" padding="md">
      <Stack spacing="xl">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold mb-4">Fidus UI Component Showcase</h1>
          <p className="text-lg text-gray-600">
            Next.js App Router Example - No Provider Required
          </p>
        </div>

        {/* Buttons Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
          <Stack spacing="md" direction="horizontal">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="tertiary">Tertiary Button</Button>
            <Button variant="destructive">Destructive Button</Button>
            <Button variant="primary" disabled>
              Disabled Button
            </Button>
          </Stack>
        </section>

        {/* Alerts Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Alerts</h2>
          <Stack spacing="md">
            <Alert variant="info">This is an informational alert message.</Alert>
            <Alert variant="success">Operation completed successfully!</Alert>
            <Alert variant="warning">Please review your input carefully.</Alert>
            <Alert variant="error">An error occurred. Please try again.</Alert>
          </Stack>
        </section>

        {/* Banner Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Banner</h2>
          <Banner
            variant="info"
            message="Welcome to the Fidus UI component library. All components work without a centralized provider."
          />
        </section>

        {/* Form Inputs Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Form Inputs</h2>
          <Stack spacing="md">
            <TextInput
              label="Text Input"
              placeholder="Enter some text..."
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
            />
            <TextArea
              label="Text Area"
              placeholder="Enter a longer text..."
              value={textAreaValue}
              onChange={(e) => setTextAreaValue(e.target.value)}
              rows={4}
            />
            <TimePicker
              label="Time Picker"
              value={timeValue}
              onChange={setTimeValue}
            />
            <FileUpload
              label="File Upload"
              accept=".pdf,.doc,.docx"
              onChange={(files) => console.log('Files selected:', files)}
            />
          </Stack>
        </section>

        {/* Interactive Controls Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Interactive Controls</h2>
          <Stack spacing="md">
            <Checkbox
              label="Accept terms and conditions"
              checked={checkboxChecked}
              onChange={setCheckboxChecked}
            />
            <ToggleSwitch
              label="Enable notifications"
              checked={toggleEnabled}
              onChange={setToggleEnabled}
            />
            <div>
              <p className="font-medium mb-2">Select an option:</p>
              <Stack spacing="sm">
                <RadioButton
                  label="Option 1"
                  value="option1"
                  checked={radioValue === 'option1'}
                  onChange={() => setRadioValue('option1')}
                />
                <RadioButton
                  label="Option 2"
                  value="option2"
                  checked={radioValue === 'option2'}
                  onChange={() => setRadioValue('option2')}
                />
                <RadioButton
                  label="Option 3"
                  value="option3"
                  checked={radioValue === 'option3'}
                  onChange={() => setRadioValue('option3')}
                />
              </Stack>
            </div>
          </Stack>
        </section>

        {/* Chips Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Chips</h2>
          <Stack spacing="sm" direction="horizontal">
            <Chip variant="filled">Filled Chip</Chip>
            <Chip variant="outlined">Outlined Chip</Chip>
            <Chip variant="filled" size="sm">Small Chip</Chip>
            <Chip variant="filled" size="lg">Large Chip</Chip>
            <Chip variant="filled" dismissible onDismiss={() => console.log('dismissed')}>
              Dismissible Chip
            </Chip>
          </Stack>
        </section>

        {/* Cards Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Cards</h2>
          <Stack spacing="md">
            <DetailCard title="Detail Card Example">
              <p>
                This is a detail card component that can display structured information
                in a clean, organized format. Perfect for showing details about items,
                users, or any other entities.
              </p>
            </DetailCard>
            <OpportunityCard
              title="Business Opportunity"
              urgency="important"
            >
              <p>
                Explore new market opportunities with our innovative solutions.
                This opportunity is marked as important and requires attention.
              </p>
            </OpportunityCard>
          </Stack>
        </section>

        {/* Layout Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Layout Components</h2>
          <div className="border border-gray-300 rounded-lg p-4">
            <p className="mb-2 text-sm text-gray-600">
              Stack component with horizontal direction:
            </p>
            <Stack spacing="md" direction="horizontal">
              <div className="bg-blue-100 p-4 rounded">Item 1</div>
              <div className="bg-blue-100 p-4 rounded">Item 2</div>
              <div className="bg-blue-100 p-4 rounded">Item 3</div>
            </Stack>
          </div>
        </section>

        <footer className="text-center py-8 text-gray-500 text-sm">
          <p>Built with @fidus/ui v1.5.0</p>
          <p className="mt-2">
            SSR-optimized components that work without a centralized provider
          </p>
        </footer>
      </Stack>
    </Container>
  )
}
