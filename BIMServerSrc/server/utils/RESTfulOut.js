class RESTfulOut {
  constructor(success,value,message) {
    this.value=value;
    this.message=message||'no message';
    this.success=success;
  }
}
module.exports=RESTfulOut;
