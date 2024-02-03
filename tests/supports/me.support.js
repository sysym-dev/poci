exports.testValidMe = (me) => {
  expect(me).toHaveProperty('id');
  expect(me).toHaveProperty('email');
  expect(me).toHaveProperty('photo_url');
  expect(me).toHaveProperty('is_email_verified');

  expect(typeof me.id).toBe('number');
  expect(typeof me.is_email_verified).toBe('boolean');
};
