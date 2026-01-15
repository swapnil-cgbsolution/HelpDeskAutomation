from pathlib import Path
from collections import Counter
import re

text = Path('ReferenceCSS.txt').read_text(encoding='utf-8', errors='ignore')
colors = re.findall(r'#(?:[0-9a-fA-F]{3}){1,2}', text)
color_counts = Counter(color.upper() for color in colors)
print('Total colors:', len(color_counts))
print('Top colors:')
for color, freq in color_counts.most_common(30):
    print(color, freq)
fonts = sorted(set(re.findall(r"font-family:\s*'([^']+)'", text)))
print('\nFonts:')
for font in fonts:
    print(font)
