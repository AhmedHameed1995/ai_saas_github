'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useRefetch from '@/hooks/use-refetch'
import { api } from '@/trpc/react'
import Image from 'next/image'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type FormInput = {
  repoUrl: string
  projectName: string
  githubToken?: string
}

const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>()
  const createProject = api.project.createProject.useMutation()
  const refetch = useRefetch()

  function onSubmit(data: FormInput) {
    // window.alert(JSON.stringify(data,null,2));
    createProject.mutate({
      githubUrl: data.repoUrl,
      name: data.projectName,
      githubToken: data.githubToken
    }, {
      onSuccess: () => {
        toast.success('Project created successfully');
        refetch()
        reset()
      },
      onError: () => {
        toast.error('Failed to create project')
      } 
    })
    return true
  }
  
  return (
    <div className='flex items-center gap-12 h-full justify-center'>
      <Image src='/pcusing.png' className='h-56 w-auto' alt='logo' width={512} height={512} />
      <div>
        <div>
          <h1 className='font-semibold text-2xl'>
            Link your Github Repository
          </h1>
          <p className='text-sm text-muted-foreground'>
            Enter the URL of your repository to link it to Github Saas
          </p>
        </div>
        <div className="h-4"></div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col gap-2'>
              <Input
                type='text'
                id='projectName'
                {...register('projectName', { required: true })}
                className='input'
                placeholder='Project Name'
              />
            </div>
            <div className="h-4"></div>
            <div className='flex flex-col gap-2'>
              <Input
                type='text'
                id='repoUrl'
                {...register('repoUrl', { required: true })}
                className='input'
                placeholder='Repository URL'
              />
            </div>
            <div className="h-4"></div>
            <div className='flex flex-col gap-2'>
              <Input
                type='password'
                id='githubToken'
                {...register('githubToken')}
                className='input'
                placeholder='Github Token'
              />
            </div>
            <div className="h-4"></div>
            <Button type='submit' disabled={createProject.isPending} className='btn btn-primary'>
              Link Repository
            </Button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default CreatePage