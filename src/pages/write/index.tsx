import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Editor } from "~/components/mdx-editor";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { MultiSelect } from "~/components/ui/muti-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Switch } from "~/components/ui/switch";
import { cn } from "~/lib/utils";

const formSchema = z
  .object({
    title: z.string().max(32),
    desc: z.string().max(50),
    slug: z.string().min(2),
    category: z.array(z.string().min(1)).min(1).nonempty("请选择一个分类"),
    content: z.string(),
    isPublishNow: z.boolean(),
    date: z.date().optional(),
  })
  .refine(
    (data) => {
      if (!data.isPublishNow && !data.date) {
        return false;
      }
      return true;
    },
    {
      message: "请选择文章的发布时间",
      path: ["date"],
    }
  );

const options = [
  { label: "React", value: "react" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
  { label: "Svelte", value: "svelte" },
  { label: "Node", value: "node" },
];

const WritePage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      desc: "",
      slug: "",
      category: [],
      content: "",
      isPublishNow: true,
      date: new Date(),
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  const editorRef = useRef<MDXEditorMethods>(null);
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 flex flex-col"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>文章标题</FormLabel>
                <FormControl>
                  <Input placeholder="请输入文章标题" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="desc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>文章描述</FormLabel>
                <FormControl>
                  <Input placeholder="请输入文章描述" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>文章分类</FormLabel>
                <MultiSelect
                  options={options}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  placeholder="添加文章分类，可以选择多个"
                  variant="inverted"
                  animation={2}
                  maxCount={10}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isPublishNow"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="align-text-top pl-2">立即发布</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          {!form.watch("isPublishNow") && (
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>发布时间</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>选择时间</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <div>
            <Editor editorRef={editorRef} markdown="" />
          </div>
          <Button type="submit">提交</Button>
        </form>
      </Form>
    </div>
  );
};

export default WritePage;
