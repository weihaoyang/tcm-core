# 五运六气 · tcm core

运气历法及六气交司。从 [知几排盘](https://github.com/weihaoyang/qimen-llm-chart) 提取 TypeScript 实现、共享依赖模块与回归测试；暂未发布 npm 包。

## 运行

需要 Node.js 20 或更高版本。

```sh
npm install
npm run patch:3meta
npm test
npm run typecheck
```

运行前的补丁会修正本地依赖中的计算口径。入口位于 `src/lib/tcm/`。

## 资料与案例

[研究论文：古籍、现代模型与待核事项](https://github.com/weihaoyang/qimen-llm-chart/blob/main/docs/research/calculation-audit-paper.md)

- 四柱的干支五行与脏腑/经络对应齐全（依《针灸聚英》《针灸大全》）（`src/lib/tcm/chart.test.ts`）
- 十干配脏腑的具体取值与歌诀一致（`src/lib/tcm/chart.test.ts`）
- 流年运气与本人五行分布并置，且不产出任何判断（`src/lib/tcm/chart.test.ts`）
- 边界声明必须包含「不诊断 / 不给方药」与异说标注（`src/lib/tcm/chart.test.ts`）
- exports both directions of the traditional two-fire ordering（`src/lib/tcm/chart.test.ts`）

案例验证具体输出字段，不验证占断效果。

## 授权与来源

本仓代码按 [GPL-3.0-only](LICENSE) 发布，源自知几排盘。十干化运参照《素问·天元纪大论》与《素问·五运行大论》；其余规则的具体证据与异文见研究论文。 其他随仓代码及依赖许可见 `LICENSES/`。不附古籍影像，其授权另按[影像权利记录](https://github.com/weihaoyang/qimen-llm-chart/blob/main/docs/research/sources/RIGHTS.md)核查。
