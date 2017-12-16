#!/usr/bin/env node

const ora = require('ora');
const superAgent = require('superagent');
const cheerio = require('cheerio');
const readline = require('readline');
const colors = require('colors');
// 创建readline.Interface实现命令行交互
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '    您正在使用joke-cli，按下回车查看笑话   >>>'
});

let spinner;
let url = 'http://www.qiushibaike.com/text/page/';
let page = 1;
// 使用数组来存放笑话
let jokeStories = [];
function loadJokes() {
  if (jokeStories.length < 3) {
    spinner = ora('加载笑话...');
    spinner.start();
    superAgent
      .get(url + page)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        spinner.stop();
        const $ = cheerio.load(res.text);
        const jokeList = $('.article .content span');
        jokeList.each(function(i, item) {
          jokeStories.push($(this).text());
        });
        page++;
      });
  }
}

rl.prompt();
loadJokes();
// line事件 每当 input 流接收到接收行结束符（\n、\r 或 \r\n）时触发'line'事件。
// 按下回车键显示一条笑话
rl.on('line', (line) => {
  if (jokeStories.length > 0) {
    console.log('==========================');
    console.log(jokeStories.shift().bgCyan.black);
    loadJokes();
  } else {
    console.log('正在加载中~~'.green);
  }
  rl.prompt();
}).on('close', () => {
  console.log('Bye!');
  process.exit(0);
});