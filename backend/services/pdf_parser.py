import io
import PyPDF2
from core.deps import supabase

def extract_text_from_supabase_pdf(storage_path: str) -> str:
    """Downloads a PDF from Supabase storage and extracts its text."""
    try:
        # Download the file as bytes from Supabase
        response = supabase.storage.from_("resumes").download(storage_path)
        
        # Read the bytes into PyPDF2
        pdf_file = io.BytesIO(response)
        reader = PyPDF2.PdfReader(pdf_file)
        
        extracted_text = ""
        for page in reader.pages:
            text = page.extract_text()
            if text:
                extracted_text += text + "\n"
                
        return extracted_text.strip()
    except Exception as e:
        raise Exception(f"Failed to parse PDF: {str(e)}")