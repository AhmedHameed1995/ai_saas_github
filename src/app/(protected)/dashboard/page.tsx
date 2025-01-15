'use client';

import useProject from "@/hooks/use-project";
import { useUser } from "@clerk/nextjs";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import CommitLog from "./commit-log";
import AskQuestionCard from "./ask-question-card";
import MeetingCard from "./meeting-card";
import ArchiveButton from "./archive-button";
import InviteButton from "./invite-button";
import TeamMembers from "./team-members";


const Dashboard = () => {
    const { project } = useProject();
    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-y-4">
                {/* Github Link */}
                <div className="w-fit rounded-md bg-primary px-4 py-3">
                    <div className="flex items-center">
                        <Github className="size-6 text-white" />
                        <div className="ml-2">
                            <p className="text-sm font-medium text-white">
                                This project is linked to {''}
                                <Link href={project?.githubUrl ?? ""} className="inline-flex items-center text-white/80 hover:underline">
                                    {project?.name} - {project?.githubUrl}
                                    <ExternalLink className="size-4 ml-1" />
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="h-4"></div>
                <div className="flex items-center gap-4">
                    <TeamMembers />
                    <InviteButton />
                    <ArchiveButton />
                </div>
            </div>
            <div className="mt-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
                    <AskQuestionCard />
                    <MeetingCard />
                </div>
            </div> 
            <div className="mt-8">
                ...
            </div>
            <CommitLog />
        </div>
    );
}

export default Dashboard