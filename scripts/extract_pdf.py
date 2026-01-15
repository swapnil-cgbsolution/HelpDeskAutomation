from pathlib import Path

try:
    from PyPDF2 import PdfReader
except ImportError:
    raise SystemExit("PyPDF2 not installed. Run 'pip install PyPDF2' first.")

pdf_path = Path(__file__).resolve().parents[1] / 'System Design.pdf'
reader = PdfReader(pdf_path)

for index, page in enumerate(reader.pages, start=1):
    print(f"--- Page {index} ---")
    text = page.extract_text() or ''
    print(text.strip())
