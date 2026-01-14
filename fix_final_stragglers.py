import glob
import re

def process_file(filepath):
    with open(filepath, 'r') as f: content = f.read()
    orig = content
    
    replacements = {
        "Size.n45": "Size.n44",
        "Size.n55": "Size.n56",
        "Size.n25": "Size.n24",
        "Size.n30": "Size.n32",
        "Size.n250": "Size.n256",
        'h: "header"': 'h: Size.n20',
        'h="header"': 'h={Size.n20}',
        'h: "full"': 'h: Size.full',
        'h="full"': 'h={Size.full}',
        'w={0.5}': 'w={Size.n2}',
        'w: 0.5': 'w: Size.n2',
    }
    
    for old, new in replacements.items():
        content = content.replace(old, new)

    if content != orig:
        with open(filepath, 'w') as f: f.write(content)
        print(f"Updated {filepath}")

def main():
    files = glob.glob("src/**/*.tsx", recursive=True)
    for f in files:
        process_file(f)

if __name__ == "__main__":
    main()
