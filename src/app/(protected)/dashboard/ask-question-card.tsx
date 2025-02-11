'use client'
import MDEditor from '@uiw/react-md-editor'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import useProject from '@/hooks/use-project'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import React from 'react'
import Image from 'next/image';
import { askQuestion } from './actions';
import { readStreamableValue } from 'ai/rsc';
import CodeReferences from './code-reference';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import useRefetch from '@/hooks/use-refetch';

const AskQuestionCard = () => {
    const { project } = useProject()
    const [question, setQuestion] = React.useState('')
    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [filesReferences, setFilesReferences] = React.useState<{ fileName: string; soruceCode: string; summary:string }[]>([])
    const [output, setOutput] = React.useState('')
    const [answer, setAnswer] = React.useState('')
    const saveAnswer = api.project.saveAnswer.useMutation()

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setAnswer('')
        setFilesReferences([])
        e.preventDefault()
        if(!project?.id) return
        setLoading(true)

        const { output, filesReferences } = await askQuestion(question, project.id)
        setOpen(true)
        setFilesReferences(filesReferences)
        
        for await (const delta of readStreamableValue(output)) {
            if(delta) {
                setAnswer(ans => ans + delta)
            }
        }
        setLoading(false)
    }
    
    const refetch = useRefetch();

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className='sm:max-w-[90vh] block'>
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            <DialogTitle>
                                <Image src='/logo.svg' alt='' width={40} height={40} />
                            </DialogTitle>
                            <Button disabled={saveAnswer.isPending} variant={'outline'} onClick={() => 
                                saveAnswer.mutate({
                                    projectId: project!.id,
                                    question,
                                    answer,
                                    filesReferences
                                }, {
                                    onSuccess: () => {
                                        toast.success('Answer saved!')
                                        refetch()
                                    },
                                    onError: () => {
                                        toast.error('Failed to save answer!')
                                    }
                                })
                            }>
                                Save Answer
                            </Button>
                        </div>
                    </DialogHeader>

                    <MDEditor.Markdown source={answer} className='max-w-[70vw] !h-full max-h-[40vh] overflow-auto' />
                    <div className="h-4"></div>
                    <CodeReferences filesReferences={filesReferences} />
                    <div className="h-4"></div>
                    <Button type="button" onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </DialogContent>
            </Dialog>
            <Card className='relatuve col-span-3'>
                <CardHeader>
                    <CardTitle>Ask a Question</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit}>
                        <Textarea placeholder='Which file should i edit to change the homepage?' value={question} onChange={e => setQuestion(e.target.value)} />
                        <div className="h-4"></div>
                        <Button type='submit' disable={loading}>
                            Ask Question
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

export default AskQuestionCard