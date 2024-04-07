"use strict";var se=Object.create;var p=Object.defineProperty;var ie=Object.getOwnPropertyDescriptor;var ne=Object.getOwnPropertyNames;var oe=Object.getPrototypeOf,ae=Object.prototype.hasOwnProperty;var f=(t,e)=>()=>(t&&(e=t(t=0)),e);var J=(t,e)=>{for(var r in e)p(t,r,{get:e[r],enumerable:!0})},N=(t,e,r,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of ne(e))!ae.call(t,n)&&n!==r&&p(t,n,{get:()=>e[n],enumerable:!(i=ie(e,n))||i.enumerable});return t};var u=(t,e,r)=>(r=t!=null?se(oe(t)):{},N(e||!t||!t.__esModule?p(r,"default",{value:t,enumerable:!0}):r,t)),g=t=>N(p({},"__esModule",{value:!0}),t);var s=(t,e,r)=>new Promise((i,n)=>{var o=c=>{try{y(r.next(c))}catch(_){n(_)}},a=c=>{try{y(r.throw(c))}catch(_){n(_)}},y=c=>c.done?i(c.value):Promise.resolve(c.value).then(o,a);y((r=r.apply(t,e)).next())});var w,he,ce,ue,D=f(()=>{"use strict";w=u(require("fs"),1),he=(t,e,r={})=>{var o;let{format:i}=r,n=(o=r.quiet)!=null?o:!0;try{let a=JSON.stringify(t,null,i?4:1);return w.default.writeFileSync(e,a),!0}catch(a){if(n)return!1;throw a}},ce=(t,e={})=>{var i;let r=(i=e.quiet)!=null?i:!0;try{let n=w.default.readFileSync(t);return JSON.parse(n)}catch(n){if(r)return!1;throw n}},ue=(t,e={})=>{var i;let r=(i=e.quiet)!=null?i:!0;try{return w.default.unlinkSync(t)}catch(n){if(r)return!1;throw n}}});var d,me,ye,de,pe,H=f(()=>{"use strict";d=u(require("fs"),1),me=t=>d.default.readFileSync(t),ye=t=>d.default.readFileSync(t).toString("binary"),de=(t,e)=>{d.default.writeFileSync(e,t)},pe=(t,e)=>{let r=Buffer.from(t,"binary");d.default.writeFileSync(e,r)}});var l,fe,ge,we,ve,be,_e,Ee,Se,xe,je,Pe,W=f(()=>{"use strict";l=u(require("fs"),1),fe=t=>{try{return l.default.existsSync(t)}catch(e){return console.error("could not find file "+e),!1}},ge=t=>!l.default.existsSync(t),we=t=>l.default.readdirSync(t,{withFileTypes:!0}).map(e=>e.name),ve=t=>l.default.readdirSync(t,{withFileTypes:!0}).filter(e=>e.isDirectory()).map(e=>e.name),be=t=>l.default.readdirSync(t,{withFileTypes:!0}).filter(e=>e.isFile()).map(e=>e.name),_e=t=>l.default.mkdir(t,{recursive:!0},e=>{e&&console.error(e)}),Ee=(t,e="")=>l.default.writeFileSync(t,e),Se=t=>l.default.readFileSync(t,{encoding:"utf8"}),xe=(t,e)=>l.default.renameSync(t,e),je=t=>l.default.unlinkSync(t),Pe=(t,e={recursive:!0,force:!0})=>l.default.rmSync(t,e)});var v={};J(v,{delete_json:()=>ue,file_exists:()=>fe,file_not_exists:()=>ge,ls_dir:()=>we,ls_dirs:()=>ve,ls_files:()=>be,mkdir:()=>_e,mv:()=>xe,read_binary:()=>me,read_binary_to_binstr:()=>ye,read_file:()=>Se,read_json:()=>ce,rm_dir:()=>Pe,rm_file:()=>je,write_binary:()=>de,write_binstr:()=>pe,write_file:()=>Ee,write_json:()=>he});var b=f(()=>{"use strict";D();H();W()});var Le={};J(Le,{default:()=>$e});module.exports=g(Le);var L=u(require("fs"),1),ee=u(require("path"),1);var V=u(require("path"),1),le=t=>{let e=V.default.parse(t);if(e.name===t)throw new Error(`${t} path could not be parsed`);return e},B=le;var te=require("async-mutex");var E=class{open(i){return s(this,arguments,function*({name:e,path:r}){throw new Error("Method not implemented.")})}set(e,r){return s(this,null,function*(){throw new Error("Method not implemented.")})}get(e){return s(this,null,function*(){throw new Error("Method not implemented.")})}getAll(){return s(this,null,function*(){throw new Error("Method not implemented.")})}remove(e){return s(this,null,function*(){throw new Error("Method not implemented.")})}delete(){return s(this,null,function*(){throw new Error("Method not implemented.")})}},h=E;var S=class extends h{open(i){return s(this,arguments,function*({name:e,path:r}){})}set(e,r){return s(this,null,function*(){})}get(e){return s(this,null,function*(){})}getAll(){return s(this,null,function*(){})}remove(e){return s(this,null,function*(){})}delete(){return s(this,null,function*(){})}},x=S;var j=class{open(i){return s(this,arguments,function*({name:e,path:r}){})}set(e,r){return s(this,null,function*(){})}get(e){return s(this,null,function*(){})}getAll(){return s(this,null,function*(){})}remove(e){return s(this,null,function*(){})}delete(){return s(this,null,function*(){})}},P=j;var X=u(require("path"),1);var Re=(b(),g(v)),{write_json:R,read_json:Q,delete_json:Te}=Re,T=class extends h{constructor(){super(),this.json={},this.path=""}open(i){return s(this,arguments,function*({name:e,path:r}){this.path=X.default.join(r,`${e}.json`),this.json={},Q(this.path)?this.json=Q(this.path):R(this.json,this.path,{format:!0})})}set(e,r){return s(this,null,function*(){this.json[e]=r,R(this.json,this.path,{format:!0})})}get(e){return s(this,null,function*(){return this.json[e]})}getAll(){return s(this,null,function*(){let e=[];return this.json&&(e=Object.keys(this.json).map(r=>({key:r,value:this.json[r]}))),e})}remove(e){return s(this,null,function*(){delete this.json[e],R(this.json,this.path,{format:!0})})}delete(){return s(this,null,function*(){this.json={},Te(this.path)})}},k=T;var m=u(require("path"),1);var ke=(b(),g(v)),{write_json:Fe,read_json:U,delete_json:Y,mkdir:Me,ls_files:K,rm_dir:Ae}=ke,F=class extends h{constructor(){super(),this.path=""}open(i){return s(this,arguments,function*({name:e,path:r}){r=m.default.join(r,e),Me(r),this.path=r})}set(e,r){return s(this,null,function*(){if(typeof e=="number"&&(e=this._convet_to_string_int(e)),typeof r!="object")throw new Error("value must be a js object");return Fe(r,m.default.join(this.path,e+".json"),{format:!0})})}get(e){return s(this,null,function*(){return typeof e=="number"&&(e=this._convet_to_string_int(e)),U(m.default.join(this.path,e+".json"))})}getAll(){return s(this,null,function*(){let e=K(this.path),r=[];for(let i of e)r.push({key:m.default.basename(i,".json"),value:U(m.default.join(this.path,i))});return r})}remove(e){return s(this,null,function*(){return typeof e=="number"&&(e=this._convet_to_string_int(e)),Y(m.default.join(this.path,e+".json"))})}delete(){return s(this,null,function*(){let e=K(this.path);for(let r=0;r<e.length;r++)Y(e[0]);Ae(this.path)})}_convet_to_string_int(e){let r=10,i=e.toString(),n=i.length;return"0".repeat(r-n)+i}},M=F;var z=require("mongodb");var A=class extends h{constructor({url:e,database:r}){super(),this.url=e,this.client=new z.MongoClient(e),this.database=r,this.collection=void 0}open(r){return s(this,arguments,function*({name:e}){this.collection=e,yield this.client.connect(),this.database=this.client.db(this.database),this.collection=this.database.collection(this.collection)})}set(e,r){return s(this,null,function*(){return yield this.collection.insertOne(r)})}get(e){return s(this,null,function*(){return yield this.collection.find(e).toArray()})}getAll(){return s(this,null,function*(){return yield this.collection.find({}).toArray()})}remove(e){return s(this,null,function*(){return yield this.collection.deleteMany(e)})}delete(){return s(this,null,function*(){return yield this.collection.drop(),yield this.client.close()})}},O=A;var G=u(require("sqlite3"),1),Z=require("sqlite");var Oe=(b(),g(v)),{rm_file:qe}=Oe,q=class extends h{constructor(){super(),this.file=void 0,this.db=void 0}open(r){return s(this,arguments,function*({name:t,path:e}){this.file=e+"/"+t+".sqlite",this.db=yield(0,Z.open)({filename:this.file,driver:G.default.Database});try{yield this.db.exec("CREATE TABLE storage ( key TEXT PRIMARY KEY, value TEXT, type TEXT)")}catch(i){if(i.code!=="SQLITE_ERROR")throw i}})}set(t,e){return s(this,null,function*(){let[r,i]=this._parseValue(e),n;try{n=yield this.db.get(`SELECT value FROM storage WHERE key = '${t}'`)}catch(o){if(o.code!=="SQLITE_ERROR")throw o;n=void 0}n?yield this.db.exec(`UPDATE storage SET value = '${r}', type = '${i}' WHERE key = '${t}'`):yield this.db.exec(`INSERT INTO storage (key, value, type) VALUES ( '${t}', '${r}', '${i}')`)})}get(t){return s(this,null,function*(){let e;try{e=yield this.db.get(`SELECT value, type FROM storage WHERE key = '${t}'`)}catch(r){if(r.code!=="SQLITE_ERROR")throw r;e=void 0}if(e&&e.value!=="undefined")return this._parseString(e.value,e.type)})}getAll(){return s(this,null,function*(){let t=yield this.db.all("SELECT key, value, type FROM storage");return t.length===0?[]:t.map(r=>({key:r.key,value:this._parseString(r.value,r.type)}))})}remove(t){return s(this,null,function*(){let e;try{e=yield this.db.get(`SELECT value FROM storage WHERE key = '${t}'`)}catch(r){if(r.code!=="SQLITE_ERROR")throw r;e=void 0}e&&(yield this.db.exec(`DELETE FROM storage WHERE key = '${t}'`))})}delete(){return s(this,null,function*(){yield this.db.exec("DELETE FROM storage"),qe(this.file)})}_parseValue(t){if(typeof t=="object")return[JSON.stringify(t),"object"];if(typeof t=="string")return[t,"string"];if(typeof t=="number")return[t.toString(),"number"];if(typeof t=="function")return[t.toString(),"function"];if(typeof t=="boolean")return[t.toString(),"boolean"];if(typeof t=="undefined")return["undefined","undefined"];throw new Error("Invalid value type")}_parseString(value,type){if(type==="object")return JSON.parse(value);if(type==="string")return value;if(type==="number")return Number(value);if(type==="function")return eval(value);if(type==="boolean")return!!value;if(type==="undefined")return}},$=q;var I=class{constructor({type:e,path:r,keyValue:i,mutex:n,url:o,database:a}){this.type=e,this.path=r,this.keyValue=i!=null?i:!1,this.mutex=n!=null?n:!0,this.url=o!=null?o:"",this.database=a!=null?a:""}open(e){return s(this,null,function*(){let r=new C({type:this.type,path:this.path,keyValue:this.keyValue,mutex:this.mutex,url:this.url,database:this.database});return yield r.open(e),r})}},C=class{constructor({type:e,path:r,keyValue:i,mutex:n,url:o,database:a}){this.add=this.set;this.push=this.set;this.write=this.set;this.read=this.get;this.all=this.getAll;this.list=this.getAll;if(console.log("input path:",r),r){let{dir:y,name:c}=B(r);if(c==="file")throw new Error("path must be a directory");this.path=y,console.log("dir:",y)}else this.path=ee.default.join(process.cwd(),"storage");if(console.log("this.path:",this.path),L.default.existsSync(this.path)||L.default.mkdirSync(this.path),this.keyValue=i!=null?i:!1,this.mutex=n===!1?null:new te.Mutex,e==="json")this.storage=new M;else if(e==="jsonFile")this.storage=new k;else if(e==="cvs")this.storage=new P;else if(e==="sqlite")this.storage=new $;else if(e==="binary")this.storage=new x;else if(e==="mongodb"){if(!o||!a)throw new Error("url and database must be defined");this.mutex=null,this.keyValue=!1,this.storage=new O({url:o,database:a})}else throw new Error(`type ${e} is not supported`);this.index=this.keyValue?-1:0}open(e){return s(this,null,function*(){yield this.storage.open({name:e,path:this.path})})}set(e,r){return s(this,null,function*(){let{key:i,value:n}=this._handleInputs(e,r);return yield this._mutex(()=>s(this,null,function*(){return yield this.storage.set(i,n)}))})}get(e){return s(this,null,function*(){return yield this._mutex(()=>s(this,null,function*(){return yield this.storage.get(e)}))})}getAll(){return s(this,null,function*(){return yield this._mutex(()=>s(this,null,function*(){return yield this.storage.getAll()}))})}has(e){return s(this,null,function*(){return yield this._mutex(()=>s(this,null,function*(){return!!(yield yield this.storage.get(e))}))})}remove(e){return s(this,null,function*(){return yield this._mutex(()=>s(this,null,function*(){return yield this.storage.remove(e)}))})}delete(){return s(this,null,function*(){return yield this._mutex(()=>s(this,null,function*(){return yield this.storage.delete()}))})}_handleInputs(e,r){let i,n;return this.keyValue?(i=e,n=r):(i=++this.index,n=e),{key:i,value:n}}_mutex(e){return this.mutex?this.mutex.runExclusive(e):e()}},re=I;var $e=re;