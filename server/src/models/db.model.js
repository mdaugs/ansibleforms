//- MYSQL Module
const logger = require('../lib/logger');
const dbConfig = require('../../config/db.config')
const client = require('mysql2');

dbConfig.multipleStatements=true
delete dbConfig.name // remove unsupported property
delete dbConfig.is_database // remove unsupported property
MySql = {}

MySql.do=function(query,vars,silent=false){
  return new Promise((resolve,reject) => {
    if(!silent){
      logger.info("[ansibleforms] running query : " + query)
    }
    var conn
    try{
      var conn = client.createConnection(dbConfig)
    }catch(err){
      logger.error("[ansibleforms] Connection error : " + err)
      reject(err)
    }
    try{
      conn.query(query,vars,function(err,result){
        // logger.debug("[ansibleforms] Closing connection")
        try{
          conn.end()
        }catch(e){}
        if(err){
          logger.error("[ansibleforms] Query error : " + err)
          reject(err)
        }else{
          if(!silent){
            logger.debug("[ansibleforms] query result : " + JSON.stringify(result))
          }
          resolve(result)
        }
      })
    }catch(err){
      // logger.debug("[ansibleforms] Closing connection")
      try{
        conn.end()
      }catch(e){}
      logger.error("[ansibleforms] " + err)
      reject(err)
    }
  })
};


module.exports = MySql
