const puppeteer = require("puppeteer-core");
// const chrome = require("chrome-aws-lambda");
const chrome = require("@sparticuz/chromium");


const capture = async  (event) => {
  const { queryStringParameters } = event;
  if (!queryStringParameters || !queryStringParameters.url || !queryStringParameters.screen) {
    return { statusCode: 403 };
  }

  const { url } = queryStringParameters;
  const [width, height] = queryStringParameters.screen.split(",");

  if (!width || !height) {
    return { statusCode: 403 };
  }

  const browser = await puppeteer.launch({
    executablePath: await chrome.executablePath,
    args: chrome.args
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: Number(width),
    height: Number(height)
  });

  await page.goto(url);
  const screenshot = await page.screenshot({ encoding: "base64" });

  return {
    statusCode: 200,
    body: `<img src="data:image/png;base64,${screenshot}">`,
    // body: `<div>hi</div>`,
    headers: { "Content-Type" : "text/html" }
  };
}

module.exports = { capture };
