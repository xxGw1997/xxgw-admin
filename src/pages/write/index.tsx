import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

const formSchema = z
  .object({
    title: z.string().max(32).min(1, { message: "请输入文章标题" }).trim(),
    desc: z.string().max(50).min(1, { message: "请输入文章描述" }).trim(),
    category: z.array(z.string().min(1)).min(1).nonempty("请选择一个分类"),
    content: z.string().trim(),
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
  const [dateOpen, setDateOpen] = useState(false);

  const editorRef = useRef<MDXEditorMethods>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      desc: "",
      category: [],
      content: "",
      isPublishNow: true,
      date: new Date(),
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const content = editorRef.current?.getMarkdown();
    form.setValue("content", content ?? "");
    const validateFileds = formSchema.safeParse({ ...data, content });
    if (validateFileds.success) {
      data.content = content ?? ""; // 将内容设置到 data 对象中
      console.log(data);
    }
  };

  const handleDateChange = (date: Date | undefined, isNow?: boolean) => {
    if (date) {
      if (!isNow) {
        const selectedDate = form.getValues("date");
        const selectedHour = selectedDate?.getHours();
        const selectedMins = selectedDate?.getMinutes();
        selectedHour && date.setHours(selectedHour);
        selectedMins && date.setMinutes(selectedMins);
      }
      form.setValue("date", date);
    }
  };

  const handleTimeChange = (
    type: "hour" | "minute" | "ampm",
    value: string
  ) => {
    const currentDate = form.getValues("date") || new Date();
    let newDate = new Date(currentDate);

    if (type === "hour") {
      const hour = parseInt(value, 10);
      newDate.setHours(newDate.getHours() >= 12 ? hour + 12 : hour);
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value, 10));
    } else if (type === "ampm") {
      const hours = newDate.getHours();
      if (value === "AM" && hours >= 12) {
        newDate.setHours(hours - 12);
      } else if (value === "PM" && hours < 12) {
        newDate.setHours(hours + 12);
      }
    }

    form.setValue("date", newDate);
  };

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
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>发布时间</FormLabel>
                  <Popover open={dateOpen} onOpenChange={setDateOpen}>
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
                            format(field.value, "yyyy年MM月dd日 HH:mm:ss")
                          ) : (
                            <span>选择时间</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 flex flex-col"
                      align="start"
                    >
                      <div className="flex">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(value) => handleDateChange(value, false)}
                          disabled={(date) => {
                            const threeYearsLater = new Date();
                            threeYearsLater.setFullYear(
                              threeYearsLater.getFullYear() + 3
                            );
                            return date < new Date() || date > threeYearsLater;
                          }}
                          initialFocus
                          fromYear={new Date().getFullYear() - 5}
                          toYear={new Date().getFullYear() + 5}
                        />
                        <div className="flex flex-col">
                          <div className="flex flex-col sm:flex-row sm:h-[330px] divide-y sm:divide-y-0 sm:divide-x">
                            <Separator orientation="vertical" />
                            <ScrollArea className="w-64 sm:w-auto">
                              <div className="flex sm:flex-col p-2">
                                {Array.from({ length: 12 }, (_, i) => i).map(
                                  (hour) => (
                                    <Button
                                      key={hour}
                                      size="icon"
                                      variant={
                                        field.value &&
                                        field.value.getHours() % 12 ===
                                          hour % 12
                                          ? "default"
                                          : "ghost"
                                      }
                                      className="sm:w-full shrink-0 aspect-square"
                                      onClick={() =>
                                        handleTimeChange(
                                          "hour",
                                          hour.toString()
                                        )
                                      }
                                    >
                                      {hour}
                                    </Button>
                                  )
                                )}
                              </div>
                              <ScrollBar
                                orientation="horizontal"
                                className="sm:hidden"
                              />
                            </ScrollArea>
                            <ScrollArea className="w-64 sm:w-auto">
                              <div className="flex sm:flex-col p-2">
                                {Array.from({ length: 60 }, (_, i) => i).map(
                                  (minute) => (
                                    <Button
                                      key={minute}
                                      size="icon"
                                      variant={
                                        field.value &&
                                        field.value.getMinutes() === minute
                                          ? "default"
                                          : "ghost"
                                      }
                                      className="sm:w-full shrink-0 aspect-square"
                                      onClick={() =>
                                        handleTimeChange(
                                          "minute",
                                          minute.toString()
                                        )
                                      }
                                    >
                                      {minute.toString().padStart(2, "0")}
                                    </Button>
                                  )
                                )}
                              </div>
                              <ScrollBar
                                orientation="horizontal"
                                className="sm:hidden"
                              />
                            </ScrollArea>
                            <ScrollArea className="">
                              <div className="flex sm:flex-col p-2">
                                {["AM", "PM"].map((ampm) => (
                                  <Button
                                    key={ampm}
                                    size="icon"
                                    variant={
                                      field.value &&
                                      ((ampm === "AM" &&
                                        field.value.getHours() < 12) ||
                                        (ampm === "PM" &&
                                          field.value.getHours() >= 12))
                                        ? "default"
                                        : "ghost"
                                    }
                                    className="sm:w-full shrink-0 aspect-square"
                                    onClick={() =>
                                      handleTimeChange("ampm", ampm)
                                    }
                                  >
                                    {ampm}
                                  </Button>
                                ))}
                              </div>
                            </ScrollArea>
                          </div>
                        </div>
                      </div>
                      <Separator className="" />
                      <div className="flex justify-between p-2">
                        <Button
                          size="sm"
                          variant="link"
                          onClick={() => handleDateChange(new Date(), true)}
                        >
                          现在
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => setDateOpen(false)}
                        >
                          确定
                        </Button>
                      </div>
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
