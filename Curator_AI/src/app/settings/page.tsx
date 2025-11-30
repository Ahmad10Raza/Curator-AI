import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/server/auth/auth-options"
import { redirect } from "next/navigation"
import { db } from "@/server/db"

import { Shell } from "@/components/layout/Shell"
import { ProfileForm } from "@/components/forms/profile-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
    title: "Settings",
    description: "Manage your account settings",
}

export default async function SettingsPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect("/login")
    }

    const profile = await db.profile.findUnique({
        where: {
            userId: session.user.id,
        },
    })

    const initialData = profile ? {
        displayName: profile.displayName || "",
        timezone: profile.timezone || "UTC",
        experienceLevel: profile.experienceLevel || "BEGINNER",
        interests: profile.interests || "",
    } : undefined

    return (
        <Shell>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your account settings and preferences.
                    </p>
                </div>

                <Tabs defaultValue="profile" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        <TabsTrigger value="account">Account</TabsTrigger>
                    </TabsList>
                    <TabsContent value="profile" className="space-y-4">
                        <div className="rounded-lg border p-4">
                            <div className="mb-4">
                                <h3 className="text-lg font-medium">Profile Information</h3>
                                <p className="text-sm text-muted-foreground">
                                    Update your profile details and public information.
                                </p>
                            </div>
                            <ProfileForm initialData={initialData} />
                        </div>
                    </TabsContent>
                    <TabsContent value="notifications" className="space-y-4">
                        <div className="rounded-lg border p-4">
                            <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between space-x-2">
                                    <Label htmlFor="daily-summary" className="flex flex-col space-y-1">
                                        <span>Daily Summary</span>
                                        <span className="font-normal text-muted-foreground">Receive a daily summary of your learning progress.</span>
                                    </Label>
                                    <Switch id="daily-summary" defaultChecked />
                                </div>
                                <div className="flex items-center justify-between space-x-2">
                                    <Label htmlFor="streak-reminders" className="flex flex-col space-y-1">
                                        <span>Streak Reminders</span>
                                        <span className="font-normal text-muted-foreground">Get notified when you are about to lose your streak.</span>
                                    </Label>
                                    <Switch id="streak-reminders" defaultChecked />
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="account" className="space-y-4">
                        <div className="rounded-lg border border-destructive/50 p-4">
                            <h3 className="text-lg font-medium text-destructive mb-4">Danger Zone</h3>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="font-medium">Delete Account</p>
                                    <p className="text-sm text-muted-foreground">
                                        Permanently delete your account and all of your content.
                                    </p>
                                </div>
                                <Button variant="destructive">Delete Account</Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </Shell>
    )
}
