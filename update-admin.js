db = db.getSiblingDB('restaurant_admin');
db.users.updateOne(
  { username: 'admin' }, 
  { $set: { roles: ['admin', 'waiter', 'chef'] } }
);
print('Admin user updated!');
db.users.findOne({ username: 'admin' }, { password: 0 });
