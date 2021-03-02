// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const register = require('@babel/register').default;

register({ extensions: ['.ts', '.js'] });