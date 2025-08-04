import re
from typing import List

def basic_sentence_split(text: str) -> List[str]:
    # Split using punctuation marks ., !, ?
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    return [s.strip() for s in sentences if s.strip()]
