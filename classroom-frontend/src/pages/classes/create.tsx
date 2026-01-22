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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
      status: 'active' as const,
      name: '',
      description: '',
      subjectId: 0,
      teacherId: '',
      capacity: 0,
      bannerUrl: '',
      bannerCldPubId: '',
      inviteCode: ''
    }
  });

  const { saveButtonProps } = form;
  return (
    <CreateView className='class-view'>
      <Breadcrumb/>

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

        <Separator/>

        <CardContent className='mt-7'>
          <Form {...form}>
            <form onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit((values) => {
                console.log('Form values:', values);
                // Refine will handle the submission via saveButtonProps
              })(e);
            }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Class Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Introduction to Computer Science" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Capacity */}
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g., 30" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter a detailed description of the class..."
                        className="min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subject */}
                <FormField
                  control={form.control}
                  name="subjectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))}
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

                {/* Teacher */}
                <FormField
                  control={form.control}
                  name="teacherId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teacher</FormLabel>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
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

                {/* Invite Code (Optional) */}
                <FormField
                  control={form.control}
                  name="inviteCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invite Code (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Auto-generated if left empty" {...field} />
                      </FormControl>
                      <FormDescription>
                        Leave empty to auto-generate an invite code
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Banner URL */}
              <FormField
                control={form.control}
                name="bannerUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner URL</FormLabel>
                    <FormControl>
                      <Input 
                        type="url" 
                        placeholder="https://example.com/banner.jpg" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      URL of the class banner image
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Banner Cloudinary Public ID */}
              <FormField
                control={form.control}
                name="bannerCldPubId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner Cloudinary Public ID</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="cloudinary_public_id" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Cloudinary public ID for the banner image
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={back}>
                  Cancel
                </Button>
                <Button type="submit" {...saveButtonProps}>
                  {saveButtonProps.disabled ? "Creating..." : "Create Class"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
    </CreateView>
  )
}

export default Create;