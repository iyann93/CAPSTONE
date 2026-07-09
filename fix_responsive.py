import os
import re

dirs = [r"c:\Users\M S I\Documents\CP SIA\src\pages", r"c:\Users\M S I\Documents\CP SIA\src\components"]

def fix_content(content):
    # Fix grids
    content = re.sub(
        r'className=(["\'])(.*?)\bgrid-cols-2\b(.*?)\1',
        lambda m: m.group(0) if 'md:grid-cols' in m.group(2)+m.group(3) or 'sm:grid-cols' in m.group(2)+m.group(3) else f'className={m.group(1)}{m.group(2)}grid-cols-1 md:grid-cols-2{m.group(3)}{m.group(1)}',
        content
    )
    content = re.sub(
        r'className=(["\'])(.*?)\bgrid-cols-3\b(.*?)\1',
        lambda m: m.group(0) if 'md:grid-cols' in m.group(2)+m.group(3) or 'lg:grid-cols' in m.group(2)+m.group(3) or 'sm:grid-cols' in m.group(2)+m.group(3) else f'className={m.group(1)}{m.group(2)}grid-cols-1 md:grid-cols-3{m.group(3)}{m.group(1)}',
        content
    )
    content = re.sub(
        r'className=(["\'])(.*?)\bgrid-cols-4\b(.*?)\1',
        lambda m: m.group(0) if 'md:grid-cols' in m.group(2)+m.group(3) or 'lg:grid-cols' in m.group(2)+m.group(3) or 'sm:grid-cols' in m.group(2)+m.group(3) else f'className={m.group(1)}{m.group(2)}grid-cols-1 sm:grid-cols-2 lg:grid-cols-4{m.group(3)}{m.group(1)}',
        content
    )
    content = re.sub(
        r'className=(["\'])(.*?)\bgrid-cols-5\b(.*?)\1',
        lambda m: m.group(0) if 'md:grid-cols' in m.group(2)+m.group(3) or 'lg:grid-cols' in m.group(2)+m.group(3) or 'sm:grid-cols' in m.group(2)+m.group(3) else f'className={m.group(1)}{m.group(2)}grid-cols-1 sm:grid-cols-3 lg:grid-cols-5{m.group(3)}{m.group(1)}',
        content
    )
    
    # Fix w-[XXXpx] to w-full max-w-[XXXpx]
    def fix_fixed_widths(m):
        cls_content = m.group(2)
        if 'max-w' not in cls_content and 'w-full' not in cls_content:
            def replace_w(w_match):
                num = int(w_match.group(1))
                if num >= 300:
                    return f'w-full max-w-[{num}px]'
                return w_match.group(0)
            cls_content = re.sub(r'\bw-\[(\d+)px\]', replace_w, cls_content)
        return f'className={m.group(1)}{cls_content}{m.group(1)}'
        
    content = re.sub(r'className=(["\'])(.*?)\1', fix_fixed_widths, content)

    # Fix flex justify-between
    def fix_flex_wrap(m):
        cls = m.group(2)
        words = cls.split()
        if 'flex' in words and 'justify-between' in words:
            if 'flex-col' not in cls and 'flex-wrap' not in cls and 'md:flex-row' not in cls:
                cls = cls.replace('flex ', 'flex flex-wrap ')
        if 'flex' in words and 'gap-4' in words and 'items-center' in words and 'justify-between' not in words:
            if 'flex-col' not in cls and 'flex-wrap' not in cls and 'md:flex-row' not in cls:
                cls = cls.replace('flex ', 'flex flex-wrap ')
        return f'className={m.group(1)}{cls}{m.group(1)}'
        
    content = re.sub(r'className=(["\'])(.*?)\1', fix_flex_wrap, content)

    return content

count = 0
for d in dirs:
    if not os.path.exists(d): continue
    for root, _, files in os.walk(d):
        for f in files:
            if f.endswith('.jsx'):
                path = os.path.join(root, f)
                try:
                    with open(path, 'r', encoding='utf-8') as file:
                        content = file.read()
                    
                    new_content = fix_content(content)
                    if new_content != content:
                        with open(path, 'w', encoding='utf-8') as file:
                            file.write(new_content)
                        count += 1
                except UnicodeDecodeError:
                    print(f"Skipping {path} due to encoding error")
                    pass
print(f"Updated {count} files")
