"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/config";
import { UserServices } from "@/services/user-services";
import { UsersListTable } from "../components/users-list-table";

const PAGE_SIZE = 10;

export function UsersPage() {
  const [page, setPage] = useState(1);

  const { data } = useQuery({
    queryKey: [endpoints.users.getAll.query, page],
    queryFn: () => UserServices.getAllUsers({ page, limit: PAGE_SIZE }),
  });

  return (
    <div>
      <UsersListTable
        users={data?.data.payload.users || []}
        pagination={data?.data.payload.pagination}
        onPageChange={setPage}
      />
    </div>
  );
}
