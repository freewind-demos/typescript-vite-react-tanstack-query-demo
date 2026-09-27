import { Descriptions, Empty, Spin, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { fetchItems } from "./api";

type Props = {
  selectedIds: Set<number>;
};

export const ItemDetail = ({ selectedIds }: Props) => {
  // 第二个组件读同一个 queryKey，命中同一份缓存
  const { data, isPending } = useQuery({ queryKey: ["items"], queryFn: fetchItems });

  if (isPending) {
    return <Spin />;
  }

  const selected = data.filter((item) => selectedIds.has(item.id));

  return (
    <Typography>
      <Typography.Text strong>ItemDetail（同一个 queryKey，命中同一份缓存）</Typography.Text>
      {selected.length === 0 ? (
        <Empty description="上面点一条，这里就会出现详情" />
      ) : (
        <Descriptions bordered size="small" column={1}>
          {selected.map((item) => (
            <Descriptions.Item key={item.id} label={item.title}>
              {item.desc}
            </Descriptions.Item>
          ))}
        </Descriptions>
      )}
    </Typography>
  );
};
