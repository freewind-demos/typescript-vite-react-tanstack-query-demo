import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Layout, Space, Tag, Typography } from "antd";
import { fetchItems } from "./api";
import { ItemList } from "./ItemList";
import { ItemDetail } from "./ItemDetail";
import { LocalChild } from "./LocalChild";

export const App = () => {
  const queryClient = useQueryClient();

  // 组件间共享的选择态：留在父组件，用 props 下发（不用 Context）
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // server state：queryKey 是缓存的唯一标识，谁来读都读同一份
  const { isPending, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ["items"],
    queryFn: fetchItems,
  });

  const toggleSelected = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <Layout style={{ minHeight: "100vh", padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          TanStack Query 承接 server state
        </Typography.Title>

        <Space wrap>
          <Button
            type="primary"
            loading={isFetching}
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ["items"] });
            }}
          >
            重新拉取
          </Button>
          <Tag color={isPending ? "orange" : "green"}>
            {isPending ? "loading" : `loaded, dataUpdatedAt=${dataUpdatedAt}`}
          </Tag>
          <Typography.Text type="secondary">选中 {selectedIds.size} 项</Typography.Text>
        </Space>

        <ItemList selectedIds={selectedIds} onToggle={toggleSelected} />
        <ItemDetail selectedIds={selectedIds} />
        <LocalChild />
      </Space>
    </Layout>
  );
};
