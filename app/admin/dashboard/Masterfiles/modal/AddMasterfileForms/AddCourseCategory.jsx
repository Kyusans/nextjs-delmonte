import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  courseCategoryName: z.string().min(1, 'Course category name is required'),
});

const AddCourseCategory = ({ onSuccess, getData, data }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [existingCategories, setExistingCategories] = useState([]);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setExistingCategories(data.map(item => item.course_categoryName.toLowerCase()));
    }
  }, [data]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseCategoryName: '',
    },
  });

  const addCategory = (values) => {
    const newCategory = values.courseCategoryName.trim();
    if (existingCategories.includes(newCategory.toLowerCase())) {
      toast.error('This category already exists');
      return;
    }
    if (categories.some(cat => cat.toLowerCase() === newCategory.toLowerCase())) {
      toast.error('This category is already in the list');
      return;
    }
    setCategories([...categories, newCategory]);
    form.reset();
  };

  const removeCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const editCategory = (index, newValue) => {
    const trimmedValue = newValue.trim();
    if (existingCategories.includes(trimmedValue.toLowerCase())) {
      toast.error('This category already exists');
      return;
    }
    if (categories.some((cat, i) => i !== index && cat.toLowerCase() === trimmedValue.toLowerCase())) {
      toast.error('This category is already in the list');
      return;
    }
    const newCategories = [...categories];
    newCategories[index] = trimmedValue;
    setCategories(newCategories);
  };

  const onSubmit = async () => {
    if (categories.length === 0) {
      toast.error('Please add at least one category');
      return;
    }
    setIsLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + 'admin.php';
      const formData = new FormData();
      formData.append('operation', 'addCourseCategory');
      formData.append('json', JSON.stringify(categories));

      const res = await axios.post(url, formData);
      console.log("res: ", res);  
      if (res.data === 1) {
        toast.success('Course categories added successfully');
        setCategories([]);
        getData();
        if (onSuccess) onSuccess();
      } else {
        toast.error('Failed to add course categories');
      }
    } catch (error) {
      toast.error('Network error');
      console.error('AddCourseCategory.jsx ~ onSubmit ~ error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(addCategory)} className="space-y-4">
          <FormField
            control={form.control}
            name="courseCategoryName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Category Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter course category name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Add to List</Button>
        </form>
      </Form>
      <Card>
        <CardHeader>
          <CardTitle>Categories to Add</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length > 0 ? (
            <div className="space-y-4">
              <ul className="space-y-2">
                {categories.map((category, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Input
                      value={category}
                      onChange={(e) => editCategory(index, e.target.value)}
                      className="flex-grow"
                    />
                    <Trash2 className="h-5 w-5 cursor-pointer" onClick={() => removeCategory(index)} />
                  </li>
                ))}
              </ul>
              <Button onClick={onSubmit} disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit All Categories'}
              </Button>
            </div>
          ) : (
            <div className="text-center text-gray-500">No categories to add</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCourseCategory;
