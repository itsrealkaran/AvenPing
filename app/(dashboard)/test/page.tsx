"use client";
import AddAttributeModal from "@/components/contacts/add-attribute-modal";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Page = () => {
  const [attributeModalOpen, setAttributeModalOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => {
        setAttributeModalOpen(true);
      }}>Test</Button>
      <AddAttributeModal
        isOpen={attributeModalOpen}
        onClose={() => setAttributeModalOpen(false)}
      />
    </div>
  );
};

export default Page;