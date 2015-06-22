var superagent = require('superagent'); //这三个外部依赖不要忘记npm install
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');
var fs = require('fs');
var http = require('http')


var htmlData = [];
var srcData = [];



var ep = new eventproxy;
ep.after('src', 100, function(srcData) {
    console.log(srcData[1].length);
    for (var j = 0; j < srcData[1].length; j++) {
        var url = srcData[1][j];
        var n = 0;
        http.get(url, function(res) {
            var imgData = "";
            res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开


            res.on("data", function(chunk) {
                imgData += chunk;
            });

            res.on("end", function() {
                var path = "/home/pp/node_pic/pic/" + n + ".jpg"
                n++;
                fs.writeFile(path, imgData, "binary", function(err) {
                    if (err) {
                        console.log("down fail");
                    }
                    console.log("down success");
                });
            });
        });
    }
})


for (var i = 1000; i < 1100; i++) {
    var targetUrl = 'http://www.aitaotu.com/guonei/' + i + '.html';
    superagent.get(targetUrl)
        .end(function(err, res) {
            var $ = cheerio.load(res.text);
            //通过CSS selector来筛选数据
            $('#big-pic img').each(function(idx, element) {
                //srcData.push(element.attr())
                var $element = $(element);
                //console.log($element.attr('src'));
                srcData.push($element.attr('src'));
                //console.log('srcData' + srcData);

            });
            ep.emit('src', srcData);
        })
}

