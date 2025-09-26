'use client'
import { useState } from 'react';
import GradientButton from '../GradientButton';
import { Project } from '@/interfaces';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProjectSchema } from '@/lib/schemas/schema';
import { useUser } from '@clerk/nextjs';
import { CreateProject } from '@/lib/actions/projects.actions';
import { toast } from 'sonner';
import { redirect, useRouter } from 'next/navigation';



interface FormData {
  name: string;
  description: string;
}

export default function NewProjectForm() {
  const [formData, setFormData] = useState<Project>({
    user_id: '',
    name: '',
    description: ''
  });
  const {register, handleSubmit, formState} = useForm({
    resolver: zodResolver(ProjectSchema)
  })
  const {errors, isSubmitting} = formState
  const router = useRouter()
  const {user} = useUser()

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({
  //     ...prev,
  //     [name]: value
  //   }));
    
  //   // Clear error when user starts typing
  //   if (errors[name as keyof FormData]) {
  //     setErrors(prev => ({
  //       ...prev,
  //       [name]: undefined
  //     }));
  //   }
  // };

  // const validateForm = (): boolean => {
  //   const newErrors: Partial<FormData> = {};
    
  //   if (!formData.name.trim()) {
  //     newErrors.name = 'Name is required';
  //   } else if (formData.name.trim().length < 2) {
  //     newErrors.name = 'Name must be at least 2 characters';
  //   }
    
  //   if (!formData.description.trim()) {
  //     newErrors.description = 'Description is required';
  //   } else if (formData.description.trim().length < 10) {
  //     newErrors.description = 'Description must be at least 10 characters';
  //   }
    
  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   if (!validateForm()) return;
    
  //   setIsSubmitting(true);
    
  //   // Simulate API call
  //   await new Promise(resolve => setTimeout(resolve, 1500));
    
  //   console.log('Form submitted:', formData);
  //   alert('Form submitted successfully!');
    
  //   // Reset form
  //   setFormData({ name: '', description: '' });
  //   setIsSubmitting(false);
  // };
  const onSubmit = async (data : Project)=> {
    if(user?.id){
      data.user_id = user.id
      try{
      const {id} = await CreateProject(data)
      router.push(`/project/${id}`)
      }
      catch(err) {
        console.log(err)
        toast('Could not create Project')
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#07070C] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-950 rounded-lg shadow-xl p-8 border border-gray-700">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Create Project</h2>
            <p className="text-gray-400">Fill in your details below</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                {...register("name")}
                className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors duration-200 ${
                  errors.name 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="Enter your name"
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-400">{String(errors.name)}</p>
              )}
            </div>

            {/* Description Input */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                {...register("description")}
                rows={4}
                className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors duration-200 resize-none ${
                  errors.description 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="Tell us about your project..."
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-400">{String(errors.description)}</p>
              )}
            </div>
          <div className='w-full flex'>
            {/* Submit Button */}
            <GradientButton 
              type="submit"
              disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                'Submit'
              )}
            </GradientButton>
            </div>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
}