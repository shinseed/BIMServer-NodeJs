/*
 * user login api
 * Copyright (c) 2017 shinseed <307610991@qq.com>
 * MIT License
 */
const fs=require('fs');
const UUID=require('uuid');
const Realm = require('realm');
const jwt = require('jsonwebtoken');
const RESTfulOut=require('../utils/RESTfulOut');

let login =async (ctx,next)=>{
  let email=ctx.query['email'];
  let password=ctx.query['password'];
  let realm = new Realm();
  let token =jwt.sign(ctx.request.body, 'BIMServer-NodeJs', {
            'expiresIn': 10 // 设置过期时间
        });
  let user = realm.objects('User').filtered(`email="${email}"`);
  if(user[0]){
    ctx.response.body=new RESTfulOut(true,{token:token})
  }
  else{
    ctx.response.body=new RESTfulOut(false,'','Account or password error！');
  }

}

let isRepeatEmail=async (ctx,next)=>{
  let email=ctx.query['email'];
  let realm=new Realm();
  let user=realm.objects('User').filtered(`email="${email}"`);

  if(user[0]){
    ctx.response.body={success:true};
  }
  else{
    ctx.response.body={success:false};
  }
}


/**
 * register user
 */
let registerUser=async (ctx,next)=>{
  let email = ctx.request.body.email;
  let password = ctx.request.body.password;
  console.log(ctx.request.body);
  let realm=new Realm();
  let token =jwt.sign(ctx.request.body, 'BIMServer-NodeJs', {
            'expiresIn': 60*30 // 设置过期时间
        });
  realm.write(() => {
    realm.create('User', {email: email, password: password, id:UUID.v1(),token:token});
  });
  let outData=new RESTfulOut(true,{token:token},'Enjoy your token');
  ctx.response.body=outData;

}

module.exports={
  'GET /api/NotCheckToken/login':login,
  'GET /api/NotCheckToken/isRepeatEmail':isRepeatEmail,
  'POST /api/NotCheckToken/registerUser':registerUser
}
