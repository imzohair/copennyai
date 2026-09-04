import * as featherlessService from '../services/featherlessService';

async function runTest() {
  console.log('Testing Featherless AI connection...');
  console.log('Using API URL:', process.env.FEATHERLESS_BASE_URL);
  
  const isConnected = await featherlessService.testConnection();
  
  if (isConnected) {
    console.log('✅ Success! Successfully connected to Featherless AI.');
  } else {
    console.error('❌ Failed! Could not connect to Featherless AI.');
    console.error('Please check your FEATHERLESS_API_KEY in the .env file.');
  }
}

runTest();
