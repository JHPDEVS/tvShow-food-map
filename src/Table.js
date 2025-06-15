import React from "react";
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  usePagination,
} from "react-table";
import {
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/solid";
import { Button, PageButton } from "./shared/Button";
import { SortIcon, SortUpIcon, SortDownIcon } from "./shared/Icons";

// グローバルフィルターUI
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <div className="mx-3 mt-3">
      <div className="relative text-gray-600">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </span>
        <input
          type="text"
          className="block w-full py-2 pl-8 sm:pl-10 bg-gray-100 rounded outline-none text-sm sm:text-base"
          value={value || ""}
          onChange={(e) => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
          placeholder={`${count} 件のお店があります`}
        />
      </div>
    </div>
  );
}

// テーブルコンポーネント
function Table({ columns, data, mapSearch, getRate, onRowClick }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setGlobalFilter,
    preGlobalFilteredRows,
    state,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 10 },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0">
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        {headerGroups.map((headerGroup) =>
          headerGroup.headers.map((column) =>
            column.Filter ? (
              <div className="mt-2 sm:mt-0" key={column.id}>
                {column.render("Filter")}
              </div>
            ) : null
          )
        )}
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="min-w-full">
          <table
            {...getTableProps()}
            className="mt-2 w-full text-center text-gray-500 dark:text-gray-400"
          >
            <thead className="bg-gray-50 sticky top-0 z-10">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                  {headerGroup.headers.map((column) => (
                    <th
                      scope="col"
                      className="group px-2 sm:px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider"
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      key={column.id}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">
                          {column.render("Header")}
                        </span>
                        <span className="ml-1 flex-shrink-0">
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <SortDownIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                            ) : (
                              <SortUpIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                            )
                          ) : (
                            <SortIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                          )}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody
              {...getTableBodyProps()}
              className="bg-white divide-y divide-gray-200"
            >
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    onClick={() => {
                      console.log(row);
                      onRowClick(row);
                      mapSearch(row);
                      getRate(row.original.가게명);
                    }}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    key={row.id}
                  >
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-gray-900 truncate max-w-0"
                        title={cell.value}
                        key={cell.id}
                      >
                        <div className="truncate">{cell.render("Cell")}</div>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex-shrink-0 border-t bg-white py-2 px-3">
        <div className="flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className="text-sm"
            >
              前へ
            </Button>
            <Button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className="text-sm"
            >
              次へ
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-baseline">
              <span className="text-sm text-gray-700">
                <span className="font-medium">{state.pageIndex + 1}</span> /{" "}
                <span className="font-medium">{pageOptions.length}</span> ページ
              </span>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <PageButton
                  className="rounded-l-md"
                  onClick={() => gotoPage(0)}
                  disabled={!canPreviousPage}
                >
                  <span className="sr-only">First</span>
                  <ChevronDoubleLeftIcon
                    className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </PageButton>
                <PageButton
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon
                    className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </PageButton>
                <PageButton onClick={() => nextPage()} disabled={!canNextPage}>
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon
                    className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </PageButton>
                <PageButton
                  className="rounded-r-md"
                  onClick={() => gotoPage(pageCount - 1)}
                  disabled={!canNextPage}
                >
                  <span className="sr-only">Last</span>
                  <ChevronDoubleRightIcon
                    className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </PageButton>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Table;
