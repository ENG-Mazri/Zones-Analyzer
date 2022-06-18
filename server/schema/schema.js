const graphql = require('graphql')
const _ = require('lodash')
const {insertDB, getDB, couch} = require('../models/rooms')
const NodeCouchDb = require('node-couchdb')
const {GraphQLString,GraphQLObjectType,GraphQLSchema, GraphQLInt, GraphQLID, GraphQLList} = graphql
const roomsView = "_design/all_rooms/_view/all?include_docs=true";
const flatsView = "_design/all_flats/_view/all?include_docs=true"
// DATA

// const rooms = [
//     {name:'bedroom 1', number:1, area:24, id:"1", flatId: "1"},
//     {name:'bedroom 2', number:2, area:18, id:"2", flatId: "4"},
//     {name:'kitchen', number:3, area:20, id:"3", flatId: "3"},
//     {name:'bathroom', number:4, area:10, id:"4", flatId: "2"},
//     {name:'bedroom 1', number:1, area:24, id:"1", flatId: "2"},
//     {name:'bedroom 2', number:2, area:18, id:"2", flatId: "3"},
//     {name:'kitchen', number:3, area:20, id:"3", flatId: "4"},
//     {name:'bathroom', number:4, area:10, id:"4", flatId: "4"}
// ]
// const flats = [
//     {number:101, area:50, id:"1"},
//     {number:102, area:65, id:"2"},
//     {number:103, area:50, id:"3"},
//     {number:104, area:65, id:"4"}
// ]


// OBJECT TYPES

const RoomType = new GraphQLObjectType({
    name: "Room",
    fields: ()=>({
        id:{type: GraphQLID},
        name:{type: GraphQLString},
        number:{type: GraphQLInt},
        area:{type: GraphQLInt},
        flatNumber:{type: GraphQLInt},
        flat:{
            type: FlatType,
            async resolve(parent,args){
                const res = await couch.get("flats",flatsView)
                const {data,headers, status} = await res
                const flats = [] 
                data.rows.forEach(e => {
                    flats.push(e.doc.fields[0])
                });
                return _.find(flats, {number: parent.flatNumber})
            }

        }
    })
})

const FlatType = new GraphQLObjectType({
    name: "flat",
    fields: ()=>({
        id:{type: GraphQLID},
        number:{type: GraphQLInt},
        area:{type: GraphQLInt}, 
        rooms:{
            type: new GraphQLList(RoomType),
            async resolve(parent,args){
                const res = await couch.get("rooms",roomsView)
                const {data,headers, status} = await res
                const rooms = [] 
                data.rows.forEach(e => {
                    rooms.push(e.doc.fields[0])
                });
                return _.filter(rooms, {flatNumber: parent.number})
            }
        }   
    })
})

// ROOT QUERY

const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        room:{
            type: RoomType,
            args:{id:{type: GraphQLID}},
            async resolve(parent,args){
                const _id= args.id
                const res = await couch.get("rooms",_id )
                const {data,headers, status} = res
                return data.fields[0]
            }
        },
        flat:{
            type: FlatType,
            args:{id:{type: GraphQLID}},
            async resolve(parent,args){
                const _id= args.id
                const res = await couch.get("flats",_id )
                const {data,headers, status} = res
                return data.fields[0]
            }
        },
        rooms:{
            type: new GraphQLList(RoomType),
            async resolve(parent,args){
                const res = await couch.get("rooms",roomsView)
                const {data,headers, status} = await res
                const rooms = [] 
                data.rows.forEach(e => {
                    rooms.push(e.doc.fields[0])
                });
                return rooms
            }
        },
        flats:{
            type: new GraphQLList(FlatType),
            async resolve(parent,args){
                const res = await couch.get("flats",flatsView)
                const {data,headers, status} = await res
                const flats = [] 
                data.rows.forEach(e => {
                    flats.push(e.doc.fields[0])
                });
                return flats
            }
        }
    }
})

// MUTATION
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields:{
        addRoom:{
            type: RoomType,
            args:{
                name: {type: GraphQLString},
                number: {type: GraphQLInt},
                area: {type: GraphQLInt},
                flatNumber: {type: GraphQLInt},
            },
            resolve(parent,args){
                let room = {name: args.name, number: args.number, area: args.area, flatNumber:args.flatNumber}
                insertDB("rooms", room)
                return room
            }
        },
        addFlat:{
            type: FlatType,
            args:{
                number: {type: GraphQLInt},
                area: {type: GraphQLInt}
            },
            resolve(parent,args){
                let flat = {number: args.number, area: args.area}
                insertDB("flats",flat)
                return flat
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})