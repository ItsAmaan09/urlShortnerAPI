const express = require('express');
const bodyParser = require('body-parser');
const dns = require('dns');
const urlParser = require('url');

const app = express();
const port = 3001;


const storedurl = {};
let idCounter = 1;

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());


app.post('/api/shorturl',(req,res)=>{
    const originalUrl = req.body.url;
    const parsedUrl = urlParser.parse(originalUrl);

    if(!parsedUrl.protocol || !parsedUrl.hostname){
        return res.json({error:'invalid url'})
    }

    dns.lookup(parsedUrl.hostname,(err,address)=>{
        if(err){
            return res.json({error:'invalid url'})
        }
        const shorturl = idCounter++;
        storedurl[shorturl] = originalUrl;

        res.json({original_url:originalUrl,short_url:shorturl});
    });
});


app.get('/api/shorturl/:shortUrl',(req,res)=>{
    const shortUrl = parseInt(req.params.shortUrl,10);
    const originalUrl = storedurl[shortUrl];
    if(originalUrl){
        res.redirect(originalUrl);
    } else{
        res.json({error:"No short URL found for the given input"})
    }
});


app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})