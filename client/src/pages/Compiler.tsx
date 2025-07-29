import CodeEditor from "@/components/CodeEditor";
import HelperHeader from "@/components/HelperHeader";
import Loader from "@/components/Loader/Loader";
import RenderCode from "@/components/RenderCode";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Textarea } from "@/components/ui/textarea";
import { useLoadCodeMutation } from "@/redux/slices/api";
import { updateFullCode, updateIsOwner } from "@/redux/slices/compilerSlice";
import { RootState } from "@/redux/store";
import { handleError } from "@/utils/handleError";
import { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SendHorizonal,LoaderIcon } from "lucide-react";
import { updateCodeValue } from "@/redux/slices/compilerSlice";

export default function Compiler() {
  const { urlId } = useParams();
  const [input, setInput] = useState("");
const [loading, setLoading] = useState(false);
  const windowWidth = useSelector(
    (state: RootState) => state.appSlice.windowWidth
  );
  const [loadExistingCode, { isLoading }] = useLoadCodeMutation();
  const dispatch = useDispatch();
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

const generateWithGemini = async (prompt: string) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are a helpful AI that returns only code with no explanation. No markdown formatting... \n\n${prompt}` }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2000 },
      }),
    }
  );

  if (!response.ok) throw new Error("Gemini API Error");
  const data = await response.json();
  return data.candidates[0].content.parts[0].text
    .replace(/```[\w]*\n?/g, '')
    .replace(/```/g, '')
    .trim();
};

const handlePromptSubmit = async () => {
  if (!input.trim()) return;
  setLoading(true);
  try {
    const generatedHtml = await generateWithGemini(input);
    dispatch(updateCodeValue(generatedHtml)); // ✅ Redux will update → CodeEditor & iframe update
    setInput(""); // Clear input
  } catch (err) {
    console.error("Gemini Error", err);
  } finally {
    setLoading(false);
  }
};


  const loadCode = async () => {
    try {
      if (urlId) {
        const response = await loadExistingCode({ urlId }).unwrap();
        dispatch(updateFullCode(response.fullCode));
        dispatch(updateIsOwner(response.isOwner));
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (urlId) {
      loadCode();
    }
  }, [urlId]);

  if (isLoading)
    return (
      <div className="w-full h-[calc(100dvh-60px)] flex justify-center items-center">
        <Loader />
      </div>
    );
  return (
    <ResizablePanelGroup
      direction={windowWidth > 640 ? "horizontal" : "vertical"}
      className="w-full !h-[calc(100vh-60px)]"
    >
     
      <ResizablePanel defaultSize={50} className="!h-[calc(100vh-60px)]">
  <div className="flex flex-col h-full overflow-hidden">
    <div className="shrink-0">
      <HelperHeader />
    </div>
    <div className="flex-1 min-h-0">
      <CodeEditor />
    </div>
    <div className="relative w-full p-2 bg-black">
  <Textarea
    placeholder="Only generates html css js code"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handlePromptSubmit();
      }
    }}
    disabled={loading}
    className="pr-10 bg-slate-900 text-white resize-none"
    rows={2}
  />
  <Button
    size="icon"
    variant="ghost"
    onClick={handlePromptSubmit}
    disabled={loading}
    className="absolute bottom-4 right-4 text-white hover:bg-transparent"
  >
    {loading ? <LoaderIcon size={18} /> : <SendHorizonal size={18} />}
  </Button>
</div>

  </div>
</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel
        className="h-[calc(100dvh-60px)] min-w-[350px]"
        defaultSize={50}
      >
        <RenderCode />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
