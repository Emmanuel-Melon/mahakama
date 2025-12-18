import { Mail, Phone, MapPin, User, Calendar, Shield, Edit2, X } from "lucide-react";
import { BorderedBox } from "~/components/ui/bordered-box";
import { Button } from "~/components/ui/button";
import { HandDrawnAvatar } from "~/components/ui/hand-drawn-avatar";
import { formatDate } from "~/utils/time";
import { PageLayout } from "~/layouts/page-layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { UserProfileForm } from "~/feature/users/components/UserProfileForm";
import { useState } from "react";

import type { components } from "~/lib/api/generated/api.types";
export type User = components["schemas"]["User"];

interface ProfileScreenProps {
    user: User;
    updateMutation: any;
}

export const ProfileScreen = ({ user, updateMutation }: ProfileScreenProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTab, setEditTab] = useState("personal");

    function calculateProfileCompletion(user: User | null): number {
        if (!user) return 0;
        const fields = [
            user.name,
            user.phoneNumber,
            user.city,
            user.country,
            user.occupation,
            user.bio
        ];
        const completedFields = fields.filter(field => field && field.trim() !== "").length;
        return Math.round((completedFields / fields.length) * 100);
    }

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleFormSubmit = () => {
        setIsEditing(false);
    };

    return (
        <PageLayout>
            <div>
                {isEditing ? (
                    <BorderedBox className="p-6 mb-8" variant="decorated" label="Edit Profile">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Edit Your Profile</h2>
                            <Button
                                onClick={handleCancel}
                                variant="outline"
                                size="sm"
                                className="border-2 border-gray-900"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>
                        </div>
                        <Tabs defaultValue={editTab}>
                            <TabsList>
                                <TabsTrigger value="personal">Personal Information</TabsTrigger>
                                <TabsTrigger value="account">Account Details</TabsTrigger>
                            </TabsList>
                            <TabsContent value="personal" className="space-y-6">
                                <UserProfileForm
                                    user={user}
                                    updateMutation={updateMutation}
                                    mode="edit"
                                    onSubmit={handleFormSubmit}
                                />
                            </TabsContent>
                            <TabsContent value="account" className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <BorderedBox className="p-6" variant="decorated" label="Account Status">
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Account Status</p>
                                                <p className="mt-1 text-gray-900">
                                                    {user?.isOnboarded ? 'Onboarded' : 'Pending Onboarding'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Account Type</p>
                                                <p className="mt-1 text-gray-900">
                                                    {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Member Since</p>
                                                <p className="mt-1 text-gray-900">
                                                    {formatDate(user?.createdAt || "")}
                                                </p>
                                            </div>
                                        </div>
                                    </BorderedBox>
                                    <BorderedBox className="p-6" variant="decorated" label="Activity">
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                                                <p className="mt-1 text-gray-900">
                                                    {formatDate(user?.updatedAt || "")}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Profile Completion</p>
                                                <div className="mt-2">
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-yellow-400 h-2 rounded-full"
                                                            style={{ width: `${calculateProfileCompletion(user)}%` }}
                                                        ></div>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">{calculateProfileCompletion(user)}% Complete</p>
                                                </div>
                                            </div>
                                        </div>
                                    </BorderedBox>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </BorderedBox>
                ) : (
                    <Tabs defaultValue="personal">
                        <TabsList>
                            <TabsTrigger value="personal">Personal Information</TabsTrigger>
                            <TabsTrigger value="account">Account Details</TabsTrigger>
                        </TabsList>
                        <TabsContent value="personal" className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-shrink-0">
                                    <div className="relative">
                                        <HandDrawnAvatar
                                            name={user?.name || user?.email || ""}
                                            size="lg"
                                            className="h-32 w-32 text-4xl"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                                <User className="h-6 w-6 text-blue-600" />
                                                {user?.name || user?.email || ""}
                                            </h1>
                                            <p className="text-gray-600 mt-1 flex items-center gap-2">
                                                <Shield className="h-4 w-4 text-gray-400" />
                                                {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User"} Account
                                            </p>
                                        </div>
                                        <Button
                                            onClick={() => {
                                                setIsEditing(true);
                                                setEditTab("personal");
                                            }}
                                            variant="outline"
                                            size="sm"
                                            className="border-2 border-gray-900"
                                        >
                                            <Edit2 className="h-4 w-4 mr-2" />
                                            Edit Profile
                                        </Button>
                                    </div>
                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Mail className="h-5 w-5 text-blue-500" />
                                            <span>{user?.email || ""}</span>
                                        </div>
                                        {user?.phoneNumber && (
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <Phone className="h-5 w-5 text-blue-500" />
                                                <span>{user?.phoneNumber || ""}</span>
                                            </div>
                                        )}
                                        {(user?.city || user?.country) && (
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <MapPin className="h-5 w-5 text-blue-500" />
                                                <span>{[user?.city, user?.country].filter(Boolean).join(', ')}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                            <Calendar className="h-4 w-4" />
                                            <span>Member since {formatDate(user?.createdAt || "")}</span>
                                        </div>
                                    </div>
                                    {user?.bio && (
                                        <div className="mt-6 pt-6 border-t border-gray-200">
                                            <h3 className="text-sm font-medium text-gray-500 mb-2">About</h3>
                                            <p className="text-gray-700">{user.bio}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="account" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <BorderedBox className="p-6" variant="decorated" label="Account Status">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Account Status</p>
                                            <p className="mt-1 text-gray-900">
                                                {user?.isOnboarded ? 'Onboarded' : 'Pending Onboarding'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Account Type</p>
                                            <p className="mt-1 text-gray-900">
                                                {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Member Since</p>
                                            <p className="mt-1 text-gray-900">
                                                {formatDate(user?.createdAt || "")}
                                            </p>
                                        </div>
                                    </div>
                                </BorderedBox>
                                <BorderedBox className="p-6" variant="decorated" label="Activity">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Last Updated</p>
                                            <p className="mt-1 text-gray-900">
                                                {formatDate(user?.updatedAt || "")}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Profile Completion</p>
                                            <div className="mt-2">
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-yellow-400 h-2 rounded-full"
                                                        style={{ width: `${calculateProfileCompletion(user)}%` }}
                                                    ></div>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">{calculateProfileCompletion(user)}% Complete</p>
                                            </div>
                                        </div>
                                    </div>
                                </BorderedBox>
                            </div>
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </PageLayout>
    );
}

