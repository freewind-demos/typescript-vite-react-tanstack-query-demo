export type Item = {
  id: number;
  title: string;
  desc: string;
};

const ITEMS: Item[] = [
  { id: 1, title: "Item 1", desc: "第 1 条数据，来自 server state" },
  { id: 2, title: "Item 2", desc: "第 2 条数据，来自 server state" },
  { id: 3, title: "Item 3", desc: "第 3 条数据，来自 server state" },
  { id: 4, title: "Item 4", desc: "第 4 条数据，来自 server state" },
  { id: 5, title: "Item 5", desc: "第 5 条数据，来自 server state" },
  { id: 6, title: "Item 6", desc: "第 6 条数据，来自 server state" },
  { id: 7, title: "Item 7", desc: "第 7 条数据，来自 server state" },
  { id: 8, title: "Item 8", desc: "第 8 条数据，来自 server state" },
];

let fetchCount = 0;

// 假装这里是一次网络请求：800ms 延迟 + console 打点，用来观察到底调用了几次
export const fetchItems = async (): Promise<Item[]> => {
  fetchCount += 1;
  console.log(`[api] fetchItems 第 ${fetchCount} 次调用（多个组件共用同一个 queryKey，只应看到 1 次）`);

  const { promise, resolve } = Promise.withResolvers<void>();
  setTimeout(resolve, 800);
  await promise;

  return ITEMS;
};
