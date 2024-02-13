exports.testValidMe = (me, user) => {
  const expected = {
    id: user.id,
    email: user.email,
    name: user.name,
    photo_url: user.photoUrl,
    is_email_verified: user.isEmailVerified,
  };

  expect(me).toEqual(expected);
};
