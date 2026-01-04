import { endpoints } from "@/config";
import { api, APIResponse, Pagination } from "@/lib/api";
import { User } from "@/types";

export namespace UserServices {
  export function getAllUsers({ page, limit }: { page: number; limit: number }) {
    return api.get<APIResponse<{ users: User[]; pagination: Pagination }>>(
      endpoints.users.getAll.endpoint,
      {
        params: {
          page,
          limit,
        },
      },
    );
  }
}
