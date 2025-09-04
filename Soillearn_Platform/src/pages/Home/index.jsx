import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import { 
  BookOpen, 
  Users, 
  Trophy, 
  TrendingUp, 
  ArrowRight,
  Leaf,
  Brain,
  Target
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = (role) => {
    if (role === 'student') {
      navigate('/student-dashboard');
    } else {
      navigate('/teacher-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole="guest"
        userName="Guest"
        onRoleChange={() => {}}
      />
      
      <main className="content-offset">
        {/* Hero Section */}
        <section className="px-6 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Leaf className="w-16 h-16 text-primary mr-4" />
              <h1 className="text-5xl font-bold text-foreground">SoilLearn</h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover the science of soil and plants through interactive learning, 
              real-time sensor data, and engaging quizzes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleGetStarted('student')}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-lg font-semibold flex items-center justify-center gap-2"
              >
                Start Learning
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleGetStarted('teacher')}
                className="px-8 py-4 border border-border text-foreground rounded-lg hover:bg-muted transition-colors text-lg font-semibold"
              >
                Teacher Dashboard
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-16 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Everything You Need to Learn About Soil Science
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-card rounded-lg border border-border shadow-card p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Interactive Learning</h3>
                <p className="text-muted-foreground">
                  Engage with comprehensive lessons on soil composition, plant biology, and agricultural science.
                </p>
              </div>

              <div className="bg-card rounded-lg border border-border shadow-card p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Real-time Data</h3>
                <p className="text-muted-foreground">
                  Monitor soil conditions with live sensor data including pH, moisture, and nutrient levels.
                </p>
              </div>

              <div className="bg-card rounded-lg border border-border shadow-card p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Science Quizzes</h3>
                <p className="text-muted-foreground">
                  Test your knowledge with interactive quizzes covering Science & Nature topics.
                </p>
              </div>

              <div className="bg-card rounded-lg border border-border shadow-card p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Classroom Management</h3>
                <p className="text-muted-foreground">
                  Teachers can create classrooms, track student progress, and manage learning activities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-12">
              Join the Growing Community
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6">
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-muted-foreground">Students Learning</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <div className="text-muted-foreground">Active Classrooms</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-primary mb-2">1000+</div>
                <div className="text-muted-foreground">Quizzes Completed</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-16 bg-primary/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of students exploring the fascinating world of soil science and plant biology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleGetStarted('student')}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-lg font-semibold flex items-center justify-center gap-2"
              >
                <Target className="w-5 h-5" />
                Start Learning Now
              </button>
              <button
                onClick={() => navigate('/quiz')}
                className="px-8 py-4 border border-border text-foreground rounded-lg hover:bg-muted transition-colors text-lg font-semibold flex items-center justify-center gap-2"
              >
                <Brain className="w-5 h-5" />
                Try a Quiz
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border px-6 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Leaf className="w-8 h-8 text-primary mr-2" />
            <span className="text-xl font-bold text-foreground">SoilLearn</span>
          </div>
          <p className="text-muted-foreground">
            Empowering the next generation of agricultural scientists and soil enthusiasts.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
