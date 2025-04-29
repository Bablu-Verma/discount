
import LiveDealModel from '@/model/LiveDeal';
import { scrapeAllSites } from './scraper';
import dbConnect from '@/lib/dbConnect';

async function runScraper() {
  console.log('Scraping started...');

  try {
    await dbConnect();
    const products = await scrapeAllSites();
    console.log("products crawler", products);

    if (products.length > 0) {
      await LiveDealModel.deleteMany({});
      await LiveDealModel.insertMany(products);
      console.log('Products saved to MongoDB ✅');
    } else {
      console.log('No products scraped.');
    }

    console.log('Scraping done ✅');
  } catch (error) {
    console.error('Scraping failed ❌', error);
  }
}

// runScraper(); 
// setInterval(runScraper, 5 * 60 * 60 * 1000);