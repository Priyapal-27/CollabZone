import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/components/ui/phone-input";
import { NameInput } from "@/components/ui/name-input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import type { Event } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

const registrationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(50, "Full name must be less than 50 characters").regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  college: z.string().min(2, "College name must be at least 2 characters").max(100, "College name must be less than 100 characters"),
  course: z.string().min(2, "Course name must be at least 2 characters").max(50, "Course name must be less than 50 characters"),
  address: z.string().optional(),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

export default function RegisterEvent() {
  const [, params] = useRoute("/events/:id/register");
  const [, setLocation] = useLocation();
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const eventId = params?.id;

  const { data: event, isLoading } = useQuery<Event>({
    queryKey: [`/api/events/${eventId}`],
    enabled: !!eventId,
  });

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      college: "",
      course: "",
      address: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegistrationForm & { eventId: number; paymentScreenshot?: string }) => {
      const response = await apiRequest("POST", "/api/registrations", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful!",
        description: "You have been successfully registered for the event. You'll receive a confirmation email shortly.",
      });
      
      // Invalidate and refetch event data
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}`] });
      
      // Redirect to event detail page
      setLocation(`/events/${eventId}`);
    },
    onError: () => {
      toast({
        title: "Registration Failed",
        description: "There was an error processing your registration. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: RegistrationForm) => {
    if (!eventId || !event) return;

    let paymentScreenshotUrl = "";
    
    // If there's a fee and payment screenshot is required
    if (parseFloat(event.fee || '0') > 0 && paymentScreenshot) {
      // In a real implementation, this would upload the file
      paymentScreenshotUrl = `payment_${Date.now()}.png`;
    }

    registerMutation.mutate({
      ...data,
      eventId: parseInt(eventId),
      paymentScreenshot: paymentScreenshotUrl,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentScreenshot(file);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8">
              <div className="space-y-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Event Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The event you're trying to register for doesn't exist.
            </p>
            <Link href="/events">
              <Button>Browse Other Events</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isEventFull = event.maxParticipants && event.currentParticipants && 
                     event.currentParticipants >= event.maxParticipants;
  const isEventPast = new Date(event.date) < new Date();
  const eventFee = parseFloat(event.fee || '0');

  if (isEventPast || isEventFull) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href={`/events/${eventId}`}>
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Event
            </Button>
          </Link>
          
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Registration Not Available
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {isEventPast 
                ? "This event has already ended." 
                : "This event has reached its maximum capacity."}
            </p>
            <Link href="/events">
              <Button>Browse Other Events</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href={`/events/${eventId}`}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Event
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Register for {event.name}</CardTitle>
            <p className="text-gray-600 dark:text-gray-300">
              Fill out the form below to register for this event.
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <NameInput 
                          placeholder="Enter your full name" 
                          value={field.value}
                          onChange={field.onChange}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <PhoneInput 
                          placeholder="Enter 10 digit mobile number" 
                          value={field.value}
                          onChange={field.onChange}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="college"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>College/Institution</FormLabel>
                      <FormControl>
                        <Input placeholder="Your college name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="course"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course/Position</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., B.Tech CSE, 3rd Year" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter your address"
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Payment Section */}
                {eventFee > 0 && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                      Payment Details
                    </h3>
                    
                    <div className="text-center mb-6">
                      <div className="inline-block p-4 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4">
                        <div className="w-32 h-32 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-gray-500">QR Code</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        Scan QR code to pay <strong className="text-accent-custom">₹{event.fee}</strong>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Upload payment screenshot after payment
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Payment Screenshot
                      </label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="payment-screenshot"
                          required
                        />
                        <label
                          htmlFor="payment-screenshot"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {paymentScreenshot 
                              ? `Selected: ${paymentScreenshot.name}`
                              : "Click to upload payment screenshot"
                            }
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-accent-custom hover:bg-accent-custom-dark"
                  disabled={registerMutation.isPending || (eventFee > 0 && !paymentScreenshot)}
                >
                  {registerMutation.isPending ? "Submitting..." : "Submit Registration"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
