import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { MapPin, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

export function ItemCard({
  _id,
  title,
  status,
  type,
  location,
  date,
  imageUrl,
  imageHint,
  userId,
  createdAt,
  showManagement = false,
  onMarkAsReunited,
}) {
  return (
    <Card className="flex py-0 h-full bg-background border border-border flex-col overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Header */}
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Avatar className="h-10 w-10 border">
          <AvatarImage
            src={userId?.profileImage}
            alt={userId?.name}
            className="object-cover"
          />
          <AvatarFallback>
            {userId?.name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-sm leading-tight">
            {" "}
            {userId?.name?.replace(/\d+/g, "").replace(/[_\s]+$/, "")}
          </p>
          <p className="text-xs text-muted-foreground">
            Posted on{" "}
            <span className=" text-muted-foreground font-medium hover:underline">
              {formatDate(createdAt)}
            </span>
          </p>
        </div>

        <Badge
          variant={
            type === "lost"
              ? "destructive"
              : type === "found"
              ? "secondary"
              : "default"
          }
        >
          {type}
        </Badge>
      </CardHeader>

      {/* Image */}
      <CardContent className="p-0 ">
        <Link to={`/feed/${_id}`} className="group block">
          <div className="overflow-hidden px-4">
            <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden">
              <img
                src={imageUrl}
                alt={title}
                className="object-cover w-full h-full rounded-lg transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={imageHint}
              />
              {status === "Reunited" && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <CheckCircle className="h-10 w-10 mx-auto text-green-400" />
                    <p className="font-bold mt-1">Reunited!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Link>
      </CardContent>
      <CardContent className="p-4 mt-[-15px] flex flex-col gap-3 flex-grow">
        <div>
          <h3 className="font-headline mb-[10px] text-lg font-semibold tracking-tight truncate group-hover:text-primary">
            {type}: {title}
          </h3>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0  mb-[8px]" />
            <span className="truncate mb-[8px]">{location}</span>
          </div>

          {showManagement ? (
            <Button
              onClick={onMarkAsReunited}
              disabled={status === "Reunited"}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {status === "Reunited" ? "Reunited!" : "Mark as Reunited"}
            </Button>
          ) : (
            <Button
              asChild
              className="w-full mt-[15px]"
              variant="secondary"
              disabled={status === "Reunited"}
            >
              <Link to={`/feed/${_id}`}>
                {status === "Reunited" ? "View Reunited Item" : "View Details"}
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
      {/* Footer */}
    </Card>
  );
}
