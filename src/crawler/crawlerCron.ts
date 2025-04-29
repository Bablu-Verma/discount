import { setProducts } from './dataStore';
import { scrapeAllSites } from './scraper';

async function runScraper() {
  console.log('Scraping started...');
  try {
    const products = await scrapeAllSites();
    setProducts(products);
    console.log('Scraping done ✅');
  } catch (error) {
    console.error('Scraping failed ❌', error);
  }
}

runScraper(); 
setInterval(runScraper, 5 * 60 * 60 * 1000);