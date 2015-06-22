var express = require('express');
var url = require('url'); //解析操作url
var superagent = require('superagent'); //这三个外部依赖不要忘记npm install
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');
//var fs = require('fs');
var express = require('express');
var app = express();
var targetUrl = 'http://www.aitaotu.com/tag/xiurenwang.html';
var htmlData = [];
var srcData = [];
var html = '';


var ep = new eventproxy();
ep.all('url', function(htmlData) {
    //console.log(htmlData);
    for (var i = 0; i < htmlData.length; i++) {
        htmlData[i] = 'http://www.aitaotu.com' + htmlData[i]
        superagent.get(htmlData[i])
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
            });
    }
});

ep.after('src', 20, function(srcData) {
    for (var j = 0; j < srcData[1].length; j++) {
        html += '<img src="' + srcData[1][j] + '">';
    }
})

superagent.get(targetUrl)
    .end(function(err, res) {
        var $ = cheerio.load(res.text);
        //通过CSS selector来筛选数据
        $('.img a').each(function(idx, element) {
            //srcData.push(element.attr())
            var $element = $(element);
            htmlData.push($element.attr('href'));
        });
        //console.log("hello");
        ep.emit('url', htmlData)
    })



/*superagent.get(targetUrl)
    .end(function(err, res) {
        var $ = cheerio.load(res.text);
        //通过CSS selector来筛选数据
        $('.img a').each(function(idx, element) {
            //srcData.push(element.attr())
            var $element = $(element);
            htmlData.push($element.attr('href'));
        });
        for (var i = 0; i < htmlData.length; i++) {
            htmlData[i] = 'http://www.aitaotu.com' + htmlData[i]
            superagent.get(htmlData[i])
                .end(function(err, res) {
                    var $ = cheerio.load(res.text);
                    //通过CSS selector来筛选数据
                    $('#big-pic img').each(function(idx, element) {
                        //srcData.push(element.attr())
                        var $element = $(element);
                        //console.log($element.attr('src'));
                        srcData.push($element.attr('src'));
                        console.log('srcData' + srcData);
                        if (i >= htmlData.length) {
                            console.log(i);
                            for (var j = 0; j < srcData.length; j++) {
                                html += '<img src="' + srcData[j] + '">';
                            }
                        };
                    });
                });
        }


        //console.log(srcData.length)

        //console.log('htmlData'  + htmlData);
    });*/
app.get('/', function(req, res, next) {
    res.send(html);
});


app.listen(3000, function() {
    console.log('app is listening at port 3000');
});
