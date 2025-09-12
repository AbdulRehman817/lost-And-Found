import * as React from "react";
import axios from "axios";
import { Header } from "../components/Header";
import { Footer } from "../components/footer";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import {
  Calendar,
  MapPin,
  Tag,
  MessageSquare,
  Heart,
  Info,
  Send,
  Loader2,
  MessageCircle,
  CheckCircle,
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Label } from "../components/ui/label";
import { Link, useParams } from "react-router-dom";

export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = React.useState(null);
  const [comments, setComments] = React.useState([]);
  const [newComment, setNewComment] = React.useState("");
  const [likes, setLikes] = React.useState(0);
  const [isLiked, setIsLiked] = React.useState(false);
  const [requestMessage, setRequestMessage] = React.useState("");
  const [isRequesting, setIsRequesting] = React.useState(false);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = React.useState(false);
  const [requestSent, setRequestSent] = React.useState(false);

  React.useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/feed/${id}`
        );
        console.log(response);
        const data = response.data.data;
        console.log(data);

        setPost({
          id: data?._id,
          title: data?.title,
          status: data?.type === "lost" ? "Lost" : "Found",
          location: data?.location,
          date: new Date(data?.createdAt).toLocaleDateString(),
          imageUrl: data?.imageUrl,
          description: data?.description,
          category: data?.category,
          tags: data?.tags || [],
          poster: {
            name: data?.userId?.name || "Anonymous",
            avatar: data?.userId?.avatar || "https://picsum.photos/seed/10/200",
            email: data?.userId?.email || "",
            phone: data?.userId?.phone || "",
          },
          comments: data?.comments || [],
          likes: data?.likes || 0,
        });

        setComments(data?.comments || []);
        setLikes(data?.likes || 0);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [id]);

  if (!post) return <p className="text-center py-12">Loading item...</p>;

  const handleLike = () => {
    setLikes(isLiked ? likes - 1 : likes + 1);
    setIsLiked(!isLiked);
  };

  const handlePostComment = () => {
    if (!newComment.trim()) return;
    const comment = {
      user: "You",
      avatar: "https://picsum.photos/seed/user/100",
      comment: newComment,
      date: "Just now",
    };
    setComments([...comments, comment]);
    setNewComment("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-12 sm:py-16 bg-muted/40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Image */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden shadow-xl rounded-xl">
                <div className="relative aspect-[4/3] w-full">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="object-cover w-full h-full"
                  />
                  {post.status === "Reunited" && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center text-white p-4 bg-black/30 rounded-lg backdrop-blur-sm">
                        <CheckCircle className="h-16 w-16 mx-auto text-green-400" />
                        <h2 className="text-3xl font-bold font-headline mt-2">
                          Reunited!
                        </h2>
                        <p className="text-green-200">
                          This item has been returned to its owner.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Post Info */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Badge
                      variant={
                        post.status === "Lost" ? "destructive" : "default"
                      }
                      className={cn("text-sm py-1 px-3 shadow-md")}
                    >
                      {post.status}
                    </Badge>
                    <h1 className="font-headline text-3xl font-bold lg:text-4xl mt-2">
                      {post.title}
                    </h1>
                  </div>

                  <div className="space-y-4 text-base">
                    <div className="flex items-start gap-4">
                      <MapPin className="h-6 w-6 mt-1 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">
                          Location
                        </p>
                        <p className="text-muted-foreground">{post.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Calendar className="h-6 w-6 mt-1 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">Date</p>
                        <p className="text-muted-foreground">{post.date}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Tag className="h-6 w-6 mt-1 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">
                          Category
                        </p>
                        <p className="text-muted-foreground">{post.category}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Poster */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={post.poster.avatar} // use actual avatar URL
                        alt={post.poster.name
                          .replace(/\d+/g, "")
                          .replace(/[_\s]+$/, "")}
                      />
                      <AvatarFallback>
                        {post.poster.name.charAt(0)} // fallback to first letter
                        of name
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">
                        {post.poster.name}
                      </p>
                      <p className="text-sm text-muted-foreground">Poster</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Description & Comments */}
            <div className="md:col-span-2 lg:col-span-3 space-y-8">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="font-headline text-2xl font-bold">
                    Description
                  </h2>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {post.description}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {post.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="font-medium"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-6">
                  <h2 className="font-headline text-2xl font-bold flex items-center gap-3">
                    <MessageSquare className="h-6 w-6 text-primary" /> Community
                    Comments
                  </h2>
                  <div className="space-y-6">
                    {comments.map((comment, index) => (
                      <div key={index} className="flex gap-4">
                        <Avatar>
                          <AvatarImage
                            src={comment.avatar}
                            alt={comment.user}
                          />
                          <AvatarFallback>
                            {comment.user.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-foreground">
                              {comment.user}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {comment.date}
                            </p>
                          </div>
                          <p className="text-muted-foreground mt-1">
                            {comment.comment}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarImage
                        src="https://picsum.photos/seed/user/100"
                        alt="Current User"
                      />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <Textarea
                        placeholder="Add a public comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <div className="flex justify-between items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleLike}
                          className="flex items-center gap-2 text-muted-foreground"
                        >
                          <Heart
                            className={cn(
                              "h-4 w-4",
                              isLiked ? "text-red-500 fill-current" : ""
                            )}
                          />
                          <span>{likes}</span>
                        </Button>
                        <Button onClick={handlePostComment}>
                          Post Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
