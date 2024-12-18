import { Link } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePublisher, updateLink$ } from "@mdxeditor/editor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Hint } from "../hint";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const schema = z.object({
  url: z.string().url({ message: "请添加一个有效的url地址" }),
  title: z.string(),
});

type CustomInsertLinkProps = {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
};

export const CustomInsertLink = ({
  dialogOpen,
  setDialogOpen,
}: CustomInsertLinkProps) => {
  const insertLink = usePublisher(updateLink$);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      url: "",
      title: "",
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    const validateFields = schema.safeParse({
      url: values.url,
      title: values.title,
    });
    if (!validateFields.success) {
      toast("请填写正确的信息~");
      return;
    }
    insertLink({ url: values.url, title: values.title });
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <Hint label="插入链接">
        <DialogTrigger asChild>
          <Button className="_toolbarButton_uazmk_237">
            <Link />
          </Button>
        </DialogTrigger>
      </Hint>
      <DialogContent
        className="sm:max-w-[625px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>插入超链接</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 flex flex-col"
          >
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://www.example.com/link"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>完整的URL地址</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="title" {...field} />
                  </FormControl>
                  <FormDescription>title的描述信息</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="ml-auto">
              添加
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
