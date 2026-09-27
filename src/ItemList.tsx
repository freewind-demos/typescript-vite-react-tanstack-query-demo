import { List, Spin, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { fetchItems } from "./api";

type Props = {
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
};

export const ItemList = ({ selectedIds, onToggle }: Props) => {
  // 与 App 用完全相同的 queryKey：直接复用缓存，不会再次请求
  const { data, isPending } = useQuery({ queryKey: ["items"], queryFn: fetchItems });

  if (isPending) {
    return <Spin />;
  }

  return (
    <List
      header={<Typography.Text strong>ItemList（server state 来自 useQuery 缓存）</Typography.Text>}
      bordered
      dataSource={data}
      renderItem={(item) => (
        <List.Item
          onClick={() => onToggle(item.id)}
          style={{
            cursor: "pointer",
            background: selectedIds.has(item.id) ? "#e6f4ff" : undefined,
          }}
        >
          {item.title}
        </List.Item>
      )}
    />
  );
};
