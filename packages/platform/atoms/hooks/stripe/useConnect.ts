import { useQuery } from "@tanstack/react-query";

import { SUCCESS_STATUS, ERROR_STATUS } from "@calcom/platform-constants";
import type { ApiResponse } from "@calcom/platform-types";

import http from "../../lib/http";

export const useGetRedirectUrl = (redir?: string) => {
  const state = { returnTo: redir, onErrorReturnTo: "", fromApp: false };
  const authUrl = useQuery({
    queryKey: ["get-stripe-connect-redirect-uri"],
    staleTime: Infinity,
    enabled: false,
    queryFn: () => {
      return http
        ?.get<ApiResponse<{ authUrl: string }>>(`/stripe/connect?state=${JSON.stringify(state)}`)
        .then(({ data: responseBody }) => {
          if (responseBody.status === SUCCESS_STATUS) {
            return responseBody.data.authUrl;
          }
          if (responseBody.status === ERROR_STATUS) throw new Error(responseBody.error.message);
          return "";
        });
    },
  });

  return authUrl;
};

export const useConnect = (redir?: string) => {
  const { refetch } = useGetRedirectUrl(redir);

  const connect = async () => {
    const redirectUri = await refetch();

    if (redirectUri.data) {
      window.location.href = redirectUri.data;
    }
  };

  return { connect };
};
