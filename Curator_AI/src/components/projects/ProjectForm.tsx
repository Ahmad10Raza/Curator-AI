"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

const projectSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    techStack: z.string().min(1, "Tech stack is required"), // Comma separated string for input
    githubUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    demoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    difficulty: z.string().optional(),
    isPublic: z.boolean().default(true),
})

type ProjectFormValues = z.infer<typeof projectSchema>

interface ProjectFormProps {
    initialData?: Partial<ProjectFormValues> & { id?: string }
}

export function ProjectForm({ initialData }: ProjectFormProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            techStack: initialData?.techStack || "",
            githubUrl: initialData?.githubUrl || "",
            demoUrl: initialData?.demoUrl || "",
            difficulty: initialData?.difficulty || "Beginner",
            isPublic: initialData?.isPublic ?? true,
        },
    })

    async function onSubmit(data: ProjectFormValues) {
        setLoading(true)
        try {
            const payload = {
                ...data,
                techStack: data.techStack.split(",").map(t => t.trim()).filter(Boolean),
            }

            const url = initialData?.id
                ? `/api/projects/${initialData.id}`
                : "/api/projects"

            const method = initialData?.id ? "PATCH" : "POST"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!res.ok) throw new Error("Failed to save project")

            toast({
                title: "Success",
                description: "Project saved successfully.",
            })

            router.push("/projects")
            router.refresh()
        } catch {
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Project Title</FormLabel>
                            <FormControl>
                                <Input placeholder="My Awesome App" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Describe what you built..."
                                    className="min-h-[100px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="techStack"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tech Stack</FormLabel>
                                <FormControl>
                                    <Input placeholder="React, Node.js, TypeScript" {...field} />
                                </FormControl>
                                <FormDescription>Comma separated list of technologies</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="difficulty"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Difficulty</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select difficulty" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                                        <SelectItem value="Advanced">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="githubUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>GitHub URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://github.com/username/repo" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="demoUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Demo URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://my-app.vercel.app" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="isPublic"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Public Project</FormLabel>
                                <FormDescription>
                                    Show this project on your public portfolio profile.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Project
                    </Button>
                </div>
            </form>
        </Form>
    )
}
