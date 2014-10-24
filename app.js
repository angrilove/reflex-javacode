
var fs = require('fs');
var mysql = require('mysql');
var projectName = 'build-java';

var connect = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '123456',
	database: 'information_schema',
	port: 3306
});

if (!fs.existsSync(projectName)) {
	fs.mkdirSync(projectName);
}

connect.connect();
connect.query('select table_name from tables where table_schema = "test"', function(err, rows, fields) {
	if (err) throw err;
	var i, tableName, fileName, ext = '.java';
	for (i in rows) {
		tableName = rows[i]['table_name'];
		fileName = capitalizable(tableName);
		(function(fileName, className, packageName) {
			// 创建文件
			fs.open(fileName, 'w', 0644, function(e, fd) {
				if (e) throw e;
				var str = 'package ' + packageName + ';\n\npublic class ' + className + ' {\n}\n';
				fs.write(fd, str, 0, 'utf8', function(e) {
					if (e) throw e;
					fs.closeSync(fd);
				});
			});
		})(projectName + fileName + ext, fileName, tableName);
	}
});
connect.end();

// Custom function
var capitalizable = function (str) {
	return str ? str.replace(/^\w/, function(m, i, orgi) {
			return m ? m.toUpperCase() : '';
		}) : str;
};