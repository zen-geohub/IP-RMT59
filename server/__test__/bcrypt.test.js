const bcrypt = require('bcrypt');
const { hashPassword, comparePassword } = require('../helpers/bcrypt');

jest.mock('bcrypt');

describe('hashPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if password is null', () => {
    expect(() => hashPassword(null)).toThrow('Password must not be null or empty');
  });

  it('should throw an error if password is undefined', () => {
    expect(() => hashPassword(undefined)).toThrow('Password must not be null or empty');
  });

  it('should throw an error if password is an empty string', () => {
    expect(() => hashPassword('')).toThrow('Password must not be null or empty');
  });

  it('should hash the password using bcrypt', () => {
    const mockPassword = 'password123';
    const mockSalt = 'mockSalt';
    const mockHash = 'mockHash';

    bcrypt.genSaltSync.mockReturnValue(mockSalt);
    bcrypt.hashSync.mockReturnValue(mockHash);

    const result = hashPassword(mockPassword);

    expect(bcrypt.genSaltSync).toHaveBeenCalledWith(10);
    expect(bcrypt.hashSync).toHaveBeenCalledWith(mockPassword, mockSalt);
    expect(result).toBe(mockHash);
  });
});

describe('comparePassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true when the password matches the hash', () => {
    const mockPassword = 'password123';
    const mockHash = 'mockHash';

    bcrypt.compareSync.mockReturnValue(true);

    const result = comparePassword(mockPassword, mockHash);

    expect(bcrypt.compareSync).toHaveBeenCalledWith(mockPassword, mockHash);
    expect(result).toBe(true);
  });

  it('should return false when the password does not match the hash', () => {
    const mockPassword = 'password123';
    const mockHash = 'mockHash';

    bcrypt.compareSync.mockReturnValue(false);

    const result = comparePassword(mockPassword, mockHash);

    expect(bcrypt.compareSync).toHaveBeenCalledWith(mockPassword, mockHash);
    expect(result).toBe(false);
  });

  it('should throw an error if the password is null or undefined', () => {
    const mockHash = 'mockHash';

    expect(() => comparePassword(null, mockHash)).toThrow('Password must not be null or undefined');
    expect(() => comparePassword(undefined, mockHash)).toThrow('Password must not be null or undefined');
  });

  it('should throw an error if the hash is null or undefined', () => {
    const mockPassword = 'password123';

    expect(() => comparePassword(mockPassword, null)).toThrow('Hash must not be null or undefined');
    expect(() => comparePassword(mockPassword, undefined)).toThrow('Hash must not be null or undefined');
  });
});