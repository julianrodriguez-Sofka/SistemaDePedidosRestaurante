db = db.getSiblingDB('restaurant_admin');

// Actualizar chef1
db.users.updateOne(
  { username: 'chef1' }, 
  { $set: { roles: ['chef'] } }
);

// Actualizar waiter1
db.users.updateOne(
  { username: 'waiter1' }, 
  { $set: { roles: ['waiter'] } }
);

print('Users updated!');
print('\n=== All Users ===');
db.users.find({}, { password: 0 }).forEach(user => {
  print(`\nUsername: ${user.username}`);
  print(`Email: ${user.email}`);
  print(`Roles: ${user.roles.join(', ')}`);
  print(`Active: ${user.isActive}`);
});
