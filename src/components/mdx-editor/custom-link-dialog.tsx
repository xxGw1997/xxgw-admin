import { Copy, Edit, ExternalLink, Trash2 } from "lucide-react";
import {
  editorRootElementRef$,
  linkDialogState$,
  rootEditor$,
  useCellValue,
} from "@mdxeditor/editor";
import { Popover, PopoverAnchor, PopoverContent } from "../ui/popover";
import { cn } from "~/lib/utils";
import { Hint } from "../hint";
import { Button } from "../ui/button";

const CustomLinkDialog = () => {
  const linkDialogState = useCellValue(linkDialogState$);
  const editorRootElementRef = useCellValue(editorRootElementRef$);
  const rootEditor = useCellValue(rootEditor$);

  const theRect = linkDialogState.rectangle;

  return (
    <Popover open={linkDialogState.type !== "inactive"}>
      <PopoverAnchor
        className={cn(
          "fixed -z-1",
          linkDialogState.type === "edit" ? "visible" : "invisible"
        )}
        style={{
          top: `${theRect?.top ?? 0}px`,
          left: `${theRect?.left ?? 0}px`,
          width: `${theRect?.width ?? 0}px`,
          height: `${theRect?.height ?? 0}px`,
        }}
      />
      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        key={linkDialogState.linkNodeKey}
        container={editorRootElementRef?.current}
        collisionBoundary={rootEditor?._rootElement}
        className="p-1 w-auto"
      >
        {linkDialogState.type === "preview" && (
          <div className="flex gap-1">
            <Hint label={`跳转到${linkDialogState.url}`} side="bottom">
              <Button variant="ghost" className="p-2">
                <ExternalLink className="!size-5" />
              </Button>
            </Hint>
            <Hint label="编辑" side="bottom">
              <Button variant="ghost" className="p-2">
                <Edit className="!size-5" />
              </Button>
            </Hint>
            <Hint label="复制" side="bottom">
              <Button variant="ghost" className="p-2">
                <Copy className="!size-5" />
              </Button>
            </Hint>
            <Hint label="删除" side="bottom">
              <Button variant="ghost" className="p-2">
                <Trash2 className="!size-5" />
              </Button>
            </Hint>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default CustomLinkDialog;
