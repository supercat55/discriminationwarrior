import { AxiosResponse, RequestError } from "@umijs/max";
import { RequestConfig } from "@umijs/max";

const errorHandler = (error: RequestError) => {
  return false;
}

const responseInterceptors = (response: AxiosResponse) => {
  return response;
}


export const request: RequestConfig = {
  errorConfig: {
    errorHandler
  },
  baseURL: process.env.NODE_ENV === 'development' ? '/rank' : '',
  responseInterceptors: [responseInterceptors],
}