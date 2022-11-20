const express = require('express');
const app = express();

app.use('/fonts', express.static('docs/fonts'))
app.use('/scripts', express.static('docs/scripts'))
app.use('/styles', express.static('docs/styles'))

app.use((req, res, next) => {
  let title = ''
  let url = ''
  let description = ''
  let site_name = ''
  let image = ''
  let color = ''
  res.metaTags = function(data = { title: '', url: '', description: '', site_name: '', image: '',  color: '', keywords: [] }) {    
    [title, url, description, site_name, image, color] = [data.title || '', data.url || '', (data.description || '').split('\n').join('%0A') || '', data.site_name || '', data.image || '', data.color || '']

    //keywords = data.keywords.join(',')
  }

  res.send = function(data) {
    return express.response.send.call(res, `<meta property="title" content="${title}">
<meta property="url" content="${url}">
<meta property="description" content="${description}">
<meta property="site_name" content="${site_name}"/>
<meta property="og:site_name" content="${site_name}"/>
<meta property="og:title" content="${title}" />
<meta property="og:type" content="image" />
<meta property="og:url" content="${url}" />
<meta name="og:image" content="${image}" />
<meta property="og:description" content="${description}" />
<meta name="theme-color" content="${color}">${data}`)
  }

  res.sendFile = function(data, opts) {
    return res.send(`${require('fs').readFileSync(opts.root + '/' + data)}`)
  } 
  next()
})

app.use((req, res, next) => {
  res.metaTags({
    title: "infrpg.js",
    url: "https://infrpg.js.org/",
    description: "A library to interact with https://rpg.dart.gay/",
    site_name: "infrpg.js.org",
    color: "#cb4afa",
    keywords: ["rpg", "js", "infrpg", "rpg.dart.gay", "infrpg.js"]
  })
  next()
})

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './docs' })
})

app.get('/:path', (req, res) => {
  res.sendFile(req.params.path, { root: './docs' })
})

app.listen(443, () => {
  console.log('Built docs and served on port 443')
})