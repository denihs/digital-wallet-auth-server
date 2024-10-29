import User from './User.js'; // Your existing user model

// Mock of database storage (should be real in production)
const tokens = [];
const clients = [
  {
    clientId: 'client-id',
    clientSecret: 'client-secret',
    grants: ['password', 'refresh_token'],
    redirectUris: []
  }
];

// Store tokens in memory (replace with DB in production)
export default {
  getAccessToken: (accessToken) => {
    console.log('getAccessToken', accessToken);
    const token = tokens.find((t) => t.accessToken === accessToken);
    return token ? { ...token, user: token.user, client: token.client } : null;
  },

  getClient: (clientId, clientSecret) => {
    console.log('Attempting to get client with:', { 
        receivedClientId: clientId, 
        receivedClientSecret: clientSecret 
    });
    console.log('Available clients:', clients);
    
    const client = clients.find(client => 
        client.clientId === clientId && 
        client.clientSecret === clientSecret
    );
    
    console.log('Found client:', client);
    return client;
  },

  saveToken: (token, client, user) => {
    console.log('saveToken', token, client, user);
    tokens.push({ ...token, client, user });
    return { ...token, client, user };
  },

  getUser: async (username, password) => {
    console.log('getUser', username, password);
    const user = await User.findOne({ username });
    if (user && (await user.matchPassword(password))) {
      return user;
    }
    return null;
  },

  // Support for refresh tokens
  getRefreshToken: (refreshToken) => {
    console.log('getRefreshToken', refreshToken);
    const token = tokens.find(t => t.refreshToken === refreshToken);
    return token ? { ...token, user: token.user, client: token.client } : null;
  },

  revokeToken: (token) => {
    console.log('revokeToken', token);
    const tokenIndex = tokens.findIndex(t => t.refreshToken === token.refreshToken);
    if (tokenIndex !== -1) {
      tokens.splice(tokenIndex, 1);
      return true;
    }
    return false;
  }
};
