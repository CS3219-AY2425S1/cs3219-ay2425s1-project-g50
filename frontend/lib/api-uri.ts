export enum AuthType {
  Public = "public",
  Private = "private",
  Owner = "owner",
  Admin = "admin",
}

const constructUri = (
  baseUri: string,
  authType: AuthType,
  serviceName: string
) =>
  `http://${process.env.NEXT_PUBLIC_BASE_URI || baseUri}:${process.env.NEXT_PUBLIC_API_GATEWAY_PORT}/${authType}/${serviceName}`;

export const userServiceUri: (baseUri: string, authType: AuthType) => string = (
  baseUri,
  authType
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
