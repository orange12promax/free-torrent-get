const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
const randomUseragent = require("random-useragent");

var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "m_team",
});

connection.connect(function (err) {
  if (err) {
    console.error("连接失败: " + err.stack);
    return;
  }

  console.log("连接成功 id " + connection.threadId);
});

async function run() {
  const innerConnection = connection;
  let browser = await puppeteer.launch({
    headless: false,
  });
  let page = await browser.newPage();
  const UA = randomUseragent.getRandom();

  await page.setViewport({
    width: 1800 + Math.floor(Math.random() * 100),
    height: 900 + Math.floor(Math.random() * 100),
    deviceScaleFactor: 1,
    hasTouch: false,
    isLandscape: false,
    isMobile: false,
  });

  await page.setUserAgent(UA);
  await page.setJavaScriptEnabled(true);
  await page.setDefaultNavigationTimeout(0);
  await page.goto("https://kp.m-team.cc/adult.php", {
    waitUntil: "networkidle0",
  });
  await page.waitFor(2000);
  const account = "";
  const password = "";

  await page.type(
    "#portal-login > div.wrapper > div > form > table > tbody > tr:nth-child(1) > td.rowfollow > input[type=text]",
    account
  );
  await page.type(
    "#portal-login > div.wrapper > div > form > table > tbody > tr:nth-child(2) > td.rowfollow > input[type=password]",
    password
  );
  await page.click(
    "#portal-login > div.wrapper > div > form > table > tbody > tr:nth-child(4) > td > input"
  );
  // https://kp.m-team.cc/download.php?id=530530&passkey=af35fda992b75e30e7b2b8ee9af4d1b3&ipv6=1&https=1
  // #form_torrent tr
  await page.waitFor(2000);
  // const list = [];
  const list = await page.$$eval(
    "#form_torrent > table > tbody > tr",
    (elements) => {
      return elements.map(function (item, index) {
        if (index > 0) {
          return item.innerHTML;
          // console.log();
        }
        return null;
      });
    }
  );
  console.log(list);
  list.forEach((html) => {
    innerConnection.query(
      "INSERT INTO origin_html(html) VALUES(?)",
      [html],
      (err, results) => {
        if (err) {
          console.log(err);
        }
        console.log(results);
      }
    );
  });
}

run();
