import requests
import feedparser
from datetime import datetime
from email.utils import parsedate_to_datetime
from ai_engine.models import MedicalArticle

RSS_FEEDS = {
    'Public Health': 'https://www.who.int/rss-feeds/news-english.xml',
    'Technology': 'https://scitechdaily.com/news/health/feed/',
    'Medical Research': 'https://www.medpagetoday.com/rss/headlines.xml',
    'Cardiology': 'https://newsnetwork.mayoclinic.org/feed/'
}

def fetch_latest_news():
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
    for category, url in RSS_FEEDS.items():
        try:
            response = requests.get(url, headers=headers, timeout=10)
            if response.status_code == 200:
                feed = feedparser.parse(response.content)
                for entry in feed.entries[:8]: # Top 8 per category
                    if not MedicalArticle.objects.filter(link=entry.link).exists():
                        pub_date = None
                        if hasattr(entry, 'published'):
                            try:
                                pub_date = parsedate_to_datetime(entry.published)
                            except:
                                pass
                        
                        thumbnail_url = None
                        if hasattr(entry, 'media_thumbnail') and len(entry.media_thumbnail) > 0:
                            thumbnail_url = entry.media_thumbnail[0].get('url')
                        elif hasattr(entry, 'media_content') and len(entry.media_content) > 0:
                             thumbnail_url = entry.media_content[0].get('url')
                        
                        MedicalArticle.objects.create(
                            title=entry.title,
                            source=feed.feed.title if hasattr(feed.feed, 'title') else 'Medical News',
                            link=entry.link,
                            published_date=pub_date,
                            thumbnail_url=thumbnail_url,
                            short_description=entry.summary if hasattr(entry, 'summary') else '',
                            category=category
                        )
        except Exception as e:
            print(f"Error fetching RSS for {category}: {e}")
