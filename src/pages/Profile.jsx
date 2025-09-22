import { Header } from "../components/Header";
import { Footer } from "../components/footer";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { ItemCard } from "../components/item-card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Switch } from "../components/ui/switch";
import { Textarea } from "../components/ui/textarea";
import {
  Edit,
  Mail,
  Phone,
  User,
  FileText,
  LayoutGrid,
  PlusCircle,
  Inbox,
  Settings,
  Bell,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import * as React from "react";
import RequestsList from "../components/request-list";
import { useParams, useSearchParams } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";

// ✅ Example stats (replace with backend if needed)
const userStats = {
  posts: 3,
  activeRequests: 2,
  itemsReunited: 1,
};

export default function ProfilePage() {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "dashboard";
  const { isSignedIn, user } = useUser();
  const { id } = useParams();
  const { getToken } = useAuth();

  const [bio, setBio] = useState(user?.publicMetadata?.bio || "");
  const [phone, setPhone] = useState(user?.publicMetadata?.phone || "");
  const [postDetails, setPostDetails] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeRequests, setActiveRequets] = useState([]);
  // const [acceptedRequests,setAcceptedRequests]=useState([]);
  const fetchAllAcceptedRequets = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(
        "http://localhost:3000/api/v1/connections/getAcceptedRequests",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = res.data.data;
      setActiveRequets(data);
      console.log("accepted request ", data);
    } catch (error) {
      console.error("❌ Error fetching requests:", error);
    }
  };

  const getAllPendingRequests = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(
        "http://localhost:3000/api/v1/connections/getPendingRequests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data.data || [];
      setActiveRequets(data);
      console.log("pending request", data);
    } catch (error) {
      console.error("error", error);
    }
  };

  // ✅ Fetch logged-in user posts
  const getAllUserPosts = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(
        `http://localhost:3000/api/v1/getUserPosts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data.data || [];
      console.log("data", data);
      setPostDetails(data);
    } catch (error) {
      console.error("❌ Error fetching posts:", error);
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      getAllUserPosts();
      getAllPendingRequests();
      fetchAllAcceptedRequets();
    }
  }, [id, isSignedIn]);

  // ✅ Update profile
  const handleProfileChange = async () => {
    try {
      await fetch("http://localhost:3000/api/v1/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, phone }),
      });
      alert("✅ Profile updated!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("❌ Failed to update profile");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#3b82f6]/11">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <Tabs defaultValue={defaultTab} className="w-full">
            {/* ✅ Tabs Navigation */}
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 bg-background border rounded-lg">
              <TabsTrigger value="dashboard">
                <LayoutGrid className="mr-2 h-4 w-4" /> Dashboard
              </TabsTrigger>
              <TabsTrigger value="posts">
                <FileText className="mr-2 h-4 w-4" /> My Posts
              </TabsTrigger>
              <TabsTrigger value="requests">
                <Inbox className="mr-2 h-4 w-4" /> Requests
              </TabsTrigger>
              <TabsTrigger value="profile">
                <User className="mr-2 h-4 w-4" /> My Profile
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </TabsTrigger>
            </TabsList>

            <div className="mt-8">
              {/* Dashboard Tab */}
              <TabsContent value="dashboard">
                <Card className="bg-background">
                  <CardHeader>
                    <CardTitle className="font-headline text-3xl">
                      Welcome back, {user?.username || "User"}!
                    </CardTitle>
                    <CardDescription>
                      Here's a summary of your activity on Reunite.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-background">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">
                            Total Posts
                          </CardTitle>
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {userStats.posts}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            items you've listed
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-background">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">
                            Pending Requests
                          </CardTitle>
                          <Inbox className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {activeRequests.length}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            requests needing your attention
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-background">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">
                            Items Reunited
                          </CardTitle>
                          <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            +{userStats.itemsReunited}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            successful reunifications
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="flex justify-start">
                      <Button className="bg-[#3b82f6]">
                        <a href="/create" className="flex items-center">
                          <PlusCircle className="mr-2 h-4 w-4" /> Post a New
                          Item
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card className="bg-background">
                  <CardHeader>
                    <CardTitle className="font-headline flex justify-between items-center text-2xl">
                      <span>User Profile</span>
                      <Button
                        variant={isEditing ? "default" : "outline"}
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        {isEditing ? (
                          "Cancel"
                        ) : (
                          <>
                            <Edit className="mr-2 h-4 w-4" /> Edit Profile
                          </>
                        )}
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      Manage your public profile and contact information.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-4">
                        <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                          <AvatarImage
                            src={user?.imageUrl}
                            alt={user?.username}
                          />
                          <AvatarFallback>
                            {user?.username?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      {isEditing ? (
                        <Input
                          name="name"
                          value={user?.username}
                          className="text-2xl font-bold font-headline text-center max-w-sm mx-auto"
                        />
                      ) : (
                        <h2 className="font-headline text-3xl font-bold">
                          {user?.username}
                        </h2>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="flex items-center gap-2"
                        >
                          <Mail className="h-4 w-4" /> Email
                        </Label>
                        <Input
                          id="email"
                          value={user?.primaryEmailAddress?.emailAddress || ""}
                          readOnly
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="flex items-center gap-2"
                        >
                          <Phone className="h-4 w-4" /> Phone Number
                        </Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          readOnly={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" /> Bio
                      </Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="min-h-[100px]"
                        readOnly={!isEditing}
                      />
                    </div>

                    {isEditing && (
                      <div className="flex justify-end">
                        <Button onClick={handleProfileChange}>
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Posts Tab */}
              <TabsContent value="posts">
                <Card className="bg-background">
                  <CardHeader className="bg-background">
                    <div className="flex justify-between items-center">
                      <CardTitle className="font-headline text-2xl">
                        Your Posts
                      </CardTitle>
                      <Button className="bg-[#3b82f6]">
                        <a href="/create" className="flex items-center">
                          <PlusCircle className="mr-2 h-4 w-4" /> Post New Item
                        </a>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="bg-background">
                    {postDetails.length > 0 ? (
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                        {postDetails.map((item) => (
                          <ItemCard key={item._id} {...item} showManagement />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-black border-2 border-dashed rounded-lg flex flex-col items-center gap-4">
                        <FileText className="h-10 w-10 text-muted-foreground" />
                        <p className="font-semibold">
                          You haven't posted any items yet.
                        </p>
                        <Button>
                          <a href="/create">Post an Item</a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Requests Tab */}
              <TabsContent value="requests">
                <RequestsList requests={activeRequests} />
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <Card className="bg-background">
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl">
                      Settings
                    </CardTitle>
                    <CardDescription>
                      Manage your account and notification preferences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Bell className="h-5 w-5" /> Notifications
                    </h3>

                    <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <Label
                          htmlFor="email-notifications"
                          className="text-base"
                        >
                          Email Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about comments on your posts and new
                          contact requests.
                        </p>
                      </div>
                      <Switch id="email-notifications" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <Label
                          htmlFor="match-notifications"
                          className="text-base"
                        >
                          Item Match Alerts
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified about potential matches for your lost
                          items.
                        </p>
                      </div>
                      <Switch id="match-notifications" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <Label htmlFor="newsletter" className="text-base">
                          Newsletter
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive occasional updates and news from Reunite.
                        </p>
                      </div>
                      <Switch id="newsletter" />
                    </div>

                    <div className="flex justify-end">
                      <Button className="bg-[#3b82f6]">Save Preferences</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
