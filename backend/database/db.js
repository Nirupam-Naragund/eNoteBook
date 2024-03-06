import {connect } from 'mongoose'

const connectToMongo= async ()=>{
      try {
        await connect(`mongodb+srv://nirupam:nirupam12345@mernenote.qkfvi2t.mongodb.net/eNotebook`)
      } catch (error) {
        console.log(error);
      }
}

export default connectToMongo;