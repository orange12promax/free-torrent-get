var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "m_team",
});

connection.connect(function (err) {
  if (err) {
    console.error("连接失败: " + err.stack);
    return;
  }

  console.log("连接成功 id " + connection.threadId);
});

connection.query(
  "INSERT INTO origin_html(html) VALUES(?)",
  ["11111"],
  (err, results) => {
    if (err) {
      console.log(err);
    }
    console.log(results);
  }
);
