#!/usr/bin/env python3
"""
Merge duplicate override attributes in JSX files.
Converts:
    override={{ a: 1 }}
    override={{ b: 2 }}
To:
    override={{ a: 1, b: 2 }}
"""

import re
import sys
from pathlib import Path

def merge_overrides_in_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # Pattern to find consecutive override attributes
    # This is a simplified approach - finds override on consecutive lines
    pattern = r'(override=\{\{[^}]+\}\})\s*\n\s*(override=\{\{[^}]+\}\})'

    def merge_match(match):
        first = match.group(1)
        second = match.group(2)

        # Extract contents (remove override={{ and }})
        first_content = re.search(r'override=\{\{(.+)\}\}', first).group(1).strip()
        second_content = re.search(r'override=\{\{(.+)\}\}', second).group(1).strip()

        # Remove trailing comma from first if exists
        first_content = first_content.rstrip(',').strip()

        # Merge
        merged = f'override={{ {first_content}, {second_content} }}'
        return merged

    # Keep merging until no more duplicates found
    max_iterations = 10  # Prevent infinite loop
    for _ in range(max_iterations):
        new_content = re.sub(pattern, merge_match, content, flags=re.MULTILINE)
        if new_content == content:
            break
        content = new_content

    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    # Get all TypeScript/TSX files with errors
    error_files = [
        "src/apps/crm/drawer/DrawerProperties.tsx",
        "src/apps/crm/drawer/JsonTree.tsx",
        "src/apps/crm/drawer/PropertySection.tsx",
        "src/design-system/Action.tsx",
        "src/inspector/components/InspectorControls.tsx",
        "src/inspector/components/InspectorPanel.tsx",
    ]

    fixed_count = 0
    for file_path in error_files:
        full_path = Path(file_path)
        if full_path.exists():
            if merge_overrides_in_file(full_path):
                print(f"✅ Fixed: {file_path}")
                fixed_count += 1
            else:
                print(f"⏭️  Skip: {file_path} (no duplicates found)")
        else:
            print(f"❌ Not found: {file_path}")

    print(f"\n📊 Total fixed: {fixed_count} files")

if __name__ == "__main__":
    main()
