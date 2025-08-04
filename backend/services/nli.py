from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from typing import Dict
import logging

logger = logging.getLogger(__name__)

class NLIService:
    def __init__(self, model_name: str = "roberta-large-mnli"):
        self.model_name = model_name
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.tokenizer = None
        self.model = None
        self.labels = ["contradiction", "neutral", "entailment"]
        self._load_model()
    
    def _load_model(self):
        logger.info(f"Loading NLI model: {self.model_name}")
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(self.model_name)
        self.model.to(self.device)
        self.model.eval()
        logger.info(f"NLI model loaded on {self.device}")
    
    def predict_entailment(self, premise: str, hypothesis: str) -> Dict[str, float]:
        inputs = self.tokenizer(premise, hypothesis, return_tensors="pt", truncation=True, padding=True, max_length=512)
        inputs = {k: v.to(self.device) for k, v in inputs.items()}
        with torch.no_grad():
            outputs = self.model(**inputs)
            probs = torch.nn.functional.softmax(outputs.logits, dim=1)[0]
        return {label: float(probs[i]) for i, label in enumerate(self.labels)}
    
    def calculate_support_strength(self, scores: Dict[str, float]) -> str:
        entailment = scores["entailment"]
        contradiction = scores["contradiction"]
        neutral = scores["neutral"]
        if entailment > 0.7:
            return "strong"
        elif entailment > 0.4 and entailment > contradiction:
            return "moderate"
        elif neutral > 0.5:
            return "light"
        else:
            return "none"
