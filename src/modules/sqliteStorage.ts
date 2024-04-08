import Storage from './types/Storage'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
//@ts-ignore // this is a custom module
import { rm_file } from 'files-js'


class sqliteStorage extends Storage {
    // this class is a storage class that uses sqlite3 to store data
    file: string | undefined
    db: any

    constructor(){
        super()
        this.file = undefined
        this.db = undefined
    }

    async open({name, path} : {name: string, path: string}) : Promise<void> {
        // this function opens the storage
        this.file = path + '/' + name + '.sqlite'
        this.db = await open({
            filename: this.file,
            driver: sqlite3.Database
        })
        try { // create colums
            await this.db.exec('CREATE TABLE storage ( key TEXT PRIMARY KEY, value TEXT, type TEXT)')
        } catch (e : any) {
            if (e.code !== 'SQLITE_ERROR')  throw e
        }
    }

    async set(key: string, value: any) : Promise<void> {
        let [ valueStr, type ] = this._parseValue(value);
        // if we have a value with the same key, we update it
        let result;
        try{
            result = await this.db.get(`SELECT value FROM storage WHERE key = '${key}'`)
        } catch(e : any) {
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

    async get(key : string) : Promise<any> {
        // this function retrives a value with a key
        let result;
        try{
            result = await this.db.get(`SELECT value, type FROM storage WHERE key = '${key}'`)
        } catch(e : any) {
            if (e.code !== 'SQLITE_ERROR')  throw e
            else result = undefined
        }
        if(!result) return undefined
        if(result.value === 'undefined') return undefined
        return this._parseString(result.value, result.type)
    }

    async getAll() : Promise<any[]> {
        // this function returns all the values in the storage
        const results = await this.db.all(`SELECT key, value, type FROM storage`)
        if(results.length === 0) return []
        // convert the values to the original type
        let values = results.map((result : any) => ({ 
            key: result.key,
            value: this._parseString(result.value, result.type) 
        }));
        return values
    }

    async remove(key: string) : Promise<void> {
        // this function removes a value with a key
        let result;
        try{
            result = await this.db.get(`SELECT value FROM storage WHERE key = '${key}'`)
        } catch(e: any) {
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

    _parseValue(value: any){
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

    _parseString(value: string, type: string){
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
