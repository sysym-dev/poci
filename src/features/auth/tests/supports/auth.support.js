exports.testValidAuthResult = (data) => {
  expect(data).toHaveProperty('accessToken');
  expect(data).toHaveProperty('refreshToken');

  expect(typeof data.accessToken).toBe('string');
  expect(typeof data.refreshToken).toBe('string');
};
