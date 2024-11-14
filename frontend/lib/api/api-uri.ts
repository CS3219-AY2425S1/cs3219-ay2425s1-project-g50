export enum AuthType {
  Public = "public",
  Private = "private",
  Owner = "owner",
  Admin = "admin",
}

export const baseApiGatewayUri: (baseUri: string) => string = (baseUri) =>
  `http://${process.env.NEXT_PUBLIC_BASE_URI || baseUri}:${process.env.NEXT_PUBLIC_API_GATEWAY_PORT}`;

export const constructUriSuffix: (
  authType: AuthType,
  serviceName: string
) => string = (authType: AuthType, serviceName: string) =>
  `/${authType}/${serviceName}`;

const constructUri: (
  baseUri: string,
  authType: AuthType,
  serviceName: string
) => string = (baseUri: string, authType: AuthType, serviceName: string) =>
  `${baseApiGatewayUri(baseUri)}${constructUriSuffix(authType, serviceName)}`;

export const userServiceUri: (baseUri: string, authType: AuthType) => string = (
  baseUri: string,
  authType: AuthType
) => constructUri(baseUri, authType, "user-service");
export const questionServiceUri: (
  baseUri: string,
  authType: AuthType
) => string = (baseUri, authType) =>
  constructUri(baseUri, authType, "question-service");
export const matchingServiceUri: (
  baseUri: string,
  authType: AuthType
) => string = (baseUri, authType) =>
  constructUri(baseUri, authType, "matching-service");
export const collabServiceUri: (
  baseUri: string,
  authType: AuthType
) => string = (baseUri, authType) =>
  constructUri(baseUri, authType, "collab-service");

const constructWebSockUri = (
  baseUri: string,
  authType: AuthType,
  serviceName: string
) =>
  `ws://${process.env.NEXT_PUBLIC_BASE_URI || baseUri}:${process.env.NEXT_PUBLIC_API_GATEWAY_PORT}/${authType}/${serviceName}`;

export const matchingServiceWebSockUri: (
  baseUri: string,
  authType: AuthType
) => string = (baseUri, authType) =>
  constructWebSockUri(baseUri, authType, "matching-service");
export const collabServiceWebSockUri: (
  baseUri: string,
  authType: AuthType
) => string = (baseUri, authType) =>
  constructWebSockUri(baseUri, authType, "collab-service");
export const yjsWebSockUri: (baseUri: string) => string = (baseUri) =>
  `${collabServiceWebSockUri(baseUri, AuthType.Public)}/yjs`;
