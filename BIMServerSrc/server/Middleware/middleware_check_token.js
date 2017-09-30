/*
 * check token middleware
 * Copyright(c) 2017-present shinseed, Inc. <307610991@qq.com>
 * Apache License 2.0
 */
const jwt = require('jsonwebtoken');
const RESTfulOut=require('../utils/RESTfulOut');

module.exports=function (ctx,next) {
  let token = ctx.request.body.token || ctx.query['token'] || ctx.headers['x-access-token'];

  if(token){
   jwt.verify(token,'BIMServer-NodeJs',function (err,decoded) {
      if(err){
        ctx.response.status=403;
        return ctx.response.body= new RESTfulOut(false,'','token timeout')
      }
      else{
        ctx.request.user_token=decoded;
        next();
      }
    })
  }
  else {
    ctx.response.status=403;
    ctx.response.body= new RESTfulOut(false,'','Please provide token') ;
  }
}
