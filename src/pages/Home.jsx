import * as React from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Search,
  FilePlus2,
  MessageCircle,
  Handshake,
  PlusCircle,
  Star,
  Github,
  Linkedin,
  Mail,
  ArrowRight,
} from "lucide-react";
import { FeaturedItems } from "../components/featured-items";
import { Card, CardContent } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

const featuredItems = [
  {
    id: "2",
    title: "Found: iPhone 14 Pro",
    status: "Found",
    imageUrl: "https://picsum.photos/seed/2/800/600",
    imageHint: "phone",
  },
  {
    id: "3",
    title: "Lost: Golden Retriever 'Buddy'",
    status: "Lost",
    imageUrl: "https://picsum.photos/seed/3/800/600",
    imageHint: "dog",
  },
  {
    id: "4",
    title: "Found: Set of Keys",
    status: "Found",
    imageUrl: "https://picsum.photos/seed/4/800/600",
    imageHint: "keys",
  },
  {
    id: "5",
    title: "Lost: Blue Jansport Backpack",
    status: "Lost",
    imageUrl: "https://picsum.photos/seed/5/800/600",
    imageHint: "backpack",
  },
];

const testimonials = [
  {
    quote:
      "I never thought I'd see my wallet again after leaving it on the subway. Thanks to Reunite, I had it back in less than 24 hours! This platform is incredible.",
    name: "Sarah Johnson",
    role: "Reunited with her Wallet",
    avatar: "https://picsum.photos/seed/t1/100",
  },
  {
    quote:
      "Finding a lost dog was stressful, but posting on Reunite made it so easy. The owner contacted me within hours. It felt amazing to help bring 'Max' back home safely.",
    name: "Michael Chen",
    role: "Helped 'Max' the dog find his way home",
    avatar: "https://picsum.photos/seed/t2/100",
  },
  {
    quote:
      "The messaging system is secure and easy to use. I was able to verify the owner of a laptop I found and arrange a safe meetup. Highly recommend this service.",
    name: "Jessica Rodriguez",
    role: "Reunited a laptop with its owner",
    avatar: "https://picsum.photos/seed/t3/100",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="w-full py-20 md:py-28 lg:py-36 bg-muted/30 border-b">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none font-headline text-foreground">
                Find What You've Lost
              </h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Our community-powered platform helps you reconnect with your
                lost items and report found ones with ease. Let's bring things
                back together.
              </p>
              <div className="w-full max-w-xl space-y-4 pt-6">
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-[#3b82f6] hover:bg-[#3b82f6]/90"
                  >
                    <Link to="/feed">Browse Lost & Found</Link>
                  </Button>
                  <Button variant="secondary" asChild size="lg">
                    <Link to="/create">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Report an Item
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 lg:py-28">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-semibold text-foreground">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  A Simple Path to Reunion
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We've streamlined the process to make finding your lost items
                  as easy as possible.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-12 py-12 lg:grid-cols-3">
              <div className="grid gap-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <FilePlus2 className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-headline">
                    1. Create a Post
                  </h3>
                  <p className="text-muted-foreground">
                    Quickly create a detailed post for your lost or found item.
                    Add photos, a description, location, and date to help others
                    identify it.
                  </p>
                </div>
              </div>
              <div className="grid gap-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-headline">
                    2. Connect & Verify
                  </h3>
                  <p className="text-muted-foreground">
                    Communicate safely through our secure messaging system.
                    Users can send contact requests to verify ownership before
                    meeting.
                  </p>
                </div>
              </div>
              <div className="grid gap-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Handshake className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-headline">
                    3. Reunite
                  </h3>
                  <p className="text-muted-foreground">
                    Coordinate a safe meetup to return the item to its rightful
                    owner. Mark the item as "Reunited" to celebrate the success!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 lg:py-28 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                Featured Items
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Take a look at some of the items recently reported by our
                community.
              </p>
            </div>
            <div className="mx-auto max-w-4xl py-12">
              <FeaturedItems items={featuredItems} />
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 lg:py-28">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-semibold text-foreground">
                  Community Voices
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  What Our Users Are Saying
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Real stories from users who have successfully reunited with
                  their items.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 lg:grid-cols-3 lg:gap-12">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="shadow-lg">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex gap-1 text-primary">
                      <Star className="w-5 h-5 fill-current" />
                      <Star className="w-5 h-5 fill-current" />
                      <Star className="w-5 h-5 fill-current" />
                      <Star className="w-5 h-5 fill-current" />
                      <Star className="w-5 h-5 fill-current" />
                    </div>
                    <p className="text-muted-foreground">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center gap-4 pt-4 border-t">
                      <Avatar>
                        <AvatarImage
                          src={testimonial.avatar}
                          alt={testimonial.name}
                        />
                        <AvatarFallback>
                          {testimonial.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
