const bcrypt = require('bcryptjs');

module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'Distruidora FastFeet',
          email: 'admin@fastfeet.com',
          passwordHash: bcrypt.hashSync('123456', 8),
          createdAt: new Date(),
          updatedAt: new Date(),
          admin: 1
        }
      ],
      {}
    );
  },

  down: () => {}
};
