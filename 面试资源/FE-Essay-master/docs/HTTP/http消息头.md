# HTTP 消息头  
- Connection  
  1. close：在完成本次请求的响应后，断开连接，不再等待本次连接的后续请求  
  2. keep-alive：在完成本次请求的响应后，保持连接，等待本次连接的后续请求  

- Keep-Alive：如果浏览器请求保持连接，该头部表明希望服务器保持连接多久的时间(秒)  

- 缓存相关  
  1. 强缓存相关：Expire、Cache-Controll  
  2. 协商缓存相关：Last-Modify、If-Modify-Since、Etag、If-None-Match  

- Content-Type  
  1. application/json  
  2. application/x-www-form-urlencoded  
  3. multipart/form-data  
  4. text/html  
  5. octect/stream  

- Content-Length：服务器告诉浏览器自己响应数据的长度  

- Transfer-Encoding：服务器表明自己的响应消息体做了怎样的编码。比如是否分块  