import { GraduationCap, BookOpen, Users, BarChart3, Star, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";

const features = [
  { icon: BarChart3, title: "Smart Analytics", desc: "Track performance with real-time grade insights" },
  { icon: Users, title: "Class Management", desc: "Manage students and assignments effortlessly" },
  { icon: BookOpen, title: "Course Hub", desc: "Access all your courses and materials in one place" },
];

const stats = [
  { value: "10K+", label: "Students" },
  { value: "500+", label: "Teachers" },
  { value: "98%", label: "Satisfaction" },
  { value: "50+", label: "Institutions" },
];

const testimonials = [
  { name: "Sarah M.", role: "Student", text: "GradeSphere made tracking my grades so much easier!", stars: 5 },
  { name: "Prof. James", role: "Teacher", text: "Managing my class has never been this seamless.", stars: 5 },
];

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">GradeSphere</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#stats" className="hover:text-foreground transition-colors">About</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Reviews</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">Sign In</Button>
            <Button size="sm">Get Started</Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden py-24 px-6">
          {/* Background blobs */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center relative">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full mb-6">
              <Star className="w-3 h-3 fill-primary" /> Trusted by 10,000+ students & teachers
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Welcome to{" "}
              <span className="text-primary">GradeSphere</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
              The all-in-one academic platform that connects students and teachers — track grades, manage courses, and achieve more together.
            </p>

            {/* Login Cards */}
            <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {/* Student Card */}
              <Card className="group hover:shadow-lg hover:border-primary/40 transition-all duration-300 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors mx-auto">
                    <BookOpen className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-center">I'm a Student</CardTitle>
                  <CardDescription className="text-center">
                    View grades, assignments & course progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-5 text-sm text-muted-foreground">
                    {["Track your grades", "Access course materials", "View feedback"].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full group/btn" size="lg">
                    Login as Student
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>

              {/* Teacher Card */}
              <Card className="group hover:shadow-lg hover:border-primary/40 transition-all duration-300 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors mx-auto">
                    <GraduationCap className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-center">I'm a Teacher</CardTitle>
                  <CardDescription className="text-center">
                    Manage classes, grades & student progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-5 text-sm text-muted-foreground">
                    {["Manage your classes", "Grade assignments", "Monitor performance"].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full group/btn" size="lg" variant="outline">
                    Login as Teacher
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              New here?{" "}
              <a href="#" className="text-primary font-medium hover:underline">
                Create a free account
              </a>
            </p>
          </div>
        </section>

        {/* Stats */}
        <section id="stats" className="py-16 px-6 bg-muted/40 border-y">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="text-4xl font-extrabold text-primary">{value}</p>
                <p className="text-sm text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Everything you need</h2>
              <p className="text-muted-foreground">Powerful tools built for modern education</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map(({ icon: Icon, title, desc }) => (
                <Card key={title} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <CardDescription>{desc}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 px-6 bg-muted/40 border-t">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">What people say</h2>
              <p className="text-muted-foreground">Loved by students and teachers alike</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {testimonials.map(({ name, role, text, stars }) => (
                <Card key={name} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: stars }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">"{text}"</p>
                    <div>
                      <p className="font-semibold text-sm">{name}</p>
                      <p className="text-xs text-muted-foreground">{role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold">GradeSphere</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} GradeSphere. All rights reserved. Built with ❤️ for education.
          </div>
        </div>
      </footer>
    </div>
  );
}
