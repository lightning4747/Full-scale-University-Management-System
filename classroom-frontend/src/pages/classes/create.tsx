import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb';
import { CreateView } from '@/components/refine-ui/views/create-view';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useBack } from '@refinedev/core';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "@refinedev/react-hook-form"
import React from 'react'
import { classSchema } from '@/lib/schema';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { teachers, subjects } from '@/constants';

const Create = () => {
  const back = useBack();

  const form = useForm({
    resolver: zodResolver(classSchema),
    refineCoreProps: {
      resource: 'class',
      action: 'create'
    },
    defaultValues: {
      name: '',
      description: '',
      subjectId: 0,
      teacherId: '',
      capacity: 0,
      status: 'active' as const,
      bannerUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      bannerCldPubId: 'default-banner'
    }
  });

  const { handleSubmit, control, formState: { isSubmitting } } = form;

  const onSubmit = function onSubmit(values: z.infer<typeof classSchema>) {
    try {
      console.log(values);
    }
    catch (e) {
      console.error("Error creating class", e);
    }

  }
  return (
    <CreateView className='class-view'>
      <Breadcrumb />

      <h1 className='title-page'>Create a page</h1>

      <div className='intro-row'>
        <p>Provide the required information given below to add a class.</p>
        <Button onClick={back}>Go back </Button>
      </div>
      <Separator></Separator>

      <div className='my-4 flex items-center'>
        <Card className='class-form-card'>
          <CardHeader className='relative z-10'>
            <CardTitle className='text-2xl pb-10 font-bold'>
              Fill out the form
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Separator />

      <CardContent className='mt-7'>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className='space-y-5'>
              <Label>
                Banner Image <span className='text-orange-600'>*</span>
              </Label>

              <p>Upload Image widget</p>
            </div>
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Name <span className='text-orange-600'>*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Introduction to Computer - section A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description <span className='text-orange-600'>*</span></FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a brief description of the class..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid sm:grid-cols-2 gap-4'>
              <FormField
                control={control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject <span className='text-orange-600'>*</span></FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id.toString()}>
                            {subject.name} ({subject.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="teacherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teacher <span className='text-orange-600'>*</span></FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a teacher" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid sm:grid-cols-2 gap-4'>
              <FormField
                control={control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity <span className='text-orange-600'>*</span></FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Maximum number of students"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status <span className='text-orange-600'>*</span></FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
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
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={back}>
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </CreateView>
  )
}

export default Create;