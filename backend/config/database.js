
import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Traore@60",
  database: "salon_coiffure",
  port: 3306
});

connection.connect((error) => {
  if (error) {
    console.error("❌ Erreur de connexion à MySQL :", error.message);
    return;
  }

  console.log("✅ Connexion à MySQL réussie !");
});

export default connection;