const express = require('express')
const {graphqlHTTP} = require('express-graphql')
const schema = require('./schema/schema')
const cors =require('cors')
const {couch} = require('./models/rooms')
const nano = require('nano')('http://localhost:5984/_utils/#database/database/_all_docs');


const app = express()
app.use(cors())

const dbName = "database";
const view = "_design/all_rooms/_view/all?include_docs=true";
const id = "10fb5f0a-80fd-4983-afa3-40a6149c149f" 

// const data = getDB(dbName,id)
// console.log('data', data)

//NANO
// const db = nano.use('database')
// const x = async ()=>{
//     const res = await nano.db.get('database')
    
//     return res
// }

// console.log(nano)

// const getDB = async (db,view)=>{
//     const res = await couch.get(db,view)
//     const {data,headers, status} = await res
//     const list = [] 
//     data.rows.forEach(e => {
//         list.push(e.doc.fields[0])
//     });
//     console.log(list)
//     return data

// }
// getDB("rooms", view)



app.use('/graphql', graphqlHTTP({
    schema
}))

app.listen(4000, ()=>console.log("I'm listening to you on port 4000"))