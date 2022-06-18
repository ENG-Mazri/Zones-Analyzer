const NodeCouchDb = require('node-couchdb')
const uuid = require('uuid')

// const roomSchema = {
//     id: id,
//     number: int,
//     name: string,
//     area: int,
//     occupancy: int,
//     flatId: id
// }
const dbName = "database";
const viewUrl = "_design/rooms/_view/view";


const couch = new NodeCouchDb({
    auth:{user:"m24", pass: "coPyhhh12c"}
})

const createDB = (name)=>{
    couch.createDatabase(name)
        .then(()=>console.log('db created'))
        .catch(err=>console.log("ERROR: ", err.message))
}

const insertDB = (db,data)=>{
    couch.insert(db,{_id:uuid.v4(), fields:[data]})
        .then(({data,headers, status})=>{
            console.log(status, "Data inserted successfully")
        })
        .catch(err=>console.log("ERROR: ", err.message))
    
}

const getDB = async (db,id)=>{
    const res = await couch.get(db, view)
    const resJson = await res.data.fields[0]
    const lst = []
    lst.push(resJson)
    console.log(lst)
    return lst
}
module.exports = {insertDB, getDB, couch}