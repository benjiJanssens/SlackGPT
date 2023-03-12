import * as dotenv from 'dotenv';
import { cleanEnv, makeValidator, str, url } from 'envalid';

dotenv.config();

const encryptionKey = makeValidator((key) => {
  if (![16, 24, 32].includes(key.length))
    throw new Error(
      'Key must be 16 (128-bit), 24 (192-bit) or 32 (256-bit) characters'
    );

  if (key.length !== 32)
    console.warn(
      `Encryption key is only ${key.length} characters. (${
        key.length * 8
      }-bit)\n32 characters (256-bit) is recommended.`
    );

  return key;
});

export default cleanEnv(process.env, {
  NODE_ENV: str({
    default: 'development',
    choices: ['development', 'production'],
  }),
  DYNAMODB_REGION: str({ devDefault: 'localhost' }),
  DYNAMODB_ENDPOINT: url({
    default: undefined,
    devDefault: 'http://localhost:8000',
  }),
  DYNAMODB_ACCESS_KEY_ID: str({
    default: undefined,
    devDefault: 'DEFAULT_ACCESS_KEY',
  }),
  DYNAMODB_SECRET_ACCESS_KEY: str({
    default: undefined,
    devDefault: 'DEFAULT_SECRET',
  }),
  CRYPTO_KEY: encryptionKey({
    desc: 'Key used for encryption and decryption',
    devDefault: '?D(G+KbPeShVmYp3s6v9y$B&E)H@McQf',
  }),
  SLACK_SIGNING_SECRET: str(),
  SLACK_BOT_TOKEN: str(),
});
