describe('verifyToken', () => {
  const jwt = require('jsonwebtoken');
  const { verifyToken, generateToken } = require('../helpers/jwt');
  const originalSecret = process.env.JWT_SECRET;

  beforeAll(() => {
    process.env.JWT_SECRET = 'testsecret';
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalSecret;
  });

  it('should return the correct payload for a valid token', () => {
    const payload = { id: 1, email: 'test@example.com' };
    const token = generateToken(payload);
    const result = verifyToken(token);
    expect(result).toMatchObject(payload);
  });

  it('should throw an error for an invalid token', () => {
    const invalidToken = 'invalid.token.here';
    expect(() => verifyToken(invalidToken)).toThrow(jwt.JsonWebTokenError);
  });

  it('should throw an error if the token is signed with an incorrect secret', () => {
    const payload = { id: 1, email: 'test@example.com' };
    const token = jwt.sign(payload, 'wrongsecret');
    expect(() => verifyToken(token)).toThrow(jwt.JsonWebTokenError);
  });

  it('should throw an error for an expired token', (done) => {
    const payload = { id: 1, email: 'test@example.com' };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1ms' });

    setTimeout(() => {
      try {
        expect(() => verifyToken(token)).toThrow(jwt.TokenExpiredError);
        done();
      } catch (error) {
        done(error);
      }
    }, 10); // Wait for 10ms to ensure the token has expired
  });
});