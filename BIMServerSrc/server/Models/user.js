const User = {
  name: 'User',
  primaryKey:'id',
  properties: {
    id:  'string',
    email: 'string',
    password: 'string',
    token: {type: 'string', optional: true},
    project:{type: 'string', optional: true}
  }
};

module.exports=User
