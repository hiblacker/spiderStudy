var cheerio = require("cheerio");
var http = require("http");
var iconv = require("iconv-lite");
// var url = "https://juejin.im/";
// var url = "http://www.ygdy8.net/html/gndy/dyzz/index.html";

var index = 1; //页面数控制
var url = "https://s.taobao.com/search?q=%E7%BE%8E%E5%A5%B3";
var titles = []; //用于保存title
var urls=[]
var count=1
var urlindex=1
function getTitle(url, i) {
  console.log("正在获取第" + i + "页的内容");
  http.get(url + i + ".html", function(sres) {
    var chunks = [];
    sres.on("data", function(chunk) {
      chunks.push(chunk);
    });
    sres.on("end", function() {
      var html = iconv.decode(Buffer.concat(chunks), "gb2312");
      var $ = cheerio.load(html, { decodeEntities: false });
      console.log($.html())
      $(".co_content8 .ulink").each(function(idx, element) {
        var $element = $(element);
        titles.push({ title: $element.text()});
        urls.push($element.attr('href'));
      });
      if (i < 2) {
        //为了方便只爬了两页
        // getTitle(url, ++index); //递归执行，页数+1
      } else {
        console.log(titles);
        console.log("Title获取完毕！,开始获取连接");
        getBtLink(urls, count)
      }
    });
  });
}
function main() {
  console.log("开始爬取");
  getTitle(url, index);
  
}
main(); //运行主函数

var btLink = []
  function getBtLink(urls, n) {
      console.log(urls[n])
    //urls里面包含着所有详情页的地址  
    console.log("正在获取第" + n + "个url的内容");
    http.get("http://www.ygdy8.net" + urls[n], function(sres) {
      var chunks = [];
      sres.on("data", function(chunk) {
        chunks.push(chunk);
      });
      sres.on("end", function() {
        var html = iconv.decode(Buffer.concat(chunks), "gb2312"); //进行转码
        var $ = cheerio.load(html, { decodeEntities: false });
        $("#Zoom td a")
          .each(function(idx, element) {
            var $element = $(element);
            btLink.push({ bt: $element.attr("href") });
          });
        if (n < urls.length - 1) {
          getBtLink(urls, ++count); //递归
        } else {
          console.log("btlink获取完毕！");
          console.log(btLink);
        }
      });
    });
  }
 

