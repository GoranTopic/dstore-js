var t=(i,e,r)=>new Promise((n,s)=>{var a=h=>{try{l(r.next(h))}catch(c){s(c)}},o=h=>{try{l(r.throw(h))}catch(c){s(c)}},l=h=>h.done?n(h.value):Promise.resolve(h.value).then(a,o);l((r=r.apply(i,e)).next())});import q from"fs";import ae from"path";import W from"path";var J=i=>{let e=W.parse(i);if(e.name===i)throw new Error(`${i} path could not be parsed`);return e},O=J;import{Mutex as oe}from"async-mutex";var f=class{open(n){return t(this,arguments,function*({name:e,path:r}){throw new Error("Method not implemented.")})}set(e,r){return t(this,null,function*(){throw new Error("Method not implemented.")})}get(e){return t(this,null,function*(){throw new Error("Method not implemented.")})}getAll(){return t(this,null,function*(){throw new Error("Method not implemented.")})}remove(e){return t(this,null,function*(){throw new Error("Method not implemented.")})}close(){return t(this,null,function*(){throw new Error("Method not implemented.")})}delete(){return t(this,null,function*(){throw new Error("Method not implemented.")})}},u=f;var m=class extends u{open(n){return t(this,arguments,function*({name:e,path:r}){})}set(e,r){return t(this,null,function*(){})}get(e){return t(this,null,function*(){})}getAll(){return t(this,null,function*(){})}remove(e){return t(this,null,function*(){})}delete(){return t(this,null,function*(){})}},p=m;var y=class{open(n){return t(this,arguments,function*({name:e,path:r}){})}set(e,r){return t(this,null,function*(){})}get(e){return t(this,null,function*(){})}getAll(){return t(this,null,function*(){})}remove(e){return t(this,null,function*(){})}delete(){return t(this,null,function*(){})}},g=y;import N from"path";import{write_json as w,read_json as C,delete_json as H}from"files-js";var b=class extends u{constructor(){super(),this.json={},this.path=""}open(n){return t(this,arguments,function*({name:e,path:r}){this.path=N.join(r,`${e}.json`),this.json={},C(this.path)?this.json=C(this.path):w(this.json,this.path,{format:!0})})}set(e,r){return t(this,null,function*(){this.json[e]=r,w(this.json,this.path,{format:!0})})}get(e){return t(this,null,function*(){return this.json[e]})}getAll(){return t(this,null,function*(){let e=[];return this.json&&(e=Object.keys(this.json).map(r=>({key:r,value:this.json[r]}))),e})}remove(e){return t(this,null,function*(){delete this.json[e],w(this.json,this.path,{format:!0})})}close(){return t(this,null,function*(){this.json={},this.path=""})}delete(){return t(this,null,function*(){this.json={},H(this.path)})}},v=b;import d from"path";import{write_json as G,read_json as I,delete_json as $,mkdir as Q,ls_files as L,rm_dir as U}from"files-js";var E=class extends u{constructor(){super(),this.path=""}open(n){return t(this,arguments,function*({name:e,path:r}){r=d.join(r,e),Q(r),this.path=r})}set(e,r){return t(this,null,function*(){if(typeof e=="number"&&(e=this._convet_to_string_int(e)),typeof r!="object")throw new Error("value must be a js object");return G(r,d.join(this.path,e+".json"),{format:!0})})}get(e){return t(this,null,function*(){return typeof e=="number"&&(e=this._convet_to_string_int(e)),I(d.join(this.path,e+".json"))})}getAll(){return t(this,null,function*(){let e=L(this.path),r=[];for(let n of e)r.push({key:d.basename(n,".json"),value:I(d.join(this.path,n))});return r})}remove(e){return t(this,null,function*(){return typeof e=="number"&&(e=this._convet_to_string_int(e)),$(d.join(this.path,e+".json"))})}close(){return t(this,null,function*(){this.path=""})}delete(){return t(this,null,function*(){let e=L(this.path);for(let r=0;r<e.length;r++)$(e[0]);U(this.path)})}_convet_to_string_int(e){let r=10,n=e.toString(),s=n.length;return"0".repeat(r-s)+n}},P=E;import X from"sqlite3";import{open as Y}from"sqlite";import{rm_file as z}from"files-js";var S=class extends u{constructor(){super(),this.file=void 0,this.db=void 0}open(r){return t(this,arguments,function*({name:i,path:e}){this.file=e+"/"+i+".sqlite",this.db=yield Y({filename:this.file,driver:X.Database});try{yield this.db.exec("CREATE TABLE storage ( key TEXT PRIMARY KEY, value TEXT, type TEXT)")}catch(n){if(n.code!=="SQLITE_ERROR")throw n}})}set(i,e){return t(this,null,function*(){let[r,n]=this._parseValue(e),s;try{s=yield this.db.get(`SELECT value FROM storage WHERE key = '${i}'`)}catch(a){if(a.code!=="SQLITE_ERROR")throw a;s=void 0}s?yield this.db.exec(`UPDATE storage SET value = '${r}', type = '${n}' WHERE key = '${i}'`):yield this.db.exec(`INSERT INTO storage (key, value, type) VALUES ( '${i}', '${r}', '${n}')`)})}get(i){return t(this,null,function*(){let e;try{e=yield this.db.get(`SELECT value, type FROM storage WHERE key = '${i}'`)}catch(r){if(r.code!=="SQLITE_ERROR")throw r;e=void 0}if(e&&e.value!=="undefined")return this._parseString(e.value,e.type)})}getAll(){return t(this,null,function*(){let i=yield this.db.all("SELECT key, value, type FROM storage");return i.length===0?[]:i.map(r=>({key:r.key,value:this._parseString(r.value,r.type)}))})}remove(i){return t(this,null,function*(){let e;try{e=yield this.db.get(`SELECT value FROM storage WHERE key = '${i}'`)}catch(r){if(r.code!=="SQLITE_ERROR")throw r;e=void 0}e&&(yield this.db.exec(`DELETE FROM storage WHERE key = '${i}'`))})}close(){return t(this,null,function*(){this.file=void 0,yield this.db.close()})}delete(){return t(this,null,function*(){yield this.db.exec("DELETE FROM storage"),z(this.file)})}_parseValue(i){if(typeof i=="object")return[JSON.stringify(i),"object"];if(typeof i=="string")return[i,"string"];if(typeof i=="number")return[i.toString(),"number"];if(typeof i=="function")return[i.toString(),"function"];if(typeof i=="boolean")return[i.toString(),"boolean"];if(typeof i=="undefined")return["undefined","undefined"];throw new Error("Invalid value type")}_parseString(value,type){if(type==="object")return JSON.parse(value);if(type==="string")return value;if(type==="number")return Number(value);if(type==="function")return eval(value);if(type==="boolean")return!!value;if(type==="undefined")return}},k=S;import{MongoClient as K}from"mongodb";var x=class extends u{constructor({url:e,database:r}){super(),this.url=e,this.client=new K(e),this.database=r,this.collection=void 0}open(r){return t(this,arguments,function*({name:e}){this.collection=e,yield this.client.connect(),this.database=this.client.db(this.database),this.collection=this.database.collection(this.collection)})}set(e,r){return t(this,null,function*(){return yield this.collection.insertOne(r)})}get(e){return t(this,null,function*(){return yield this.collection.find(e).toArray()})}getAll(){return t(this,null,function*(){return yield this.collection.find({}).toArray()})}remove(e){return t(this,null,function*(){return yield this.collection.deleteMany(e)})}close(){return t(this,null,function*(){return yield this.client.close()})}delete(){return t(this,null,function*(){return yield this.collection.drop(),yield this.client.close()})}},_=x;import{MongoClient as re,GridFSBucket as ie}from"mongodb";import{Readable as ne}from"stream";import j from"fs";function Z(i){if(!j.existsSync(i))throw new Error("File not found");if(j.lstatSync(i).isDirectory())throw new Error("Path is a directory");return j.createReadStream(i)}var R=Z;import{Readable as ee}from"stream";function te(i){return new ee({read(){this.push(i),this.push(null)}})}var T=te;import se from"stream-to-array";var M=class extends u{constructor({url:e,database:r}){super(),this.url=e,this.client=new re(e),this.database=r,this.bucket=void 0,this.filesCollection="files",this.chunksCollection="chunks"}open(r){return t(this,arguments,function*({name:e}){let n=e!=null?e:"files";this.filesCollection=n+".files",this.chunksCollection=n+".chunks",yield this.client.connect(),this.database=this.client.db(this.database),this.bucket=new ie(this.database,{bucketName:n})})}set(e,r){return t(this,null,function*(){if(!r.filename)throw new Error("filename is required in metadata");if(this.bucket===void 0)throw new Error("Bucket is not defined, call open() first");return new Promise((n,s)=>{let a=r.filename,o=this._handleFileInput(e),l=this.bucket.openUploadStream(a,r);l.on("finish",()=>n(!0)),l.on("error",h=>s(h)),o.pipe(l,{end:!0})})})}get(e){return t(this,null,function*(){if(!e.filename)throw new Error("Filename is required in metadata");if(this.bucket===void 0)throw new Error("Bucket is not defined, call open() first");let r=yield this.bucket.find(e).toArray();return r.length===0?[]:yield Promise.all(r.map(n=>this._get(n)))})}_get(e){return t(this,null,function*(){return yield new Promise((r,n)=>t(this,null,function*(){let s=e._id,a=this.bucket.openDownloadStream(s);a.on("error",l=>n(l));let o=yield se(a).then(function(l){let h=l.map(c=>c instanceof Buffer?c:Buffer.from(c));return Buffer.concat(h)});delete e._id,delete e.length,delete e.chunkSize,r({buffer:o,metadata:e})}))})}getAll(){return t(this,null,function*(){if(this.bucket===void 0)throw new Error("Bucket is not defined, call open() first");return(yield this.bucket.find().toArray()).map(r=>r.filename)})}remove(e){return t(this,null,function*(){if(!e.filename)throw new Error("filename is required in metadata");if(this.bucket===void 0)throw new Error("Bucket is not defined, call open() first");let r=yield this.bucket.find(e).toArray();return!(r.length===0||(yield Promise.all(r.map(s=>this._remove(s)))).includes(!1))})}_remove(e){return t(this,null,function*(){let r=e._id;return yield this.bucket.delete(r),!0})}close(){return t(this,null,function*(){if(this.bucket===void 0)throw new Error("Bucket is not defined, call open() first");this.bucket=void 0,yield this.client.close()})}delete(){return t(this,null,function*(){if(this.bucket===void 0)throw new Error("Bucket is not defined, call open() first");yield this.bucket.drop(),yield this.client.close()})}_handleFileInput(e){if(e instanceof Buffer)return T(e);if(typeof e=="string")return R(e);if(e instanceof ne)return e;throw new Error("Invalid input, expected a Buffer,  ReadableStream, or path to a file.")}},D=M;var A=D;var B=class{constructor({type:e,path:r,keyValue:n,mutex:s,url:a,database:o}){this.type=e,this.path=r,this.keyValue=n!=null?n:!1,this.mutex=s!=null?s:!0,this.url=a!=null?a:"",this.database=o!=null?o:""}open(e){return t(this,null,function*(){let r=new F({type:this.type,path:this.path,keyValue:this.keyValue,mutex:this.mutex,url:this.url,database:this.database});return yield r.open(e),r})}},F=class{constructor({type:e,path:r,keyValue:n,mutex:s,url:a,database:o}){this.add=this.set;this.push=this.set;this.write=this.set;this.read=this.get;this.all=this.getAll;this.list=this.getAll;if(r){let{dir:l,name:h}=O(r);if(h==="file")throw new Error("path must be a directory");this.path=l}else this.path=ae.join(process.cwd(),"storage");if(q.existsSync(this.path)||q.mkdirSync(this.path),this.keyValue=n!=null?n:!1,this.mutex=s===!1?null:new oe,e==="json")this.storage=new P;else if(e==="jsonFile")this.storage=new v;else if(e==="cvs")this.storage=new g;else if(e==="sqlite")this.storage=new k;else if(e==="binary")this.storage=new p;else if(e==="mongodb"){if(!a||!o)throw new Error("url and database must be defined");this.mutex=null,this.keyValue=!1,this.storage=new _({url:a,database:o})}else if(e==="mongoFiles"){if(!a||!o)throw new Error("url and database must be defined");this.mutex=null,this.keyValue=!0,this.storage=new A({url:a,database:o})}else throw new Error(`type ${e} is not supported`);this.index=this.keyValue?-1:0}open(e){return t(this,null,function*(){yield this.storage.open({name:e,path:this.path})})}set(e,r){return t(this,null,function*(){let{key:n,value:s}=this._handleInputs(e,r);return yield this._mutex(()=>t(this,null,function*(){return yield this.storage.set(n,s)}))})}get(e){return t(this,null,function*(){return yield this._mutex(()=>t(this,null,function*(){return yield this.storage.get(e)}))})}getAll(){return t(this,null,function*(){return yield this._mutex(()=>t(this,null,function*(){return yield this.storage.getAll()}))})}has(e){return t(this,null,function*(){return yield this._mutex(()=>t(this,null,function*(){return!!(yield yield this.storage.get(e))}))})}remove(e){return t(this,null,function*(){return yield this._mutex(()=>t(this,null,function*(){return yield this.storage.remove(e)}))})}close(){return t(this,null,function*(){return yield this._mutex(()=>t(this,null,function*(){return yield this.storage.close()}))})}delete(){return t(this,null,function*(){return yield this._mutex(()=>t(this,null,function*(){return yield this.storage.delete()}))})}_handleInputs(e,r){let n,s;return this.keyValue?(n=e,s=r):(n=++this.index,s=e),{key:n,value:s}}_mutex(e){return this.mutex?this.mutex.runExclusive(e):e()}},V=B;var vt=V;export{vt as default};
