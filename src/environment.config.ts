type Environment = 'production' | 'mock' | 'development';

interface TypeEnveronment {
  production: boolean;
  baseUrlSocket: string;
  baseURL: string;
  pathURL: string;
  mock: boolean;
  apiKeyGeoLocationCageData: string;
}

export const environmentConfig: Record<Environment, TypeEnveronment> = {
  production: {
    baseURL: 'https://api-dropmessage-database-production.up.railway.app',
    pathURL: '/api/v1',
    production: true,
    mock: false,
    baseUrlSocket: 'https://api-dropmessage-database-production.up.railway.app',
    apiKeyGeoLocationCageData: 'ea70a7a8d9f34c4894602cc11e0407ae',
  },
  mock: {
    baseURL: 'https://mock.com',
    pathURL: '/api/mock',
    production: false,
    mock: true,
    baseUrlSocket: '',
    apiKeyGeoLocationCageData: 'ea70a7a8d9f34c4894602cc11e0407ae',
  },
  development: {
    baseURL: 'http://localhost:3000',
    pathURL: '/api/dev',
    production: false,
    mock: false,
    baseUrlSocket: 'http://localhost:3000',
    apiKeyGeoLocationCageData: 'ea70a7a8d9f34c4894602cc11e0407ae',
  },
};

// Função que retorna o ambiente ou 'development' como padrão
function getEnvironment(): Environment {
  // Acessando o NODE_ENV corretamente usando colchetes
  const env = (process.env['NODE_ENV'] || 'mock') as Environment;
  return ['production', 'mock', 'development'].includes(env) ? env : 'mock';
}

// Detecta o ambiente automaticamente
export const currentEnvironment = environmentConfig[getEnvironment()];
