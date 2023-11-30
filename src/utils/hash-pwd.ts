import * as crypto from 'crypto';

export const hashPwd = (p: string): string => {
  const hmac = crypto.createHmac(
    'sha512',
    'qmxishUIs7876sGHt%6V7hnk8L-Is2bdwU72*24mdssasdfsiasvcx',
  );
  hmac.update(p);
  return hmac.digest('hex');
};
