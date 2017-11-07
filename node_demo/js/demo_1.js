var http = require('http')

http.createServer(function(request,response){
	//发送http 头部
	// http 状态 200
	//内容类型：text/plain
	response.writeHead(200,{'Content-Type':'text/plain'})

	//发送响应数据 "Hello World"
	response.end('Hello World\n')


}).listen(8888);

console.log('Server running at http:127.0.0.1:8888/')