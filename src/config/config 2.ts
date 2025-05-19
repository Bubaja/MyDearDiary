interface Config {
  apiUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  storageUrl: string;
  version: string;
  buildNumber: string;
  environment: 'development' | 'staging' | 'production';
  defaultLanguage: string;
  supportedLanguages: string[];
  features: {
    biometricAuth: boolean;
    socialAuth: boolean;
    imageUpload: boolean;
    darkMode: boolean;
    notifications: boolean;
  };
}

const defaultConfig: Config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL || '',
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  storageUrl: process.env.EXPO_PUBLIC_STORAGE_URL || '',
  version: process.env.EXPO_PUBLIC_VERSION || '1.0.0',
  buildNumber: process.env.EXPO_PUBLIC_BUILD_NUMBER || '1',
  environment: (process.env.EXPO_PUBLIC_ENVIRONMENT || 'development') as Config['environment'],
  defaultLanguage: 'en',
  supportedLanguages: ['en'],
  features: {
    biometricAuth: true,
    socialAuth: true,
    imageUpload: true,
    darkMode: true,
    notifications: true,
  },
};

const developmentConfig: Partial<Config> = {
  environment: 'development',
  features: {
    ...defaultConfig.features,
    notifications: false,
  },
};

const stagingConfig: Partial<Config> = {
  environment: 'staging',
};

const productionConfig: Partial<Config> = {
  environment: 'production',
};

function getConfig(): Config {
  switch (process.env.EXPO_PUBLIC_ENVIRONMENT) {
    case 'production':
      return { ...defaultConfig, ...productionConfig };
    case 'staging':
      return { ...defaultConfig, ...stagingConfig };
    case 'development':
    default:
      return { ...defaultConfig, ...developmentConfig };
  }
}

export const config = getConfig(); 