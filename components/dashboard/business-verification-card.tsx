import { Button } from "@/components/ui/button";
import axios from "axios";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  isVerified: boolean;
  setIsVerified: (isVerified: boolean) => void;
};

export default function BusinessVerificationCardContent({
  isVerified,
  setIsVerified,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const handleVerify = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post("/api/whatsapp/business-verify");
      if (res.data.isVerified) {
        setIsVerified(true);
        toast.success("WhatsApp account verified successfully!");
      } else {
        toast.error("Failed to verify WhatsApp account. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying WhatsApp account:", error);
      toast.error("Failed to verify WhatsApp account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-between">
      {isLoading ? (
        <div className="flex items-center gap-3 text-green-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p className="font-medium">Verifying WhatsApp account...</p>
        </div>
      ) : isVerified ? (
        <div className="flex items-center gap-3 text-green-600">
          <CheckCircle className="w-6 h-6" />
          <p className="font-medium">
            Your Meta Business Account is successfully verified, enabling full
            access to the WhatsApp Business Platform.
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3 text-amber-600">
            <AlertCircle className="w-6 h-6" />
            <p className="font-medium">
              Verify your Meta Business Account to prevent messaging limits and
              unlock all WhatsApp Business features.
            </p>
          </div>
          <Button
            size="sm"
            className="text-black"
            onClick={handleVerify}
          >
            Verify Now
          </Button>
        </div>
      )}
    </div>
  );
}
