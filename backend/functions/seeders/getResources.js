const puppeteer = require("puppeteer-extra");

const getResources = async () => {
  const url = "http://crossroadcenter.org/parents/";
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();

  await page.goto(url);

  const resources = [];

  await page.waitForSelector(
    "#pb_list_2FB84027AC696DE5742816A322A8276A > p:nth-child(6) > a"
  );

  for (let i = 6; i <= 53; i++) {
    const selector = `#pb_list_2FB84027AC696DE5742816A322A8276A > p:nth-child(${i}) > a`;

    try {
      const info = await page.evaluate(
        (i, selector) => {
          console.log(selector);
          const href = document.querySelector(selector).getAttribute("href");

          const title = document.querySelector(selector).innerText;

          const tags = ["5fcfd29e416d4f49732fa586"];

          return {
            title,
            link: href,
            tags,
          };
        },
        i,
        selector
      );

      resources.push(info);
    } catch (e) {
      console.log(selector, i, e);
    }
  }

  browser.close();
  console.log(resources);
  return resources;
};

getResources();
