#!/usr/bin/env python3
"""
Fix @/components/ui destructured imports
"""
import re
import sys
from pathlib import Path

# Mapping of component names to their new paths
UI_COMPONENT_MAP = {
    'Button': '@/components/Action/role/Button',
    'IconButton': '@/components/Action/role/IconButton',
    'Badge': '@/components/Text/role/Badge',
    'Card': '@/components/Group/role/Card',
    'Divider': '@/components/utils/Divider',
    'FormField': '@/components/Field/role/FormField',
    'Input': '@/components/Field/role/Input',
    'Select': '@/components/Field/role/Select',
    'Switch': '@/components/Field/role/Switch',
    'Tabs': '@/components/Group/role/Tabs',
    'TabsList': '@/components/Group/role/Tabs',  # Usually exported together
    'TabsTrigger': '@/components/Group/role/Tabs',
    'TabsContent': '@/components/Group/role/Tabs',
    'SearchInput': '@/components/Field/role/SearchInput',
    'Kbd': '@/components/Text/role/Kbd',
    'Label': '@/components/Text/role/Label',
    'Alert': '@/components/Text/role/Alert',
    'Avatar': '@/components/Text/role/Avatar',
    'Progress': '@/components/utils/Progress',
    'Skeleton': '@/components/utils/Skeleton',
    'Tooltip': '@/components/Overlay/role/Tooltip',
}

def fix_file(filepath):
    """Fix imports in a single file"""
    content = filepath.read_text()
    original = content

    # Find all @/components/ui imports
    pattern = r"import\s+\{([^}]+)\}\s+from\s+['\"]@/components/ui['\"];"

    def replace_import(match):
        components_str = match.group(1)
        components = [c.strip() for c in components_str.split(',')]

        # Group components by their new import path
        path_groups = {}
        for comp in components:
            if comp in UI_COMPONENT_MAP:
                path = UI_COMPONENT_MAP[comp]
                if path not in path_groups:
                    path_groups[path] = []
                path_groups[path].append(comp)

        # Create individual imports (one per path)
        imports = []
        for path, comps in path_groups.items():
            imports.append(f"import {{ {', '.join(comps)} }} from '{path}';")

        return '\n'.join(imports)

    content = re.sub(pattern, replace_import, content)

    if content != original:
        filepath.write_text(content)
        return True
    return False

def main():
    src_dir = Path('/Users/user/Desktop/ide-ui-kit/src')

    # Find all TypeScript files
    files = list(src_dir.rglob('*.tsx')) + list(src_dir.rglob('*.ts'))

    fixed_count = 0
    for filepath in files:
        if fix_file(filepath):
            print(f"Fixed: {filepath.relative_to(src_dir)}")
            fixed_count += 1

    print(f"\nTotal files fixed: {fixed_count}")

if __name__ == '__main__':
    main()
