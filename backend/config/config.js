module.exports = {
    development: {
      dialect: 'mssql', // Microsoft SQL Server dialect
      host: 'SQL8005.site4now.net',
      database: 'db_aaafd7_saparprd',
      username: 'db_aaafd7_saparprd_admin',
      password: 'Sapa@Tv2024',
      dialectOptions: {
        options: {
          encrypt: true, // Enables encryption
          trustServerCertificate: true, // Trusts the certificate as specified in your connection string
        },
      },
    },
    production: {
      dialect: 'mssql',
      host: 'SQL8005.site4now.net',
      database: 'db_aaafd7_saparprd',
      username: 'db_aaafd7_saparprd_admin',
      password: 'Sapa@Tv2024',
      dialectOptions: {
        options: {
          encrypt: true,
          trustServerCertificate: true,
        },
      },
    },
  };
  