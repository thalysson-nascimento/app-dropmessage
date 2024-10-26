type Environment = 'production' | 'mock' | 'development';

interface TypeEnveronment {
  production: boolean;
  baseUrlSocket: string;
  baseURL: string;
  pathURL: string;
  mock: boolean;
}

export const environmentConfig: Record<Environment, TypeEnveronment> = {
  production: {
    baseURL: 'https://cbcf4b115c50c003d3dfcb08bb8a0a5d.serveo.net',
    pathURL: '/api/v1',
    production: true,
    mock: false,
    baseUrlSocket: '',
  },
  mock: {
    baseURL: 'https://mock.com',
    pathURL: '/api/mock',
    production: false,
    mock: true,
    baseUrlSocket: '',
  },
  development: {
    baseURL: 'http://localhost:3000',
    pathURL: '/api/dev',
    production: false,
    mock: false,
    baseUrlSocket: 'http://localhost:3000',
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
