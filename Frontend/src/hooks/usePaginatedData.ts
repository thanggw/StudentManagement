"use client";

import { useState, useEffect, useCallback } from "react";
import { message } from "antd";

interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

interface UsePaginatedDataOptions<T> {
  fetchFn: (
    filter?: string,
    skip?: number,
    limit?: number
  ) => Promise<PaginatedResponse<T>>;
  pageSize?: number;
  dependencies?: any[];
}

export const usePaginatedData = <T>(options: UsePaginatedDataOptions<T>) => {
  const { fetchFn, pageSize = 10, dependencies = [] } = options;

  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const loadData = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const skip = (page - 1) * pageSize;
        const result = await fetchFn(undefined, skip, pageSize);
        setData(result.data);
        setTotal(result.total);
        setCurrentPage(page);
      } catch (error: any) {
        message.error(error.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    },
    [fetchFn, pageSize]
  );

  useEffect(() => {
    loadData(1);
  }, [loadData, ...dependencies]);

  const refetchPage1 = () => loadData(1);
  const reload = () => loadData(currentPage);

  return {
    data,
    total,
    loading,
    currentPage,
    pageSize,
    loadData,
    refetchPage1,
    reload,
  };
};
