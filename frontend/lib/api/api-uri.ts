const constructUri = (baseUri: string, port: string | undefined) =>
  `http://${process.env.NEXT_PUBLIC_BASE_URI || baseUri}:${port}`;

const constructWebSockUri = (baseUri: string, port: string | undefined) =>
  `ws://${process.env.NEXT_PUBLIC_BASE_URI || baseUri}:${port}`;

export const userServiceUri: (baseUri: string) => string = (baseUri) =>
  constructUri(baseUri, process.env.NEXT_PUBLIC_USER_SVC_PORT);
export const questionServiceUri: (baseUri: string) => string = (baseUri) =>
  constructUri(baseUri, process.env.NEXT_PUBLIC_QUESTION_SVC_PORT);
export const matchingServiceUri: (baseUri: string) => string = (baseUri) =>
  constructUri(baseUri, process.env.NEXT_PUBLIC_MATCHING_SVC_PORT);

export const matchingServiceWebSockUri: (baseUri: string) => string = (
  baseUri
) => constructWebSockUri(baseUri, process.env.NEXT_PUBLIC_MATCHING_SVC_PORT);
