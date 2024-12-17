import { ForwardedRef } from "react";
import {
  MDXEditor,
  MDXEditorMethods,
  toolbarPlugin,
  headingsPlugin,
  quotePlugin,
  listsPlugin,
  thematicBreakPlugin,
  linkPlugin,
  imagePlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  codeBlockPlugin,
  InsertCodeBlock,
  codeMirrorPlugin,
  ListsToggle,
  InsertThematicBreak,
  CodeToggle,
  StrikeThroughSupSubToggles,
  Separator,
  MDXEditorProps,
  linkDialogPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { CustomInsertImage } from "./insert-image";
import { CustomInsertLink } from "./insert-link";
import CustomLinkDialog from "./custom-link-dialog";

type EditorProps = {
  editorRef: ForwardedRef<MDXEditorMethods> | null;
} & MDXEditorProps;

export const Editor = ({ editorRef, ...props }: EditorProps) => {
  return (
    <div>
      <MDXEditor
        className="prose max-w-none"
        ref={editorRef}
        autoFocus
        {...props}
        plugins={[
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <Separator />
                <BoldItalicUnderlineToggles />
                <Separator />
                <BlockTypeSelect />
                <Separator />
                <ListsToggle />
                <Separator />
                <StrikeThroughSupSubToggles />
                <Separator />
                <CustomInsertLink />
                {/* <CreateLink /> */}
                <CustomInsertImage />
                {/* <InsertImage /> */}
                <Separator />
                <InsertThematicBreak />
                <CodeToggle />
                <InsertCodeBlock />
              </>
            ),
          }),
          headingsPlugin(),
          quotePlugin(),
          listsPlugin(),
          thematicBreakPlugin(),
          linkPlugin(),
          linkDialogPlugin({
            LinkDialog: () => <CustomLinkDialog />,
          }),
          imagePlugin({ disableImageSettingsButton: true }),
          codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
          codeMirrorPlugin({
            codeBlockLanguages: { js: "JavaScript", css: "CSS" },
          }),
        ]}
      />
    </div>
  );
};
