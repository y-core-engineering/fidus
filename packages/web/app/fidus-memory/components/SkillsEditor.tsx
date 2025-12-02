'use client';

import { useState, useCallback } from 'react';
import { Autocomplete, Badge } from '@fidus/ui';

interface SkillsEditorProps {
  skills: string[];
  onChange: (skills: string[]) => void;
  disabled?: boolean;
}

const COMMON_SKILLS = [
  'Python',
  'TypeScript',
  'JavaScript',
  'React',
  'Node.js',
  'FastAPI',
  'Django',
  'Machine Learning',
  'Data Science',
  'DevOps',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'GCP',
  'Neo4j',
  'PostgreSQL',
  'GraphQL',
  'REST API',
  'Git',
  'Agile',
  'Project Management',
];

export function SkillsEditor({ skills, onChange, disabled = false }: SkillsEditorProps) {
  const [inputValue, setInputValue] = useState('');

  // Filter out already-added skills from suggestions
  const availableSuggestions = COMMON_SKILLS.filter(
    (skill) => !skills.includes(skill)
  );

  const handleAddSkill = useCallback((skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      onChange([...skills, trimmedSkill]);
    }
    setInputValue('');
  }, [skills, onChange]);

  const handleRemoveSkill = useCallback((skillToRemove: string) => {
    onChange(skills.filter((s) => s !== skillToRemove));
  }, [skills, onChange]);

  return (
    <div className="space-y-3">
      {/* Skill Tags */}
      <div className="flex flex-wrap gap-2 min-h-[32px]">
        {skills.map((skill) => (
          <Badge key={skill} variant="normal" className="flex items-center gap-1 px-2 py-1">
            {skill}
            {!disabled && (
              <button
                onClick={() => handleRemoveSkill(skill)}
                className="ml-1 hover:text-red-500 focus:outline-none"
                aria-label={`Remove ${skill}`}
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </Badge>
        ))}
        {skills.length === 0 && (
          <span className="text-gray-400 text-sm">No skills added yet</span>
        )}
      </div>

      {/* Autocomplete Input */}
      {!disabled && (
        <Autocomplete
          label=""
          value={inputValue}
          suggestions={availableSuggestions}
          onChange={setInputValue}
          onSelect={handleAddSkill}
          onClear={() => setInputValue('')}
          placeholder="Type a skill and press Enter..."
          allowCustomValue={true}
          clearable={true}
          maxSuggestions={5}
          helperText="Select from suggestions or type your own skill"
        />
      )}
    </div>
  );
}
