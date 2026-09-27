# TypeScript + Vite + React + TanStack Query Demo

## 简介

这个 Demo 只保留一件事：把 UI 里的状态按**归属**分成三类，各回各家。

| 状态类型 | 例子 | 放哪 |
| --- | --- | --- |
| server state | 列表数据（`items`） | TanStack Query 的 `useQuery`，靠 `queryKey` 共享 |
| local state | modal 开关、输入框 | 组件自己的 `useState`，不上提 |
| 共享的 UI state | 选中的 item id | 父组件 `useState` + props 下发（不用 Context） |

三个状态各自的组件：

- `src/App.tsx` — 持选中态，持有 `queryKey: ["items"]` 的 query，放「重新拉取」按钮
- `src/ItemList.tsx` — 读**同一个** queryKey，点击回调经 props 上抛
- `src/ItemDetail.tsx` — 也读同一个 queryKey，证明跨组件复用同一份缓存、不重复发请求
- `src/LocalChild.tsx` — modal 开关和输入框都在自己组件里

## 运行

```bash
cd /Users/peng.li/workspace/freewind-demos/typescript-vite-react-tanstack-query-demo
pnpm install
pnpm dev
```

## 核心代码

`src/api.ts`

```ts
export const fetchItems = async (): Promise<Item[]> => {
  fetchCount += 1;
  console.log(`[api] fetchItems 第 ${fetchCount} 次调用（多个组件共用同一个 queryKey，只应看到 1 次）`);

  const { promise, resolve } = Promise.withResolvers<void>();
  setTimeout(resolve, 800);
  await promise;

  return ITEMS;
};
```

`src/App.tsx`

```tsx
const queryClient = useQueryClient();
const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

const { isPending, isFetching, dataUpdatedAt } = useQuery({
  queryKey: ["items"],
  queryFn: fetchItems,
});

<Button
  type="primary"
  loading={isFetching}
  onClick={() => {
    queryClient.invalidateQueries({ queryKey: ["items"] });
  }}
>
  重新拉取
</Button>

<ItemList selectedIds={selectedIds} onToggle={toggleSelected} />
<ItemDetail selectedIds={selectedIds} />
<LocalChild />
```

`src/ItemList.tsx`（`ItemDetail` 同款，只是渲染不同）

```tsx
const { data, isPending } = useQuery({ queryKey: ["items"], queryFn: fetchItems });
```

## 说明

- **不写缓存类**：谁需要数据谁 `useQuery`，缓存由 Query 按 `queryKey` 统一管，不用自己维护 Map 和过期时间
- **不写 gen counter**：并发/竞态由 Query 自己处理，不用手写「请求序号只认最后一次」那套
- **不写刷新编排**：`invalidateQueries` 一处失效，所有读同一 key 的组件一起更新
- 打开页面看 Console：`ItemList` 和 `ItemDetail` 共用一个 key，`fetchItems` 只打点 1 次
- 没引任何状态管理库（redux / zustand / jotai / use-context-selector 都没有）；共享的选择态用 `App` 的 `useState` + props 就够了
- 组件里只用一个 `QueryClientProvider`，没有第二个 Provider
