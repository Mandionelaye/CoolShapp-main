const mongoos = require('mongoose');
require('dotenv').config();

class BD{
    constructor() {
        return this.connection();
    }

    connection(){
        mongoos.connect(process.env.MONGO_URI)
        .then(()=>{
            console.log('connection etablie');
        })
        .catch((err)=>console.error(err))
    }
}

module.exports = new BD();