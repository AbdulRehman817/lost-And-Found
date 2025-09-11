import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Calendar, MapPin, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

export function ItemCard({
  id,
  title,
  status,
  location,
  date,
  imageUrl,
  imageHint,
  user,
  showManagement = false,
  onMarkAsReunited,
}) {
  return (
    <Card className="flex h-full bg-background flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-4">
        {user ? (
          <>
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm leading-tight">{user.name}</p>
              <p className="text-xs text-muted-foreground">
                Posted on {new Date(date).toLocaleDateString()}
              </p>
            </div>
          </>
        ) : (
          <div className="h-10 w-10" /> // placeholder
        )}
        <Badge
          variant={
            status === "Lost"
              ? "destructive"
              : status === "Found"
              ? "secondary"
              : "default"
          }
          className={cn("font-semibold shadow-md ml-auto", {
            "bg-green-100 text-green-800 border-green-200 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-200 dark:border-green-800":
              status === "Reunited",
          })}
        >
          {status === "Reunited" && <CheckCircle className="mr-1 h-3 w-3" />}
          {status}
        </Badge>
      </CardHeader>

      <CardContent className="p-0">
        <Link href={`/item/${id}`} className="group block">
          <div className="overflow-hidden px-4">
            <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden">
              <img
                src={imageUrl}
                alt={title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
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
          <div className="p-4 space-y-2">
            <h3 className="font-headline text-lg font-semibold tracking-tight truncate group-hover:text-primary">
              {title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          </div>
        </Link>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
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
            className="w-full"
            variant="secondary"
            disabled={status === "Reunited"}
          >
            <Link href={`/item/${id}`}>
              {status === "Reunited" ? "View Reunited Item" : "View Details"}
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
