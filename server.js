const express = require('express');
// const express = data.json();

const data = express();

data.use(express.json())


const port = process.env.PORT || 5000

data.listen(port,()=>{
    console.log(`http:localhost:${port}`)
})
const value = require('./json/MOCK_DATA.json')
data.get('/',(req,res)=>{
    res.send(value)
})

data.post('/firsttry/:id',(req,res)=>{

    const {id} = req.params;
    const {name} = req.body;

    res.send({
        'newname':`'name`,
        'id':`${id}`
    })

})

data.get('/firsttry',(req,res)=>{
    console.log(res);
    res.status(200).send({
        "status":"ok",
        "name":"vskrishnan"
    })
})

data.post('/firsttry/:id',(req,res)=>{

        const {id} = req.params;
        const {name} = req.body;

        res.send({
            'newname':'krishnan',
            'id':`${id}`
        })

})

// data.