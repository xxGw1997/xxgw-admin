import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { useGetCategories } from "~/api/category";
import { useCreatePost, useGetPost } from "~/api/post";
import { Editor } from "~/components/mdx-editor";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Form,
  FormControl,
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
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import { cn } from "~/lib/utils";
import DateTimePicker from "./date-time-picker";

const formSchema = z
  .object({
    title: z.string().max(32).min(1, { message: "请输入文章标题" }).trim(),
    desc: z.string().max(50).min(1, { message: "请输入文章描述" }).trim(),
    categories: z.array(z.string().min(1)).min(1).nonempty("请选择一个分类"),
    content: z.string().trim(),
    isPublishNow: z.boolean(),
    publishDate: z.date().optional(),
  })
  .refine(
    (data) => {
      if (!data.isPublishNow && !data.publishDate) {
        return false;
      }
      return true;
    },
    {
      message: "请选择文章的发布时间",
      path: ["publishDate"],
    }
  );

const WritePage = () => {
  const [dateOpen, setDateOpen] = useState(false);

  const editorRef = useRef<MDXEditorMethods>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      desc: "",
      categories: [],
      content: "",
      isPublishNow: true,
      publishDate: new Date(),
    },
  });

  const { data: categories, isError: isCategoriesError } = useGetCategories();
  const formatCategories =
    categories && !isCategoriesError
      ? categories.map((category) => ({
          label: category.title,
          value: category.id + "",
        }))
      : [];

  const params = useParams();

  const { data: postInfo } = useGetPost(params.postId);

  useEffect(() => {
    if (postInfo) {
      form.reset({
        title: postInfo.title,
        desc: postInfo.desc,
        categories: postInfo.categories.map((c) => c + ""),
        content: postInfo.content,
        isPublishNow: false,
        publishDate: parseISO(postInfo.publishDate ?? ""),
      });
      editorRef.current?.setMarkdown(postInfo.content);
    }
  }, [postInfo]);

  const { mutate: createPost } = useCreatePost();

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const content = editorRef.current?.getMarkdown();
    form.setValue("content", content ?? "");
    const validateFileds = formSchema.safeParse({ ...data, content });
    if (validateFileds.success) {
      data.content = content ?? ""; // 将内容设置到 data 对象中
      createPost({
        ...validateFileds.data,
        publishDate: validateFileds.data.publishDate?.toString(),
        categories: validateFileds.data.categories.map((c) => parseInt(c)),
      });
    }
  };

  // const handleDateChange = (date: Date | undefined, isNow?: boolean) => {
  //   if (date) {
  //     if (!isNow) {
  //       const selectedDate = form.getValues("publishDate");
  //       const selectedHour = selectedDate?.getHours();
  //       const selectedMins = selectedDate?.getMinutes();
  //       selectedHour && date.setHours(selectedHour);
  //       selectedMins && date.setMinutes(selectedMins);
  //     }
  //     form.setValue("publishDate", date);
  //   }
  // };

  // const handleTimeChange = (
  //   type: "hour" | "minute" | "ampm",
  //   value: string
  // ) => {
  //   const currentDate = form.getValues("publishDate") || new Date();
  //   let newDate = new Date(currentDate);

  //   if (type === "hour") {
  //     const hour = parseInt(value, 10);
  //     newDate.setHours(newDate.getHours() >= 12 ? hour + 12 : hour);
  //   } else if (type === "minute") {
  //     newDate.setMinutes(parseInt(value, 10));
  //   } else if (type === "ampm") {
  //     const hours = newDate.getHours();
  //     if (value === "AM" && hours >= 12) {
  //       newDate.setHours(hours - 12);
  //     } else if (value === "PM" && hours < 12) {
  //       newDate.setHours(hours + 12);
  //     }
  //   }

  //   form.setValue("publishDate", newDate);
  // };

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
            name="categories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>文章分类</FormLabel>
                <MultiSelect
                  options={formatCategories}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  placeholder="添加文章分类，可以选择多个"
                  variant="inverted"
                  animation={0}
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
              name="publishDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>发布时间</FormLabel>
                  <DateTimePicker
                    defaultDate={field.value}
                    onDateChange={field.onChange}
                  />
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
