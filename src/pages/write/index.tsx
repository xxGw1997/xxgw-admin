import { MDXEditorMethods } from "@mdxeditor/editor";
import { useRef } from "react";
import { Editor } from "~/components/mdx-editor";

const WritePage = () => {
  const editorRef = useRef<MDXEditorMethods>(null);
  return (
    <div>
      <Editor editorRef={editorRef} markdown="" />
    </div>
  );
};

export default WritePage;
