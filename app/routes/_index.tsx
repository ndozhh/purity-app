import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "Purity ✨" }];
};

export default function Index() {
  return (
    <div>
      <h1 className="text-2xl font-nunito font-normal">
        Sphinx of black quartz, judge my vow.
      </h1>
    </div>
  );
}
