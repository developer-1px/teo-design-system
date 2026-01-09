#!/usr/bin/env python3
"""
Fix @/components/dsl destructured imports
"""
import re
import sys
from pathlib import Path

# Mapping of component names to their new paths
DSL_COMPONENT_MAP = {
    'Page': '@/components/Page/Page',
    'Section': '@/components/Section/Section',
    'Group': '@/components/Group/Group',
    'Text': '@/components/Text/Text',
    'Field': '@/components/Field/Field',
    'Action': '@/components/Action/Action',
    'Overlay': '@/components/Overlay/Overlay',
}

def fix_file(filepath):
    """Fix imports in a single file"""
    content = filepath.read_text()
    original = content

    # Find all @/components/dsl imports
    pattern = r"import\s+\{([^}]+)\}\s+from\s+['\"]@/components/dsl['\"];"

    def replace_import(match):
        components_str = match.group(1)
        components = [c.strip() for c in components_str.split(',')]

        # Create individual imports
        imports = []
        for comp in components:
            if comp in DSL_COMPONENT_MAP:
                imports.append(f"import {{ {comp} }} from '{DSL_COMPONENT_MAP[comp]}';")

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
