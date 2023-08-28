const config = require(`${__config_dir}/app.config.json`);
const { debug } = config;
const mysql = new (require(`${__class_dir}/mariadb.class.js`))(config.db);
const Joi = require('joi');
const bcrypt = require('bcrypt');

class _auth {
  async add(data) {
    // Validate data
    const schema = Joi.object({
      name: Joi.string().min(5).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    }).options({
      abortEarly: false,
    });
    const validation = schema.validate(data);
    if (validation.error) {
      const errorDetails = validation.error.details.map(
        (detail) => detail.message
      );

      return {
        status: false,
        code: 422,
        error: errorDetails.join(', '),
      };
    }

    const passwordHash = await bcrypt.hash(
      data.password,
      config.bcrypt.saltRound
    );

    // Insert data to database
    const sql = {
      query: `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
      params: [data.name, data.email, passwordHash],
    };

    return mysql
      .query(sql.query, sql.params)
      .then((data) => {
        return {
          status: true,
          data,
        };
      })
      .catch((error) => {
        if (debug) {
          console.error('add task Error: ', error);
        }

        return {
          status: false,
          error,
        };
      });
  }

  show() {
    // Show data from database
    const sql = {
      query: `SELECT * FROM todos`,
    };

    return mysql
      .query(sql.query)
      .then((data) => {
        return {
          status: true,
          data,
        };
      })
      .catch((error) => {
        if (debug) {
          console.error('Error while show data: ', error);
        }

        return {
          status: false,
          error,
        };
      });
  }

  update(id, data) {
    // Validate data
    const schema = Joi.object({
      item: Joi.string(),
    }).options({
      abortEarly: false,
    });
    const validation = schema.validate(data);
    if (validation.error) {
      const errorDetails = validation.error.details.map((detail) => {
        detail.message;
      });

      return {
        status: false,
        code: 422,
        error: errorDetails.join(', '),
      };
    }

    // Update data in the database
    const sql = {
      query: `UPDATE task SET items = ? WHERE id = ?`,
      params: [data.item, id],
    };

    return mysql
      .query(sql.query, sql.params)
      .then((data) => {
        return {
          status: true,
          data,
        };
      })
      .catch((error) => {
        if (debug) {
          console.error('update task Error: ', error);
        }

        return {
          status: false,
          error,
        };
      });
  }

  delete(id) {
    // Delete data in the database
    const sql = {
      query: `DELETE FROM task WHERE id = ?`,
      params: [id],
    };

    return mysql
      .query(sql.query, sql.params)
      .then((data) => {
        return {
          status: true,
          data,
        };
      })
      .catch((error) => {
        if (debug) {
          console.error('delete task Error: ', error);
        }

        return {
          status: false,
          error,
        };
      });
  }
}

module.exports = new _auth();
