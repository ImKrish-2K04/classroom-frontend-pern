import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import {
  useBack,
  useList,
  type BaseRecord,
  type HttpError,
} from "@refinedev/core";
import { classSchema, type ClassInputType } from "@/lib/schema";
import { CreateView } from "@/components/refine-ui/views/create-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import UploadWidget from "@/components/upload-widget";
import { Subject, UploadWidgetValue, User } from "@/types";

export type FieldType = {
  onChange: (value: string) => void;
};

const ClassesCreate = () => {
  const back = useBack();

  const form = useForm<BaseRecord, HttpError, ClassInputType>({
    resolver: zodResolver(classSchema),
    refineCoreProps: {
      resource: "classes",
      action: "create",
      redirect: "list",
    },
    defaultValues: {
      name: "",
      description: "",
      subjectId: "",
      teacherId: "",
      capacity: 1,
      status: "active",
      bannerUrl: "",
      bannerCldPubId: "",
      inviteCode: undefined,
      schedules: [],
    },
  });

  const {
    watch,
    formState: { errors },
    control,
    handleSubmit,
  } = form;

  const onSubmit = async (values: ClassInputType) => {
    try {
      await form.refineCore.onFinish(values);
    } catch (error) {
      console.error("Error creating a new class", error);
    }
  };

  const { query: subjectQuery } = useList<Subject>({
    resource: "subjects",
    pagination: {
      pageSize: 100,
    },
  });

  const { query: teacherQuery } = useList<User>({
    resource: "users",
    filters: [
      {
        field: "role",
        operator: "eq",
        value: "teacher",
      },
    ],
    pagination: {
      pageSize: 100,
    },
  });

  const subjects = subjectQuery?.data?.data || [];
  const teachers = teacherQuery?.data?.data || [];

  const subjectsLoading = subjectQuery.isLoading;
  const teachersLoading = teacherQuery.isLoading;

  const bannerPubId = watch("bannerCldPubId");

  const setBannerImage = (file: UploadWidgetValue | null, field: FieldType) => {
    if (file) {
      field.onChange(file.url);
      form.setValue("bannerCldPubId", file.publicId, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      field.onChange("");
      form.setValue("bannerCldPubId", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  return (
    <CreateView>
      <Breadcrumb />
      <h1 className="page-title"></h1>

      <div className="intro-row">
        <p className="text-muted-foreground my-auto">
          Provide the required information below to add a class.
        </p>
        <Button onClick={back}>Go Back</Button>
      </div>

      <Separator />

      <div className="my-4 flex items-center">
        <Card className="class-form-card">
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl font-bold">
              Fill out the Form
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="mt-7">
            <Form {...form}>
              <form
                onSubmit={handleSubmit(onSubmit, (errors) =>
                  console.error("Validation errors:", errors),
                )}
                className="space-y-8"
              >
                <FormField
                  control={control}
                  name="bannerUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Banner Image<span className="text-orange-600">*</span>
                      </FormLabel>

                      <FormControl>
                        <UploadWidget
                          value={
                            field.value
                              ? {
                                  url: field.value,
                                  publicId: bannerPubId ?? "",
                                }
                              : null
                          }
                          onChange={(file: UploadWidgetValue | null) =>
                            setBannerImage(file, field)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                      {errors.bannerCldPubId && !errors.bannerUrl && (
                        <p className="text-destructive text-sm">
                          {errors.bannerCldPubId.message?.toString()}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Class Name<span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Advance mathematics"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid items-start grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* subjects */}
                  <FormField
                    control={control}
                    name="subjectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Subject<span className="text-orange-600">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={subjectsLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {subjectsLoading ? (
                              <SelectItem
                                className="animate-pulse"
                                value="loading"
                              >
                                Loading subjects...
                              </SelectItem>
                            ) : (
                              subjects.map((subject) => (
                                <SelectItem key={subject.id} value={subject.id}>
                                  {subject.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage className="min-h-5" />
                      </FormItem>
                    )}
                  />

                  {/* teachers */}
                  <FormField
                    control={control}
                    name="teacherId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Teacher<span className="text-orange-600">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          defaultValue={field.value?.toString()}
                          disabled={teachersLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a teacher" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {teachersLoading ? (
                              <SelectItem
                                className="animate-pulse"
                                value="loading"
                              >
                                Teachers loading...
                              </SelectItem>
                            ) : (
                              teachers.map((teacher) => (
                                <SelectItem key={teacher.id} value={teacher.id}>
                                  {teacher.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage className="min-h-5" />
                      </FormItem>
                    )}
                  />

                  {/* capacity */}
                  <FormField
                    control={control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Capacity<span className="text-orange-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="no-spinner"
                            value={field.value as number | ""}
                            onBlur={field.onBlur}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? ""
                                  : Number(e.target.value),
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* status */}
                  <FormField
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Status<span className="text-orange-600">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* description */}
                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Description<span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </CreateView>
  );
};

export default ClassesCreate;
