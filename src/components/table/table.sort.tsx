import { Space, Table, Tag } from "antd";
import { ColumnType } from "antd/es/list";
import type { ColumnGroupType, ColumnsType, TableProps } from "antd/es/table";
import { RefTable } from "antd/es/table/interface";

export interface TableSortFilterProps {
  columns: any;
  data: any[];
  options?: TableProps<any>;
}

export function TableSortFilter({
  columns,
  data,
  options,
}: TableSortFilterProps) {
  return (
    <div>
      <Table {...options} columns={columns} dataSource={data} />
    </div>
  );
}
