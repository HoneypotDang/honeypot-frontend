import { defaultContainerVariants, itemSlideVariants } from "@/lib/animation";
import { PaginationState } from "@/services/utils";
import { Pagination, PaginationProps, Spinner } from "@nextui-org/react";
import { motion } from "framer-motion";
import { observer, useLocalObservable } from "mobx-react-lite";
import { use, useEffect } from "react";

export type Column<T> = {
  title: string;
  dataKey?: keyof T | "_action";
  key?: string;
  render?: (value: any, row: T) => JSX.Element;
};

export type TableProps<T extends Record<string, any>> = {
  columns: Column<T>[];
  datasource: T[];
  paginationProps?: PaginationProps;
  pagination?: PaginationState;
  isLoading?: boolean;
  rowKey: string;
};

export const NoData = () => {
  return (
    <div className="flex justify-center items-center h-[200px] text-[rgba(255,255,255,0.55)] text-sm font-bold leading-4">
      No Data
    </div>
  );
};

function TableBase<T extends Record<string, any>>({
  columns,
  datasource,
  paginationProps,
  pagination,
  isLoading,
  rowKey,
}: TableProps<T>) {
  const state = useLocalObservable(() => ({
    pagination:
      pagination ||
      new PaginationState({
        total: datasource.length,
      }),
    datasource,
    setDatasource(datasource: T[]) {
      this.datasource = datasource;
      if (!pagination) {
        this.pagination.setTotal(datasource.length);
      }
    },
    get tableData() {
      return pagination
        ? this.datasource
        : this.datasource.slice(state.pagination.offset, state.pagination.end);
    },
  }));
  useEffect(() => {
    state.setDatasource(datasource || []);
  }, [datasource]);

  return (
    <>
      <div className="flex flex-col">
        <div className="flex text-[rgba(255,255,255,0.55)] text-sm font-bold leading-4">
          {columns.map((column) => (
            <div
              className="flex-1 p-1 sm:p-[16px]"
              key={column.dataKey as string}
            >
              {column.title}
            </div>
          ))}
        </div>

        {isLoading ? (
          <Spinner />
        ) : (
          <motion.div
            variants={defaultContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {state.tableData?.length ? (
              state.tableData.map((data, index) => (
                <motion.div
                  key={data[rowKey] || index}
                  className="flex relative border-bottom"
                  variants={itemSlideVariants}
                >
                  {columns.map((column) => {
                    const value = column.dataKey ? data[column.dataKey] : null;
                    return (
                      <div
                        className="flex-1 p-1 sm:p-[16px] text-pretty"
                        key={(column.dataKey || column.key) as string}
                      >
                        {column.render ? column.render(value, data) : value}
                      </div>
                    );
                  })}
                </motion.div>
              ))
            ) : (
              <NoData></NoData>
            )}
          </motion.div>
        )}
      </div>
      {state.pagination.total > state.pagination.limit && (
        <Pagination
          className="flex justify-center mt-[12px]"
          total={state.pagination.totalPage ?? 0}
          page={state.pagination.page}
          initialPage={state.pagination.page}
          onChange={(page) => {
            state.pagination.onPageChange(page);
          }}
          {...paginationProps}
        />
      )}
    </>
  );
}

export const Table = observer(TableBase);
