const puppeteer = require('puppeteer');
const fs = require('fs');
(async () => {
    // 先通过 puppeteer.launch() 创建一个浏览器实例 Browser 对象
    const browser = await puppeteer.launch();
    // 然后通过 Browser 对象创建页面 Page 对象
    const page = await browser.newPage();
    // 然后 page.goto() 跳转到指定的页面
    await page.goto('http://i.meituan.com');
    await page.click('#index > header > div.nav-wrap-left > a')
    await page.waitFor(1000);
    // 要获取打开的网页中的宿主环境
    const dimensions = await page.evaluate(() => {
        /* page.$(selector) 与我们常用的 document.querySelector(selector) 一致，返回的是一个 ElementHandle 元素句柄
        page.$$(selector) 与我们常用的 document.querySelectorAll(selector) 一致，返回的是一个数组 */

        let aDivs = document.querySelectorAll('#cityBox .table h4')
        let titleList = []
        let obj = []
        for (let i = 0, len = aDivs.length; i < len; i++) {
            titleList[i] = aDivs[i].innerText
            let aA = aDivs[i].parentNode.querySelectorAll('a.react')
            obj.push(titleList[i])
            let cityList = []
            for (let j = 0, len1 = aA.length; j < len1; j++) {
                let py = aA[j].getAttribute('data-citypinyin')
                cityList.push({
                    'name': aA[j].innerText,
                    'pinyin': py
                })
            }
            obj.push(cityList)
            res = {
                openCityList: obj
            }
        }
        return res;
    });
    // 将城市信息写入文件
    writerStream = fs.createWriteStream('city_info_list.json');
    writerStream.write(JSON.stringify(dimensions, undefined, 2), 'UTF8');
    writerStream.end();
    console.log('Dimensions:', dimensions);
    await browser.close();
})();
