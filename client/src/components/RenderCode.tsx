import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export default function RenderCode() {
  const fullCode = useSelector(
    (state: RootState) => state.compilerSlice.fullCode
  );

  const combinedCode = `<html><body>${fullCode.html}</body></html>`;

  const iframeCode = `data:text/html;charset=utf-8,${encodeURIComponent(
    combinedCode
  )}`;

  return (
    <div className="bg-white h-full sm:h-[calc(100dvh-60px)]">
      <iframe
        title="rendered-code"
        className="w-full h-full"
        src={iframeCode}
      />
    </div>
  );
}
