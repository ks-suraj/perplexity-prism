from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl
from typing import List, Dict, Any
import time
import numpy as np

from services.scraper import WebScraper
from services.embed import EmbeddingService
from services.nli import NLIService
from utils.text_processing import basic_sentence_split

router = APIRouter()

# Initialize services once
scraper = WebScraper()
embed_service = EmbeddingService()
nli_service = NLIService()

class AnalysisRequest(BaseModel):
    answer: str
    citations: List[HttpUrl]

class SentenceSupport(BaseModel):
    sentence: str
    support_strength: str
    confidence_score: float
    supporting_sources: List[int]
    evidence_quotes: List[str]

class AnalysisResponse(BaseModel):
    sentences: List[SentenceSupport]
    citations_content: List[Dict[str, Any]]
    processing_time: float

@router.post("/analyze-support", response_model=AnalysisResponse)
def analyze_support(data: AnalysisRequest):
    start_time = time.time()

    # Step 1: Split answer into sentences
    sentences = basic_sentence_split(data.answer)

    # Step 2: Scrape citations
    citations_texts = scraper.scrape_urls([str(url) for url in data.citations])
    if any(c['status'] == 'error' for c in citations_texts):
        raise HTTPException(status_code=400, detail="One or more URLs failed scraping")

    # Step 3: Prepare citation sentences list
    citation_sentences = [basic_sentence_split(c['content']) for c in citations_texts]

    results = []

    # Step 4: Analyze each sentence against citation sentences
    for i, sent in enumerate(sentences):
        support_sources = []
        evidence_for_sentence = []
        confidence = 0.0
        support_str = "none"

        for j, cit_sents in enumerate(citation_sentences):
            if not cit_sents:
                continue
            
            sent_emb = embed_service.encode([sent])[0]
            cit_embs = embed_service.encode(cit_sents)

            sims = [np.dot(sent_emb, cemb) / (np.linalg.norm(sent_emb) * np.linalg.norm(cemb)) for cemb in cit_embs]
            max_sim = max(sims)
            best_idx = sims.index(max_sim)

            nli_scores = nli_service.predict_entailment(cit_sents[best_idx], sent)
            entailment = nli_scores["entailment"]

            combined_confidence = max(max_sim, entailment)

            if combined_confidence > 0.4:
                support_sources.append(j)
                evidence_for_sentence.append(cit_sents[best_idx])
                confidence = max(confidence, combined_confidence)

        if confidence > 0.7:
            support_str = "strong"
        elif confidence > 0.4:
            support_str = "moderate"
        elif confidence > 0.2:
            support_str = "light"

        results.append(SentenceSupport(
            sentence=sent,
            support_strength=support_str,
            confidence_score=confidence,
            supporting_sources=support_sources,
            evidence_quotes=evidence_for_sentence
        ))

    processing_time = time.time() - start_time

    return AnalysisResponse(
        sentences=results,
        citations_content=citations_texts,
        processing_time=processing_time
    )
