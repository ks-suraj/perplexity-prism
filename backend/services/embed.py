import numpy as np
from sentence_transformers import SentenceTransformer
import torch
from typing import List
import logging

logger = logging.getLogger(__name__)

class EmbeddingService:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model_name = model_name
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = None
        self._load_model()
    
    def _load_model(self):
        logger.info(f"Loading embedding model: {self.model_name}")
        self.model = SentenceTransformer(self.model_name)
        self.model.to(self.device)
        logger.info(f"Embedding model loaded on {self.device}")
    
    def encode(self, sentences: List[str]):
        return self.model.encode(sentences, convert_to_tensor=False)
    
    def cosine_similarity(self, emb1: np.ndarray, emb2: np.ndarray) -> float:
        return float(np.dot(emb1, emb2) / (np.linalg.norm(emb1) * np.linalg.norm(emb2)))
