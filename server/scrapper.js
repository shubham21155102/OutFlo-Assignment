import { chromium } from 'playwright';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lead from "./models/leads";
dotenv.config();
const SEARCH_URL = 'https://www.linkedin.com/search/results/people/?geoUrn=%5B%22103644278%22%5D&industry=%5B%221594%22%2C%221862%22%2C%2280%22%5D&keywords=%22lead%20generation%22&origin=GLOBAL_SEARCH_HEADER&sid=z%40k&titleFreeText=Founder';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Random delay to mimic human behavior
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const randomDelay = () => sleep(Math.floor(Math.random() * 3000) + 2000); // 2-5 seconds

// Log in to LinkedIn
const loginToLinkedIn = async (page) => {
  console.log('Logging in to LinkedIn...');
  await page.goto('https://www.linkedin.com/login');
  await page.fill('#username', process.env.LINKEDIN_EMAIL);
  await page.fill('#password', process.env.LINKEDIN_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle' });

  if (page.url().includes('feed') || page.url().includes('search')) {
    console.log('Login successful');
  } else {
    throw new Error('Login failed, please check credentials');
  }
};

// Extract profile links from search results
const getProfileLinks = async (page, targetCount = 20) => {
  console.log('Collecting profile links...');
  await page.goto(SEARCH_URL);
  await page.waitForLoadState('networkidle');
  const profileLinks = new Set();

  while (profileLinks.size < targetCount) {
    // Scroll to load more results
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await sleep(1000);

    // Extract links
    const links = await page.$$eval('a.app-aware-link', (elements) =>
      elements
        .map((el) => el.href)
        .filter((href) => href.includes('/in/') && !href.includes('search'))
        .map((href) => href.split('?')[0])
    );

    links.forEach((link) => profileLinks.add(link));

    // Check for next page
    const nextButton = await page.$('button[aria-label="Next"]');
    if (nextButton && profileLinks.size < targetCount) {
      await nextButton.click();
      await page.waitForLoadState('networkidle');
      await randomDelay();
    } else {
      break;
    }
  }

  return Array.from(profileLinks).slice(0, targetCount);
};

// Scrape individual profile
const scrapeProfile = async (page, profileUrl) => {
  console.log(`Scraping profile: ${profileUrl}`);
  await page.goto(profileUrl, { waitUntil: 'networkidle' });

  try {
    // Extract details
    const fullName = await page.$eval(
      'h1.text-heading-xlarge',
      (el) => el.textContent.trim()
    ).catch(() => null);

    const jobTitle = await page.$eval(
      'div.text-body-medium',
      (el) => el.textContent.trim()
    ).catch(() => null);

    const company = await page.$eval(
      'a[href*="/company/"]',
      (el) => el.textContent.trim()
    ).catch(() => null);

    const location = await page.$eval(
      'span.text-body-small.inline.t-black--light.break-words',
      (el) => el.textContent.trim()
    ).catch(() => null);

    // Validate required fields
    if (!fullName || !jobTitle || !company) {
      console.warn(`Skipping ${profileUrl}: Missing required fields`);
      return null;
    }

    return {
      fullName,
      jobTitle,
      company,
      location: location || null,
      profileUrl,
      searchQuery: SEARCH_URL,
      scrapedAt: new Date(),
    };
  } catch (error) {
    console.error(`Error scraping ${profileUrl}:`, error.message);
    return null;
  }
};

// Main function
const main = async () => {
  await connectDB();

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Log in
    await loginToLinkedIn(page);

    // Get profile links
    const profileLinks = await getProfileLinks(page, 20);
    console.log(`Found ${profileLinks.length} profile links`);

    // Scrape profiles
    const profiles = [];
    for (let i = 0; i < profileLinks.length; i++) {
      const profileData = await scrapeProfile(page, profileLinks[i]);
      if (profileData) {
        // Save to MongoDB
        await Lead.findOneAndUpdate(
          { profileUrl: profileData.profileUrl },
          { $set: profileData },
          { upsert: true, new: true }
        );
        profiles.push(profileData);
        console.log(`Stored: ${profileData.fullName}`);
      }
      await randomDelay();
    }

    console.log(`Scraped and stored ${profiles.length} profiles`);
    profiles.forEach((p) => console.log(p));
  } catch (error) {
    console.error('Error in main:', error);
  } finally {
    await browser.close();
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

// Run the script
main().catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});