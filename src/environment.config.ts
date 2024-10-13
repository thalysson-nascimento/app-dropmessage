type Environment = 'production' | 'mock' | 'development';

interface TypeEnveronment {
  production: boolean;
  baseURL: string;
  pathURL: string;
  mock: boolean;
}

export const environmentConfig: Record<Environment, TypeEnveronment> = {
  production: {
    baseURL: 'https://043e9f7d94c079136b0fba1f0ee9884f.serveo.net/api',
    pathURL: '/api/v1',
    production: true,
    mock: false,
  },
  mock: {
    baseURL: 'https://mock.com',
    pathURL: '/api/mock',
    production: false,
    mock: true,
  },
  development: {
    baseURL: 'http://localhost:3000/api',
    pathURL: '/api/dev',
    production: false,
    mock: false,
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
