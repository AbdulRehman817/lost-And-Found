import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { cn } from "../lib/utils";
import {
  Calendar as CalendarIcon,
  Upload,
  Sparkles,
  CheckCircle,
  Loader2,
  Tag as TagIcon,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
export default function SubmitPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState(null);
  // const [suggestedTags, setSuggestedTags] = useState([]);
  const [activeTags, setActiveTags] = useState([]);
  // const [isAnalyzing, setIsAnalyzing] = useState(false);
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      // ✅ get token inside event handler
      const token = await getToken();

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("location", location);
      formData.append("image", imageFile);
      formData.append("type", type);
      formData.append("tags", activeTags.join(","));

      const response = await fetch(
        "https://pure-helenka-abdulrehmankashif-2b35ede6.koyeb.app/api/v1/createPost",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // ✅ correct placement
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      console.log("✅ Success:", data);
      navigate("/feed");
      // Reset form after successful post
      setTitle("");
      setDescription("");
      setCategory("");
      setLocation("");
      setImageFile(null);
      setType("");
      setActiveTags([]);
    } catch (err) {
      console.error("❌ Failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <Header />
      <main className="flex-1 ">
        <div className="container mx-auto px-4 py-8 md:px-6 lg:py-12 ">
          <Card className="max-w-3xl mx-auto bg-background/80">
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-3xl sm:text-4xl">
                Report an Item
              </CardTitle>
              <CardDescription className="text-lg">
                Fill out the form below to post a lost or found item.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <Label className="font-semibold text-base">
                    Is this item Lost or Found?
                  </Label>
                  <RadioGroup
                    className="flex gap-4"
                    onValueChange={(val) => setType(val)}
                    value={type}
                  >
                    <Label
                      htmlFor="lost"
                      className="flex items-center space-x-2 border rounded-md p-4 flex-1 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 cursor-pointer transition-colors"
                    >
                      <RadioGroupItem value="lost" id="lost" />
                      <span>I lost something</span>
                    </Label>
                    <Label
                      htmlFor="found"
                      className="flex items-center space-x-2 border rounded-md p-4 flex-1 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 cursor-pointer transition-colors"
                    >
                      <RadioGroupItem value="found" id="found" />
                      <span>I found something</span>
                    </Label>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="font-semibold">
                      Item Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g., Black Leather Wallet"
                      required
                      onChange={(e) => setTitle(e.target.value)}
                      value={title}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="font-semibold">
                      Category
                    </Label>
                    <Select
                      required
                      value={category}
                      onValueChange={(val) => setCategory(val)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="pets">Pets</SelectItem>
                        <SelectItem value="personal">Personal Items</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="font-semibold">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Provide details like brand, color, size, and any identifying features."
                    required
                    className="min-h-[120px]"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                  />
                </div>

                <div className="">
                  <div className="space-y-2">
                    <Label htmlFor="tags" className="font-semibold">
                      Tags
                    </Label>
                    <Input
                      id="tags"
                      placeholder="e.g., Central Park, near the fountain"
                      required
                      onChange={(e) => setActiveTags(e.target.value.split(","))}
                      value={activeTags.join(",")}
                    />
                  </div>
                </div>

                <div className="">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="font-semibold">
                      Location
                    </Label>
                    <Input
                      id="location"
                      placeholder="e.g., Central Park, near the fountain"
                      required
                      onChange={(e) => setLocation(e.target.value)}
                      value={location}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="font-semibold text-base">
                    Upload an Image
                  </Label>

                  <div className="flex flex-col items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground text-center">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground text-center">
                          PNG, JPG, or GIF
                        </p>
                      </div>
                      <Input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                      />
                    </label>

                    {/* Image Preview */}
                    {imageFile && (
                      <div className="mt-4 w-full flex justify-center">
                        <img
                          src={URL.createObjectURL(imageFile)}
                          alt="Preview"
                          className="max-h-64 rounded-lg object-contain border"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <CardFooter className="p-0 pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit Item"}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
