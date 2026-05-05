import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useCreate, useGetIdentity, useList, type HttpError } from "@refinedev/core";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { CreateView } from "@/components/refine-ui/views/create-view";
import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ClassDetails, User } from "@/types";

const enrollSchema = z.object({
  classId: z.coerce.number().min(1, "Class is required"),
});

type EnrollFormValues = z.infer<typeof enrollSchema>;

const EnrollmentsCreate = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<User>();
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);

  const {
    mutateAsync: createEnrollment,
    mutation: { isPending },
  } = useCreate();

  const { query: classesQuery } = useList<ClassDetails>({
    resource: "classes",
    pagination: {
      pageSize: 100,
    },
  });

  const classes = classesQuery.data?.data ?? [];
  const classesLoading = classesQuery.isLoading;

  const form = useForm<EnrollFormValues>({
    resolver: zodResolver(enrollSchema),
    defaultValues: {
      classId: 0,
    },
  });

  const selectedClassId = form.watch("classId");

  useEffect(() => {
    setEnrollmentError(null);
  }, [selectedClassId]);

  const onSubmit = async (values: EnrollFormValues) => {
    if (!currentUser?.id) return;

    try {
      setEnrollmentError(null);
      const response = await createEnrollment({
        resource: "enrollments",
        values: {
          classId: values.classId,
          studentId: currentUser.id,
        },
        errorNotification: (error) => {
          if ((error as HttpError)?.statusCode === 409) {
            return false; // Disable global notification for conflict
          }
          return {
            message: error?.message || "Failed to create enrollment",
            type: "error",
          };
        },
      });

      navigate("/enrollments/confirm", {
        state: {
          enrollment: response?.data,
        },
      });
    } catch (error: any) {
      if (error?.statusCode === 409) {
        setEnrollmentError("You are already enrolled in this class.");
      }
      console.error("Enrollment error:", error);
    }
  };

  const isSubmitDisabled =
    isPending ||
    classesLoading ||
    !currentUser?.id ||
    !classes.length ||
    !selectedClassId;

  return (
    <CreateView className="class-view">
      <Breadcrumb />

      <h1 className="page-title">Enroll in a Class</h1>
      <div className="intro-row">
        <p>Select a class to enroll as the current user.</p>
      </div>

      <Separator />

      <div className="my-4 flex items-center">
        <Card className="class-form-card">
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">
              Enrollment Form
            </CardTitle>
          </CardHeader>

          <Separator />

          <CardContent className="mt-7">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="classId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Class <span className="text-orange-600">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value ? String(field.value) : ""}
                        disabled={classesLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a class" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {classes.map((classItem) => (
                            <SelectItem
                              key={classItem.id}
                              value={String(classItem.id)}
                            >
                              {classItem.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Student</FormLabel>
                  <FormControl>
                    <Input
                      value={currentUser?.email ?? "Not signed in"}
                      readOnly
                    />
                  </FormControl>
                </FormItem>

                {enrollmentError && (
                  <Alert variant="destructive" className="bg-orange-50 border-orange-200 text-orange-900">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <AlertTitle>Notice</AlertTitle>
                    <AlertDescription>
                      {enrollmentError}
                    </AlertDescription>
                  </Alert>
                )}

                <Button type="submit" size="lg" disabled={isSubmitDisabled}>
                  {isPending ? "Enrolling..." : "Enroll"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </CreateView>
  );
};

export default EnrollmentsCreate;