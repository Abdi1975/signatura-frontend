import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, LogIn, UserPlus, FileText, Shield, Users, CheckCircle, Sparkles, User, Phone, Briefcase, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    nic: "",
    position: "",
    phone: "",
    employeeNumber: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(isLogin ? "Login data:" : "Register data:", formData);
    alert(`${isLogin ? "Login" : "Registration"} form submitted!`);
  };

  const handleModeSwitch = () => {
    setFormData({
      name: "",
      nic: "",
      position: "",
      phone: "",
      employeeNumber: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
    setIsLogin(!isLogin);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side - Signatura branded section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 md:p-12 flex-col justify-center relative">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-white font-bold text-xl md:text-2xl">Signatura</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Digital Signatures Made Simple
        </h1>

        <p className="text-blue-100 text-base md:text-lg mb-8 max-w-md">
          Secure, legally-binding electronic signatures for all your business documents.
        </p>

        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-300" />
            <span className="text-white">Legally binding signatures</span>
          </div>
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-green-300" />
            <span className="text-white">Bank-level security</span>
          </div>
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-green-300" />
            <span className="text-white">Team collaboration</span>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="md:hidden flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-900 font-bold text-xl">Signatura</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {isLogin ? "Welcome Back" : "Buat Akun Baru"}
              </h2>
              <p className="text-gray-600 text-sm">
                {isLogin ? "Sign in to access your account" : "Daftar untuk memulai"}
              </p>
            </div>

            <div className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 font-medium">
                      Nama Lengkap
                    </Label>
                    <div className="relative">
                      <Input
                        id="name"
                        type="text"
                        placeholder="Masukkan nama lengkap"
                        className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                      />
                      <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nic" className="text-gray-700 font-medium">
                      NIC
                    </Label>
                    <div className="relative">
                      <Input
                        id="nic"
                        type="text"
                        placeholder="Masukkan NIC"
                        className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        value={formData.nic}
                        onChange={(e) => handleInputChange("nic", e.target.value)}
                      />
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position" className="text-gray-700 font-medium">
                      Pilih Posisi
                    </Label>
                    <div className="relative">
                      <Select value={formData.position} onValueChange={(value) => handleInputChange("position", value)}>
                        <SelectTrigger className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Pilih posisi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="supervisor">Supervisor</SelectItem>
                          <SelectItem value="team_lead">Team Leader</SelectItem>
                          <SelectItem value="employee">Employee</SelectItem>
                          <SelectItem value="intern">Intern</SelectItem>
                        </SelectContent>
                      </Select>
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700 font-medium">
                      Nomor HP
                    </Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Masukkan nomor HP"
                        className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employeeNumber" className="text-gray-700 font-medium">
                      Nomor Pegawai
                    </Label>
                    <div className="relative">
                      <Input
                        id="employeeNumber"
                        type="text"
                        placeholder="Masukkan nomor pegawai"
                        className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        value={formData.employeeNumber}
                        onChange={(e) => handleInputChange("employeeNumber", e.target.value)}
                      />
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Masukkan email"
                    className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    className="pl-10 pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                    Konfirmasi Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Konfirmasi password"
                      className="pl-10 pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                onClick={handleSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors duration-200"
              >
                <LogIn className="w-4 h-4 mr-2" />
                {isLogin ? "Sign In" : "Create Account"}
              </Button>

              {/* Quick Access Buttons */}
              <div className="space-y-2 pt-4">
                <p className="text-xs text-center text-gray-500 mb-2">Quick Access (Development)</p>
                <Button
                  onClick={() => window.location.href = '/user/dashboard'}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors duration-200"
                >
                  <User className="w-4 h-4 mr-2" />
                  Go to User Dashboard
                </Button>
                <Button
                  onClick={() => window.location.href = '/admin/dashboard'}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition-colors duration-200"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Go to Admin Dashboard
                </Button>
              </div>
            </div>

            <div className="text-center pt-4 border-t border-gray-100 mt-4">
              <p className="text-gray-600 text-sm">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={handleModeSwitch}
                  className="ml-1 text-blue-600 hover:text-blue-700 font-medium"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
