const http = require('http')
const https = require('https')

const url = 'https://time.com'

const server = http.createServer((req, res) => {
  const resp = []
  resp['not-found']='<h1>404 - Route Not Found!</h1>'

  const links = []

  try {
    let body = "";

    https.get(url, response => {
      response.setEncoding("utf8");
      response.on('data', data => {
        body += data;
      });
      response.on('end', () => {
        const mySubString = body.substring(
          body.lastIndexOf('class="homepage-module latest'),
          body.lastIndexOf('class="homepage-module voices"')
        )

        const newString = mySubString.substring(
          mySubString.lastIndexOf('class="homepage-module latest"'),
          mySubString.lastIndexOf('</section>')
        )

        const tagsAnchor = newString.match(/<\s*a[^>]>(.?)<\s*\/\s*a>/g)

        tagsAnchor.forEach(element => {
          let title = ''
          let link = ''
          
          title = element.substring(
            element.lastIndexOf('/>'),
            element.lastIndexOf('a>')
          ).replace('/>', '').replace('</', '')

          link = element.substring(
            element.lastIndexOf('href='),
            element.lastIndexOf('/>')
          ).replace('href=', url)

          links.push({ title, link })
        });

        resp['/getTimeStories']=JSON.stringify(links)
        res.end(resp[req.url] || resp['not-found'])
      });
    })
  } catch (error) {
    console.log(error)
    res.end(resp['not-found'])
  }
})

const PORT = process.env.PORT || 3001

server.listen(PORT, 'localhost', () => {
  console.log(`Online Server: http://localhost:${PORT}`)
  console.log('To shut down the server: Ctrl + c')
})