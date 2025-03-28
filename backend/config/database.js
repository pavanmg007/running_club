const { Pool } = require('pg');
const { DATABASE_URL } = require('./env');

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? {
        rejectUnauthorized: true,
        ca: `-----BEGIN CERTIFICATE-----
        MIIETTCCArWgAwIBAgIUOLCQ13+GWBQ1O/BLziI4zGzdlw4wDQYJKoZIhvcNAQEM
        BQAwQDE+MDwGA1UEAww1YzYzOTg5ZTctMTQ3MC00Mzk5LWI2MDgtNGFjYWVlYmU2
        Zjk2IEdFTiAxIFByb2plY3QgQ0EwHhcNMjUwMzI3MDY0MjIwWhcNMzUwMzI1MDY0
        MjIwWjBAMT4wPAYDVQQDDDVjNjM5ODllNy0xNDcwLTQzOTktYjYwOC00YWNhZWVi
        ZTZmOTYgR0VOIDEgUHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCC
        AYoCggGBAOhGvzz/8k9aiY0tjBMddprVVr+NyAc/d8Rdt6M+KsEw0lUM8K1zqLLj
        Fo1xz9OoT7+KC/3qCeHcZCiMigfyfBpSTxTRwmNSKyRuZAdDQG8XJEW43ysMiBfZ
        wAvdA4tsThh/inNwthIPosjjdj8XFoDNCVX3eW8FXpNXJSX8gaNY2O/L5hygLz9l
        IcNrLMf619bd5tLwGdAzxX0xv8lYk27Y/vZENJzrcn/5Ok4Xd9e/SVU1n141KAeY
        Vh4K6mXr1M9UiNQiFWo0jztbkXDWQTHgV2mNMR/TyDvukDyJBepmlxRYZX+xq4LG
        5+2h3HkqlwCnbV+CBBOvgsBaWQSA6hs3YNJ6ajnNGAZshpvDC8V7aW5B3K+96ypX
        vOVN5urO/D0N56RzvL6Zdxf+FULcoa2yFSlmVd3q0GgSLHISZINLGktSjBkXS5n9
        rFaPMUg8glXtdMSxk3x5AMBz1fnOx8PrhdTVLI2tBimDeyp9u/34Miq4kR/9zRHY
        ABXJV5PJNQIDAQABoz8wPTAdBgNVHQ4EFgQUt6q0MK/TPF6Um2+qhUayr3kq7R8w
        DwYDVR0TBAgwBgEB/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGB
        AG+U06x2/4ES8P0ssIfilZQNei6QTPWtdcJa1vvZEEBK1Eaz3txI0d71WKD+WzY9
        VXhNlwnc9HtTPQPM1wngJ5ZkYzA0ZpmH2FV2je+H9liYAv/fEpKr23rZqxcI0fgC
        Hoe3P9nB0cLc6xPhmM8ugHlSQjwDpmUNmuyX4ISKgXeNjmQdAtqz6bFA42F6MsMq
        ddi6FGR3pOQ4OIUOzTAl1bEhIjXrVT7gM5Z8fQx2wnfKUlCKRRzXN+wZ+xeIUkDU
        EPB+IkiKQsPnQemA/Jc0Nhcv1cpUPzsUwJbXHypy/lJNwnYdIR4N0ytHChSRnCFi
        Sh+xLrmBBM7a4cYKPefTV3Sf3wveZRFvMMtXsJExrQSYAt4cq8g8nUyYwevoVquY
        FDWQlNN6DI/ZQpCkf7b8bZBo6xPNu2znHkwjs3QYJ6mO5VpQnGYErjyd37hTUdF6
        yR5xwFm9qePF0Fyp/p3h8KKOfSjSPVP3i1Swom2yDbUsiuyuUWzRtDO1vArP5NL8
        gQ==
        -----END CERTIFICATE-----`,
      }
      : false
});

module.exports = pool;
