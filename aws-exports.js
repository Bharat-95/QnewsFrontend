import { Amplify } from "aws-amplify"

const awsConfig = {
    Auth: {
      region: "ap-south-1", // Cognito region
      userPoolId: "ap-south-1_bUVN5jiYN", // Your Cognito User Pool ID
      userPoolWebClientId: "4fjprisjtdvqbebnr0hrn6f7df", // Your Cognito App Client ID
      oauth: {
        domain: "https://ap-south-1buvn5jiyn.auth.ap-south-1.amazoncognito.com", // Correct domain URL without https:// prefix
        scope: ["email", "openid", "phone"],
        redirectSignIn: "https://localhost:3000", // The URL to which the user will be redirected after login
        redirectSignOut: "https://localhost:3000", // The URL to which the user will be redirected after logout
        responseType: "code", // Can be 'code' or 'token'
      },
    },
  };
  
  export default awsConfig;
  