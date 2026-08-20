from django.core.management.base import BaseCommand
from ai_engine.services.news_service import fetch_latest_news

class Command(BaseCommand):
    help = 'Fetches the latest medical news from RSS feeds and stores them in the MedicalArticle database table.'

    def handle(self, *args, **kwargs):
        self.stdout.write('Fetching latest medical news from RSS...')
        try:
            articles = fetch_latest_news()
            self.stdout.write(self.style.SUCCESS(f'Successfully fetched and saved/updated articles.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error fetching news: {e}'))
