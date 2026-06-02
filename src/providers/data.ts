import { MOCK_SUBJECTS } from "@/constants/mock-data";
import {
  BaseRecord,
  DataProvider,
  GetListParams,
  GetListResponse,
} from "@refinedev/core";

export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord>({
    resource,
    pagination,
    filters,
    sorters,
  }: GetListParams): Promise<GetListResponse<TData>> => {
    if (resource !== "subjects") {
      return {
        data: [],
        total: 0,
      };
    }

    let data = [...MOCK_SUBJECTS];

    // FILTERING
    if (filters) {
      filters.forEach((filter) => {
        if (
          "field" in filter &&
          filter.field === "department" &&
          filter.operator === "eq"
        ) {
          data = data.filter((item) => item.department === filter.value);
        }

        if (
          "field" in filter &&
          filter.field === "name" &&
          filter.operator === "contains"
        ) {
          data = data.filter((item) =>
            item.name
              .toLowerCase()
              .includes(String(filter.value).toLowerCase()),
          );
        }
      });
    }

    // SORTING
    if (sorters?.length) {
      const sorter = sorters[0];

      data.sort((a, b) => {
        const aValue = a[sorter.field as keyof typeof a];
        const bValue = b[sorter.field as keyof typeof b];

        if (aValue < bValue) return sorter.order === "asc" ? -1 : 1;

        if (aValue > bValue) return sorter.order === "asc" ? 1 : -1;

        return 0;
      });
    }

    // PAGINATION
    const current = pagination?.currentPage || 1;
    const pageSize = pagination?.pageSize || 10;

    const start = (current - 1) * pageSize;
    const end = start + pageSize;

    const paginatedData = data.slice(start, end);

    return {
      data: paginatedData as unknown as TData[],
      total: data.length,
    };
  },

  getOne: async () => {
    throw new Error("This function not present in mock");
  },

  create: async () => {
    throw new Error("This function not present in mock");
  },

  update: async () => {
    throw new Error("This function not present in mock");
  },

  deleteOne: async () => {
    throw new Error("This function not present in mock");
  },

  getApiUrl: () => "",
};

/*
? original:

import { createSimpleRestDataProvider } from "@refinedev/rest/simple-rest";
import { API_URL } from "./constants";
export const { dataProvider, kyInstance } = createSimpleRestDataProvider({
  apiURL: API_URL,
});
*/
