import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configFilePath = path.join(__dirname, '../../parameterVariables', 'config.json');

const loadConfig = () => {
    if (!fs.existsSync(configFilePath)) {
        fs.writeFileSync(configFilePath, JSON.stringify({}, null, 2));
    }

    const data = fs.readFileSync(configFilePath, 'utf8');

    return JSON.parse(data);
};

const saveConfig = (config) => {
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
};

const createProxy = (config) => {
    return new Proxy(config, {
        get(target, prop) {
            if (!(prop in target)) {
                target[prop] = null;
                saveConfig(target);
            }
            return target[prop];
        },
        set(target, prop, value) {
            target[prop] = value;
            saveConfig(target);
            return true;
        }
    });
};

const config = createProxy(loadConfig());

export {
    config
};