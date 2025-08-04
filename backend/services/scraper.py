import requests
from bs4 import BeautifulSoup
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

class WebScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                           'AppleWebKit/537.36 (KHTML, like Gecko) '
                           'Chrome/91.0.4472.124 Safari/537.36')
        })

    def scrape_url(self, url: str) -> Dict[str, str]:
        try:
            logger.info(f"Scraping URL: {url}")
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')

            title = soup.title.string if soup.title else None
            paragraphs = soup.find_all('p')
            content = '\n'.join([p.get_text() for p in paragraphs])

            return {
                'url': url,
                'title': title,
                'content': content,
                'status': 'success'
            }
        except Exception as e:
            logger.error(f"Error scraping {url}: {str(e)}")
            return {
                'url': url,
                'title': None,
                'content': '',
                'status': 'error',
                'error': str(e)
            }

    def scrape_urls(self, urls: List[str]) -> List[Dict[str, str]]:
        results = []
        for url in urls:
            results.append(self.scrape_url(url))
        return results
