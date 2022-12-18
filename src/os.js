import { EOL, cpus, homedir, userInfo, arch } from 'node:os';

export const os = async (option) => {
  try {
    if (!option.startsWith('--')) throw new Error(`Invalid input: unknown option ${option}`);
    switch (option) {
      case '--EOL': {
        console.log('EOL: ', EOL);
        break;
      }
      case '--cpus': {
        const cpuInfo = cpus().map(item => ({Model: item.model, ['Clock rate (GHz)']: item.speed / 1000}));
        console.log(`Total count CPU: `, cpuInfo.length);
        console.table(cpuInfo);
        break;
      }
      case '--homedir': {
        console.log('Home directory: ', homedir());
        break;
      }
      case '--username': {
        console.log('User name: ', userInfo().username);
        break;
      }
      case '--architecture': {
        console.log('CPU architecture: ', arch());
        break;
      }
      default: throw new Error(`Invalid input: unknown option ${option}`);
    }
  } catch (e) {
    throw new Error(e.message);
  }
}