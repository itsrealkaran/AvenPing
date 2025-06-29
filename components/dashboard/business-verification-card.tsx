import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle } from "lucide-react";

type Props = {
  isVerified: boolean;
};

export default function BusinessVerificationCardContent({
  isVerified,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      {isVerified ? (
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
        </div>
      )}
    </div>
  );
}
