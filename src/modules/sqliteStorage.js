import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { rm_file } from 'files-js'


class sqliteStorage {

    async open({name, path}){
        // this function opens the storage
        this.file = path + '/' + name + '.sqlite'
        this.db = await open({
            filename: this.file,
            driver: sqlite3.Database
        })
        try { // create colums
            await this.db.exec('CREATE TABLE storage ( key TEXT PRIMARY KEY, value TEXT, type TEXT)')
        } catch (e) {
            if (e.code !== 'SQLITE_ERROR')  throw e
        }
    }

    async set(key, value){
        let [ valueStr, type ] = this._parseValue(value);
        // if we have a value with the same key, we update it
        let result;
        try{
            result = await this.db.get(`SELECT value FROM storage WHERE key = '${key}'`)
        } catch(e){
            if (e.code !== 'SQLITE_ERROR')  throw e
            else result = undefined
        }
        if(result){
            await this.db.exec(`UPDATE storage SET value = '${valueStr}', type = '${type}' WHERE key = '${key}'`)
        }else{
            //console.log(`INSERT INTO storage (key, value, type) VALUES ( '${key}', '${valueStr}', '${type}')`)
            await this.db.exec(`INSERT INTO storage (key, value, type) VALUES ( '${key}', '${valueStr}', '${type}')`)
        }
    }

    async get(key) {
        // this function retrives a value with a key
        let result;
        try{
            result = await this.db.get(`SELECT value, type FROM storage WHERE key = '${key}'`)
        } catch(e) {
            if (e.code !== 'SQLITE_ERROR')  throw e
            else result = undefined
        }
        if(!result) return undefined
        if(result.value === 'undefined') return undefined
        return this._parseString(result.value, result.type)
    }

    async getAll() {
        // this function returns all the values in the storage
        const results = await this.db.all(`SELECT value, type FROM storage`)
        if(!results) return undefined
        let values = results.map(result => this._parseString(result.value, result.type))
        return values
    }

    async remove(key) {
        // this function removes a value with a key
        let result;
        try{
            result = await this.db.get(`SELECT value FROM storage WHERE key = '${key}'`)
        } catch(e){
            if (e.code !== 'SQLITE_ERROR') throw e
            else result = undefined
        }
        if(!result) return undefined
        await this.db.exec(`DELETE FROM storage WHERE key = '${key}'`)
    }

    async delete() {
        // this function deletes the entire storage
        await this.db.exec(`DELETE FROM storage`)
        // remove the file
        rm_file(this.file)
    }

    _parseValue(value){
            // convert any type to string and save the type
        if(typeof value === 'object'){
            return [ JSON.stringify(value), 'object' ]
        } else if(typeof value === 'string'){
            return [ value, 'string' ]
        } else if(typeof value === 'number'){
            return [ value.toString(), 'number' ]
        } else if(typeof value === 'function'){
            return [ value.toString(), 'function' ]
        } else if(typeof value === 'boolean'){
            return [ value.toString(), 'boolean' ]
        } else if(typeof value === 'undefined'){
            return [ 'undefined', 'undefined' ]
        } else throw new Error('Invalid value type')
    }

    _parseString(value, type){
        // convert back any string into the original type
        if(type === 'object'){
            return JSON.parse(value)
        } else if(type === 'string'){
            return value
        } else if(type === 'number'){
            return Number(value)
        } else if(type === 'function'){
            return eval(value)
        } else if(type === 'boolean'){
            return Boolean(value)
        } else if(type === 'undefined'){
            return undefined
        }
    }
}

export default sqliteStorage
