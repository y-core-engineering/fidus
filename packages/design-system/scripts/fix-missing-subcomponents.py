#!/usr/bin/env python3
"""
Fixes missing sub-component imports in design system files.
Adds missing sub-components to existing imports.
"""

import re
import sys
from pathlib import Path

# Map of component to its sub-components
SUBCOMPONENTS = {
    'button-group': ['ButtonGroup'],
    'drawer': ['DrawerRoot', 'DrawerTrigger', 'DrawerContent', 'DrawerHeader', 'DrawerTitle', 'DrawerDescription', 'DrawerBody', 'DrawerFooter'],
    'dropdown': ['DropdownRoot', 'DropdownTrigger', 'DropdownContent', 'DropdownItem', 'DropdownSeparator', 'DropdownLabel', 'DropdownCheckboxItem', 'DropdownRadioGroup', 'DropdownRadioItem', 'DropdownSub', 'DropdownSubTrigger', 'DropdownSubContent'],
    'grid': ['Grid'],
    'header': ['Header'],
    'list': ['List', 'ListItem'],
    'modal': ['ModalRoot', 'ModalContent', 'ModalHeader', 'ModalTitle', 'ModalDescription', 'ModalBody', 'ModalFooter'],
    'popover': ['PopoverRoot', 'PopoverTrigger', 'PopoverContent', 'PopoverClose'],
    'progress-bar': ['CircularProgress'],
    'radio-button': ['RadioGroup'],
    'sidebar': ['Sidebar', 'SidebarRoot', 'SidebarSection', 'SidebarItem'],
    'table': ['TableCaption'],
    'tabs': ['TabsRoot', 'TabsList', 'TabsTrigger', 'TabsContent'],
    'toast': ['ToastProvider', 'ToastViewport'],
    'tooltip': ['TooltipProvider', 'TooltipRoot', 'TooltipTrigger', 'TooltipContent'],
}

def fix_file(file_path: Path) -> bool:
    """Fix missing sub-component imports in a file."""
    content = file_path.read_text()
    original_content = content

    # Find all @fidus/ui imports
    import_pattern = r"import\s+\{([^}]+)\}\s+from\s+['\"]@fidus/ui/([^'\"]+)['\"]"

    for match in re.finditer(import_pattern, content):
        imports_str, component_name = match.groups()

        # Skip if this component doesn't have sub-components
        if component_name not in SUBCOMPONENTS:
            continue

        # Parse existing imports
        existing_imports = [imp.strip() for imp in imports_str.split(',')]
        existing_imports_set = set(existing_imports)

        # Find which sub-components are used in the file but not imported
        missing_subcomponents = []
        for subcomp in SUBCOMPONENTS[component_name]:
            # Check if subcomp is used in JSX but not imported
            if subcomp not in existing_imports_set:
                # Look for JSX usage: <SubComp or <SubComp/>
                jsx_pattern = rf'<{subcomp}[\s/>]'
                if re.search(jsx_pattern, content):
                    missing_subcomponents.append(subcomp)

        if missing_subcomponents:
            # Add missing sub-components to the import
            new_imports = existing_imports + missing_subcomponents
            new_imports_str = ', '.join(new_imports)
            new_import_statement = f"import {{ {new_imports_str} }} from '@fidus/ui/{component_name}'"

            content = content.replace(match.group(0), new_import_statement)
            print(f"  ✅ Added {', '.join(missing_subcomponents)} to {file_path.name}")

    if content != original_content:
        file_path.write_text(content)
        return True

    return False

def main():
    design_system_root = Path(__file__).parent.parent

    # Find all TypeScript/TSX files
    files = list(design_system_root.rglob('**/*.tsx'))
    files += list(design_system_root.rglob('**/*.ts'))

    # Exclude node_modules, dist, .next
    files = [f for f in files if 'node_modules' not in str(f) and 'dist' not in str(f) and '.next' not in str(f)]

    print(f"Found {len(files)} TypeScript files to process...\n")

    fixed_count = 0
    for file_path in files:
        if fix_file(file_path):
            fixed_count += 1

    print(f"\n✅ Fixed {fixed_count} files!")

if __name__ == '__main__':
    main()
