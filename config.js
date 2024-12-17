const fs = require('fs');

// const mysql= require('mysql');

function connectToUserDatabase(){
const connection = mysql.createConnection({
    host: 'aaa',
    user: 'bbbb',
    password: 'cccccc',
    database: 'ddddddd',
    });
      return connection;
}

const credentials ={
  client_email: "vertex-ai",
  private_key: "-----BEGIN",
  projectId: "vertex-ai-gemini",
}


// const privateKey = fs.readFileSync('C:\\ssl-configuration\\key.key', 'utf8');
// const certificate = fs.readFileSync('C:\\ssl-configuration\\source.crt', 'utf8');
// const ca = fs.readFileSync('C:\\bitnami\\ssl-configuration\\cacertificate.crt', 'utf8'); 



const keyValuePairs = [
  //Add values for the keys below
  { key: 'PAGE_ACCESS_TOKEN', value: 'EAAWZACd5JrwUBO61JfRtn48EgutMxs2G6bW7BI0XmYprXsusoEtehTQLnZBIKqIosVzHtLyOFRigW4jjIW59O5iH8qM2sF5lvBrGw3TqZAzinaPF7vZB8FhJ2abSzHw1DiSPyyIWEFu5MlRaK1w4ZAjZAngDj5Q9DLvw2eLQMDbzAW1QsbF7rYL6GRX08B1d430YKe3F5JnvmzbZB8BfecNolfCR4IZD' },
  { key: 'VERIFY_TOKEN', value: 'princeindia' },

];

module.exports = { connectToUserDatabase, keyValuePairs };

