
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, User, Lock } from "lucide-react";
import axios from "axios";
import bcrypt from "bcryptjs"
import { toast } from "sonner";

interface Step1Props {
  formData: {
    name: string;
    industry: string;
    size: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  updateFormData: (field: string, value: string) => void;
  onNext: () => void;
}

const Step1BasicInfo: React.FC<Step1Props> = ({
  formData,
  updateFormData,
  onNext,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (formData.password !== formData.confirmPassword) {
      setIsPasswordMatch(false)
    } else {
      setIsPasswordMatch(true)
    }
  }, [formData.confirmPassword, formData.password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true)
      const salt = await bcrypt.genSalt(Number(process.env.NEXT_PUBLIC_SALT_ROUND));
      const password = await bcrypt.hash(formData.password, salt)
      const confirmPassword = await bcrypt.hash(formData.confirmPassword, salt)

      await axios.post('/api/auth/signup', {
        name: formData.name,
        email: formData.email,
        password,
        confirm_password: confirmPassword,
        size: formData.size,
        industry: formData.industry
      })
      toast.success("Account created successfully")
      setIsLoading(false)
      onNext();
    } catch (err) {
      console.log(err)
      toast.error("Somthing went wrong")
      setIsLoading(false)
    }
  };

  const industries = [
    "E-commerce",
    "Real Estate",
    "Finance",
    "Education",
    "Healthcare",
    "Technology",
    "Food & Beverage",
    "Travel",
    "Other",
  ];

  const sizes = [
    "1-10",
    "11-50",
    "51-200",
    "201-500",
    "501-1000",
    "1000+",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fadeIn">
      <div className="space-y-2">
        <Label htmlFor="name">What should we call you?</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => updateFormData("name", e.target.value)}
            placeholder="Your name"
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry" className='mr-4'>Where can we help you?</Label>
        <Select
          value={formData.industry}
          onChange={(e) => updateFormData("industry", e.target.value)}
          required
          options={industries.map(industry => ({
            value: industry,
            label: industry
          }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="size" className='mr-4'>How many targeted clients?</Label>
        <Select
          value={formData.size}
          onChange={(e) => updateFormData("size", e.target.value)}
          required
          options={sizes.map(size => ({
            value: size,
            label: size
          }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Your primary email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
            placeholder="you@example.com"
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Set a strong password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => updateFormData("password", e.target.value)}
            placeholder="••••••••"
            className="pl-10 pr-10"
            required
            minLength={8}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Password must be at least 8 characters long
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            id="confirmpassword"
            type={showPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => updateFormData("confirmPassword", e.target.value)}
            placeholder="••••••••"
            className="pl-10 pr-10"
            required
            minLength={8}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </Button>
        </div>

        {!isPasswordMatch && (
          <div>
            <p className="text-rose-600 font-mono text-xs">Password and Confirm Password are not matching</p>
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full mt-6 bg-whatsapp hover:bg-whatsapp-dark"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Continue"}
      </Button>
    </form>
  );
};

export default Step1BasicInfo;
