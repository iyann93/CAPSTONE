import os
import re

dashboards_dir = r"c:\Users\M S I\Documents\CP SIA\src\pages\dashboards"

def fix_set_view(content):
    # We want to replace setView("...") with setView("..."); window.scrollTo({top: 0, behavior: "smooth"});
    # Be careful not to replace it if it already has window.scrollTo
    
    # Regex to find setView("...") or setView('...') without window.scrollTo right after it
    def replacer(match):
        full = match.group(0)
        inner = match.group(1) # "list" or 'edit', etc
        if "window.scrollTo" in content[match.end():match.end()+50]:
            return full
        return f'{full} setTimeout(() => window.scrollTo({{ top: 0, behavior: "smooth" }}), 50);'

    # match setView("x"); or setView('x'); or setView("x")
    content = re.sub(r'setView\((["\'].*?["\'])\);?', replacer, content)
    
    # Also handle setSelectedClass or similar if needed? No, setView is the main one.
    return content

count = 0
for root, _, files in os.walk(dashboards_dir):
    for f in files:
        if f.endswith('.jsx'):
            path = os.path.join(root, f)
            try:
                with open(path, 'r', encoding='utf-8') as file:
                    content = file.read()
            except UnicodeDecodeError:
                with open(path, 'r', encoding='utf-16') as file:
                    content = file.read()
            
            new_content = fix_set_view(content)
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                count += 1

print(f"Updated {count} files with auto-scroll")
