//Interface
class DatabaseService {
  connect() {}
  getUserData() {}
}

// MySQL implementation
class MySQLDatabaseService extends DatabaseService {
  connectMySQL() {
    console.log(" Connected to MySQL database");
  }
  getUserDataMySQL() {
    return " User data fetched from MySQL";
  }
}

//SQL server implementation
class SQLServerDatabaseService extends DatabaseService {
  connectSQLServer() {
    console.log(" Connected to SQL Server database");
  }
  getUserDataSQLServer() {
    return " User data fetched from SQL Server";
  }
  closeSQLServerConnection() {
    console.log(" SQL Server connection closed");
  }
}

//PostgreSQL
class PostgreSQLDatabaseService extends DatabaseService {
  connectPostgreSQL() {
    console.log("Connected to PostgreSQL database");
  }
  getUserDataPostgreSQL() {
    return " User data fetched from PostgreSQL";
  }
  rollbackTransaction() {
    console.log(" Transaction rolled back in PostgreSQL");
  }
}

//dependency injection
class UserManager {
  constructor(databaseService) {
    this.databaseService = databaseService;
  }

  manageUser() {
    //tùy loại database được truyền vào
    if (this.databaseService instanceof MySQLDatabaseService) {
      this.databaseService.connectMySQL();
      console.log(this.databaseService.getUserDataMySQL());
    } else if (this.databaseService instanceof SQLServerDatabaseService) {
      this.databaseService.connectSQLServer();
      console.log(this.databaseService.getUserDataSQLServer());
      this.databaseService.closeSQLServerConnection();
    } else if (this.databaseService instanceof PostgreSQLDatabaseService) {
      this.databaseService.connectPostgreSQL();
      console.log(this.databaseService.getUserDataPostgreSQL());
      this.databaseService.rollbackTransaction();
    } else {
      console.log("❌ Unknown database service!");
    }
  }
}

// Demo
const mysqlService = new MySQLDatabaseService();
const sqlService = new SQLServerDatabaseService();
const pgService = new PostgreSQLDatabaseService();

const user1 = new UserManager(mysqlService);
const user2 = new UserManager(sqlService);
const user3 = new UserManager(pgService);

console.log("---- User1 (MySQL) ----");
user1.manageUser();

console.log("---- User2 (SQL Server) ----");
user2.manageUser();

console.log("---- User3 (PostgreSQL) ----");
user3.manageUser();
