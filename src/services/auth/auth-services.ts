import { api, APIResponse } from "@/lib/api";
import { endpoints } from "@/config/endpoints";
import { User } from "@/types";

export namespace AuthServices {
  export function getGoogleAuthUrl() {
    return api.get<APIResponse<{ link: string }>>(endpoints.auth.google.endpoint);
  }

  export function getMe() {
    return api.get<APIResponse<{ user: User }>>(endpoints.auth.me.endpoint);
  }

  export function logout() {
    return api.get<APIResponse<null>>(endpoints.auth.logout.endpoint);
  }
}
