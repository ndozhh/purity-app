import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "Purity ✨" }];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1 className="text-2xl font-nunito font-normal">
        Sphinx of black quartz, judge my vow.
      </h1>
    </div>
  );
}
