#! /usr/bin/env node

const ora = require('ora');
const superAgent = require('superagent');
const cheerio = require('cheerio');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: ' 您正在使用xiaozu-spider，开始抓取民宿房源信息   >>>\n'
});
const argv = process.argv.slice(2);
const loadPage = argv[0];

let spinner;
let baseUrl = 'https://sh.xiaozhu.com/';
// 存放房源信息
let rooms = [];
function loadRooms(page) {
  spinner = ora('加载数据中...');
  spinner.start();
  return new Promise((resolve, reject) => {
    const url =`${baseUrl}search-duanzufang-p${page}-0/`;
    console.log(url);
    superAgent
      .get(url)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        spinner.stop();
        const $ = cheerio.load(res.text);
        const roomList = $('#page_list .pic_list li');
        console.log(`数据成功返回，共有${roomList.length}条`);
        if (res.text.indexOf('解除限制') > -1) {
          reject('~~~~~~~~~~~~!!!!!!!被限制啦!!!!!!!!~~~~~~~~~~~~');
        }
        roomList.each(function() {
          const $this = $(this);
          const $img = $this.find('.resule_img_a img');
          const $detail_info = $this.find('.result_btm_con');
          const lodgeunit = {
            id: $this.attr('lodgeunitid'),
            latlng: $this.attr('latlng'),
            img_url: $img.attr('lazy_src'),
            img_title: $img.attr('title'),
            detail_url: $detail_info.attr('detailurl'),
            price_text: $detail_info.find('.result_price').text(),
            price: $detail_info.find('.result_price i').text(),
            fangdong: {
              img_url: $detail_info.find('.result_img img').attr('lazy_src'),
              detail_url: $detail_info.find('.result_img a').attr('href')
            },
            title: $detail_info.find('.result_intro .result_title').text(),
            type: $detail_info.find('.result_intro em').text().replace(/\n/g, '').replace(/(^\s*)|(\s*$)/g, ''),
            comment: $detail_info.find('.result_intro em .commenthref').text().replace(/\n/g, '').replace(/(^\s*)|(\s*$)/g, '')
          };
          rooms.push(lodgeunit);
        });
        resolve(rooms);
      });
  });
}

rl.prompt();
const promises = [];
for (let currentPage = 1; currentPage <= loadPage; currentPage++) {
  promises.push(loadRooms.bind(this, currentPage));
}
function promiseIter(promises) {
  return new Promise((resolve, reject) => {
    nextPromise(0, promises);
    function nextPromise (index, promises) {
      if (index >= promises.length) {
        resolve();
      }
      promises[index]().then(() => {
        nextPromise(index + 1, promises);
      }).catch((err) => {
        reject(err);
      })
    }
  })
}
function printResult () {
  console.log('==============================');
  console.log(`共有${rooms.length}条房源数据`);
  if (rooms.length > 0) {
    fs.writeFileSync('data.json', JSON.stringify(rooms, null, 2))
    console.log('数据写入成功！');
  }
}
promiseIter(promises).then(() => {
  printResult();
  process.exit(0);
}).catch((err) => {
  console.log();
  console.log(err);
  printResult();
  process.exit(0);
});