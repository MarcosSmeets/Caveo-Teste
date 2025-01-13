import Router from "koa-router";

const router = new Router();
const aws = require("aws-sdk");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

aws.config.update({ region: "sa-east-1" });

const cognito = new aws.CognitoIdentityServiceProvider({
  accessKeyId: 'your_access_key_id',
  secretAccessKey: 'your_secret_access_key',
  region: 'sa-east-1',
});
const CLIENT_ID = "1b6mhedf268vq61l1chiekndg7";
const JWT_SECRET = "1ndsakwqwds";
const CLIENT_SECRET = "1ftkkun2ebu8fth9n349fadclrmmrpkdb0i6t2g0tkjd0gk5mhi1";

export const authenticateJWT = async (token: string) => {
  try {
    const decoded = jwt.decode(token, JWT_SECRET);

    return decoded['cognito:groups']; 
  } catch (error) {
    console.error('Falha na verificação do token:', error);
    return null;
  }
};

export const getUsernameInToken = async (token?: string) =>{
  const decoded = jwt.decode(token, JWT_SECRET)

  return decoded['username']
}

export const authorizationMiddleware = (requiredScopes: string[]) => {
  return async (ctx: any, next: any) => {
    const token = ctx.headers['authorization']?.split(' ')[1];

    if (!token) {
      ctx.status = 401;
      ctx.body = { message: 'Token não fornecido. Acesso negado.' };
      return;
    }

    const userGroups = await authenticateJWT(token);

    console.log(userGroups);

    if (!userGroups) {
      ctx.status = 403;
      ctx.body = { message: 'Token inválido ou expirado. Acesso negado.' };
      return;
    }

    const hasRequiredScope = requiredScopes.some(scope => userGroups.includes(scope));

    if (!hasRequiredScope) {
      ctx.status = 403;
      ctx.body = { message: 'Você não tem permissão para acessar esta rota.' };
      return;
    }

    await next();
  };
};

export const signupCognito = async (
  username: string,
  email: string,
  password: string,
) => {
  const params = {
    ClientId: CLIENT_ID,
    Username: username,
    Password: password,
    SecretHash: await getSecretHash(username),
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
    ],
  };

  const data = await cognito.signUp(params).promise();

  console.log(data)

  return data;
};

export const generateToken = async (email: string, password: string) => {
  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
      SECRET_HASH: await getSecretHash(email),
    },
  };

  const data = await cognito.initiateAuth(params).promise();
  const token = data.AuthenticationResult.AccessToken 


  return token;
};

async function getSecretHash(username: string): Promise<string> {
  const hash = crypto
    .createHmac("sha256", CLIENT_SECRET)
    .update(`${username}${CLIENT_ID}`)
    .digest("base64");
  console.log("Generated SecretHash:", hash);
  return hash;
}

export async function addToGroup(username: string, group: string, userPoolId: string){
  const groupParams = {
    UserPoolId: userPoolId,
    Username: username,
    GroupName: group,
  };

  await cognito.adminAddUserToGroup(groupParams).promise();
}