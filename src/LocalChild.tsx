import { useState } from "react";
import { Button, Card, Input, Modal, Space, Typography } from "antd";

export const LocalChild = () => {
  // local state：只有自己用得到，就留在自己组件里，不上提、不进 store
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");

  return (
    <Card title="LocalChild（local state 留在组件内）" size="small">
      <Space direction="vertical" style={{ width: 320 }}>
        <Input
          placeholder="随便输入，只影响本组件"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Typography.Text type="secondary">keyword = {keyword === "" ? "(空)" : keyword}</Typography.Text>
        <Button onClick={() => setOpen(true)}>打开本地 Modal</Button>
      </Space>
      <Modal
        title="本地 Modal"
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      >
        这个开关是 LocalChild 自己的 useState，没有上提给任何人。
      </Modal>
    </Card>
  );
};
