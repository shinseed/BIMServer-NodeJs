const fs=require('fs');
const UUID=require('uuid');
const Realm = require('realm');

let login =async (ctx,next)=>{
  let email=ctx.query['email'];
  let password=ctx.query['password'];
  console.log(email,password);
  let realm = new Realm();
  let user = realm.objects('User').filtered(`email="${email}"`);
  // realm.write(() => {
  //   realm.create('User', {email: email,password:password,id:UUID.v1()});
  // });
  ctx.response.body=user

}

let isRepeatEmail=async (ctx,next)=>{
  let email=ctx.query['email'];
  let realm=new Realm();
  let user=realm.objects('User').filtered(`email="${email}"`);
  if(user[0]){
    ctx.response.body={results:true};
  }
  else{
    ctx.response.body={results:false};
  }
}

module.exports={
  'GET /api/login':login,
  'GET /api/isRepeatEmail':isRepeatEmail
}
