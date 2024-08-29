import { get } from 'env-var';

import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: get('PORT').required().asIntPositive(),
  SUPER_ADMIN_PASSWORD: get('SUPER_ADMIN_PASSWORD').required().asString(),
  JWT_SECRET: get('JWT_SECRET').required().asString(),
  WS_PATH: get('WS_PATH').required().asString(),
};

export default config;
